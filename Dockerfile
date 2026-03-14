# ---- Stage 1: 构建前端 ----
FROM node:20-alpine AS frontend-build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY frontend/ ./
RUN pnpm run build

# ---- Stage 2: 运行时 (Python + Nginx) ----
FROM python:3.11-slim

# 安装 nginx 和必要工具
RUN apt-get update && \
    apt-get install -y --no-install-recommends nginx && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Python 依赖
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 复制后端代码
COPY backend/ ./

# 复制 aibot-python-sdk（后端通过 sys.path 加载）
COPY aibot-python-sdk/ /app/aibot-python-sdk/

# 复制前端构建产物到 nginx
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Nginx 配置
RUN cat > /etc/nginx/sites-available/default << 'NGINX'
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # 前端静态文件 + SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理到后端（保留 /api 前缀）
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # SSE 支持（AI 流式查询）
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 300s;
    }

    # 静态资源缓存
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX

# 启动脚本
RUN cat > /app/start.sh << 'SCRIPT'
#!/bin/sh
set -e

# 启动 nginx
nginx

# 启动后端
cd /app/backend
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
SCRIPT
RUN chmod +x /app/start.sh

EXPOSE 80

CMD ["/app/start.sh"]

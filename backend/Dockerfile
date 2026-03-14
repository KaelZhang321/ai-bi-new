# 使用华为云代拉的 Python 3.12 精简版镜像，兼顾体积与稳定性
FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/library/python:3.12-slim

# 安装 uv 提升依赖安装速度
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# 设置环境变量
# 1. 禁用 Python 缓存文件 (.pyc)
# 2. 强制标准输出直接打印，不进入缓冲区（方便查看日志）
# 3. 允许在系统级环境中安装 pip 包（解决外部环境管理报错）
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_BREAK_SYSTEM_PACKAGES=1 \
    TZ=Asia/Shanghai

WORKDIR /app/backend

# 第一步：更换 Debian 软件源为国内中科大镜像
RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list.d/debian.sources

# 第二步：安装必要的系统依赖
# 注意：libmariadb-dev-compat 解决了你之前的 mysqlclient 安装报错
RUN apt-get update && apt-get install -y \
    build-essential \
    libmariadb-dev-compat \
    libmariadb-dev \
    pkg-config \
    curl \
    tesseract-ocr \
    tesseract-ocr-chi-sim \
    tzdata \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 第三步：安装依赖 (使用 uv 和 BuildKit 缓存)
COPY backend/requirements.txt ./requirements.txt
RUN --mount=type=cache,target=/root/.cache/uv \
    uv pip install --system --no-cache -r ./requirements.txt \
    --extra-index-url https://pypi.tuna.tsinghua.edu.cn/simple 

# 第五步：复制项目源代码
COPY backend ./ 
COPY aibot-python-sdk /app/aibot-python-sdk

# 暴露后端端口
EXPOSE 8000


# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# 启动命令 (--proxy-headers 使 uvicorn 信任 nginx 代理头，正确识别 HTTPS)
CMD ["sh", "-c", "gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --workers ${GUNICORN_WORKERS:-2} --timeout ${GUNICORN_TIMEOUT:-120} --access-logfile - --error-logfile -"]

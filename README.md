# 会议 BI 数据看板系统

企业级商业智能数据看板系统，用于展示会议运营数据、客户分析、销售成交数据等多维度业务指标。

## 功能特性

- **核心数据 KPI** - 6个核心运营指标实时展示
- **报名 vs 签到** - 各区域客户报名与签到情况分析
- **客户画像分析** - 金额等级分布、身份类型、新老客户对比
- **客户来源追踪** - 按大区·来源统计，目标客户抵达情况
- **会议运营数据** - 签到、接机、离开、医院人数等运营指标
- **目标达成分析** - 各区域目标完成情况对比
- **方案情报** - 各成交方案的目标与达成情况

## 技术栈

### 前端

- React 19
- TypeScript
- Vite
- Ant Design 5
- ECharts
- React Router
- React Query
- Framer Motion

### 后端

- FastAPI
- SQLAlchemy
- MySQL
- Vanna (AI SQL 生成)

## 项目结构

```
ai-bi-new/
├── backend/                 # FastAPI 后端服务
│   ├── app/               # 应用代码
│   ├── requirements.txt   # Python 依赖
│   └── .env               # 环境变量
├── frontend/              # React 前端
│   ├── src/              # 源代码
│   └── package.json      # Node 依赖
├── docs/                 # 文档
│   └── 会议BI看板PRD.md  # 产品需求文档
├── docker-compose.yml    # Docker 配置
└── .env.example          # 环境变量示例
```

## 快速开始

### 前置要求

- Node.js 18+
- Python 3.10+
- Docker & Docker Compose (可选)

### 本地开发

#### 1. 克隆项目

```bash
git clone <repository-url>
cd ai-bi-new
```

#### 2. 配置环境变量

```bash
cp .env.example backend/.env
# 编辑 backend/.env 配置数据库连接等信息
```

#### 3. 使用 Docker Compose 启动

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

服务启动后：
- 前端：http://localhost:5173
- 后端：http://localhost:8000
- API 文档：http://localhost:8000/docs

#### 4. 手动启动（可选）

**后端：**

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**前端：**

```bash
cd frontend
pnpm install
pnpm dev
```

## 数据表说明

| 表名 | 说明 | 记录数 |
|------|------|--------|
| meeting_registration | 报名客户信息表 | 1,250 |
| meeting_customer_analysis | 客户分析表 | 3,676 |
| meeting_schedule_stats | 运营时段统计表 | 88 |
| meeting_transaction_details | 成交明细表 | 5 |
| meeting_region_transaction_targets | 区域成交目标配置表 | 11 |
| meeting_region_proposal_targets | 区域方案目标配置表 | 0 |

详细数据结构请参考 [会议BI看板PRD.md](./docs/会议BI看板PRD.md)

## API 文档

启动后端服务后，访问 http://localhost:8000/docs 查看完整的 API 文档。

## 部署

项目支持 Docker 容器化生产部署：

```bash
# 首次部署前准备配置
cp .env.example backend/.env
# 编辑 backend/.env 填入生产环境数据库和密钥

# 一键构建并启动
./deploy.sh start

# 查看状态
./deploy.sh status

# 查看日志
./deploy.sh logs

# 停止服务
./deploy.sh stop
```

默认端口：
- 前端（Web + H5）：`http://localhost`
- 后端 API：`http://localhost:8000`
- API 文档：`http://localhost:8000/docs`

如需修改端口，可在执行前临时指定环境变量：

```bash
FRONTEND_PORT=8080 BACKEND_PORT=18000 ./deploy.sh start
```

## 开发指南

### 后端开发

- 使用 SQLAlchemy ORM 进行数据库操作
- API 路由定义在 `app/routes/` 目录
- 使用 Pydantic 进行数据验证

### 前端开发

- 组件放在 `src/components/` 目录
- 页面放在 `src/pages/` 目录
- 使用 React Query 管理服务端状态

## 许可证

MIT License

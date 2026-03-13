from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.db.session import engine
from app.api.router import api_router
from app.wecom.longconn import wecom_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: verify DB connection
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✓ Database connected")
    except Exception as e:
        print(f"✗ Database connection failed: {e}")

    # Startup: 启动企业微信长连接
    await wecom_manager.start()

    yield

    # Shutdown: 断开企业微信长连接
    await wecom_manager.stop()

    # Shutdown: 关闭数据库连接池
    engine.dispose()


app = FastAPI(
    title="会议BI看板系统",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/api/health")
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}

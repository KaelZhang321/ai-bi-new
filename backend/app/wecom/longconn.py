"""
企业微信智能机器人长连接管理器

基于官方 aibot-python-sdk 封装，与 FastAPI lifespan 集成。
在应用启动时建立 WebSocket 长连接，应用关闭时断开。
"""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone
from typing import Optional

from app.config import settings
from app.wecom.utils import ensure_local_sdk_on_path

logger = logging.getLogger("wecom.longconn")


class _SDKLogger:
    """将 SDK 日志桥接到 Python logging"""

    def debug(self, message: str, *args) -> None:
        logger.debug(message, *args)

    def info(self, message: str, *args) -> None:
        logger.info(message, *args)

    def warn(self, message: str, *args) -> None:
        logger.warning(message, *args)

    def error(self, message: str, *args) -> None:
        logger.error(message, *args)


class WeComLongConnManager:
    """
    企业微信长连接管理器

    职责:
    - 管理 WSClient 生命周期（连接、断开）
    - 注册消息/事件处理器
    - 提供连接状态查询
    """

    def __init__(self) -> None:
        self._client = None  # WSClient 实例，延迟初始化
        self._task: Optional[asyncio.Task] = None
        self._connected_at: Optional[datetime] = None
        self._last_error: Optional[str] = None
        self._message_count: int = 0
        self._enabled: bool = False

    @property
    def is_enabled(self) -> bool:
        return self._enabled

    @property
    def is_connected(self) -> bool:
        return self._client is not None and self._client.is_connected

    @property
    def status(self) -> dict:
        return {
            "enabled": self._enabled,
            "connected": self.is_connected,
            "connected_at": self._connected_at.isoformat() if self._connected_at else None,
            "message_count": self._message_count,
            "last_error": self._last_error,
        }

    def increment_message_count(self) -> None:
        self._message_count += 1

    @property
    def client(self):
        return self._client

    async def start(self) -> None:
        """启动长连接（在 FastAPI lifespan startup 中调用）"""
        if not settings.WECOM_ENABLE_LONG_CONN:
            logger.info("企业微信长连接未启用 (WECOM_ENABLE_LONG_CONN=false)")
            return

        if not settings.WECOM_BOT_ID or not settings.WECOM_BOT_SECRET:
            logger.warning("企业微信长连接配置不完整，缺少 WECOM_BOT_ID 或 WECOM_BOT_SECRET")
            return

        self._enabled = True

        # 确保 SDK 可导入
        ensure_local_sdk_on_path()

        try:
            from aibot import WSClient, WSClientOptions

            self._client = WSClient(
                WSClientOptions(
                    bot_id=settings.WECOM_BOT_ID,
                    secret=settings.WECOM_BOT_SECRET,
                    reconnect_interval=settings.WECOM_RECONNECT_INTERVAL_MS,
                    max_reconnect_attempts=settings.WECOM_MAX_RECONNECT_ATTEMPTS,
                    heartbeat_interval=settings.WECOM_HEARTBEAT_INTERVAL_MS,
                    ws_url=settings.WECOM_WS_ENDPOINT,
                    logger=_SDKLogger(),
                )
            )

            # 注册连接生命周期事件
            self._setup_lifecycle_events()

            # 注册消息/事件处理器
            self._setup_handlers()

            # 后台启动连接
            self._task = asyncio.create_task(self._connect_with_retry())

            logger.info("企业微信长连接管理器已启动")

        except ImportError as e:
            self._last_error = f"SDK 导入失败: {e}"
            logger.error(
                "aibot SDK 导入失败，请确认依赖已安装: "
                "pip install -r requirements.txt\n"
                f"错误详情: {e}"
            )
        except Exception as e:
            self._last_error = str(e)
            logger.error(f"长连接管理器启动失败: {e}")

    async def _connect_with_retry(self) -> None:
        """建立连接，SDK 内部已有重连机制"""
        try:
            await self._client.connect()
        except Exception as e:
            self._last_error = str(e)
            logger.error(f"WebSocket 连接失败: {e}")

    def _setup_lifecycle_events(self) -> None:
        """注册连接生命周期回调"""

        @self._client.on("connected")
        def on_connected():
            logger.info("WebSocket 已连接")

        @self._client.on("authenticated")
        def on_authenticated():
            self._connected_at = datetime.now(timezone.utc)
            self._last_error = None
            logger.info("企业微信认证成功，长连接已就绪")

        @self._client.on("disconnected")
        def on_disconnected(reason):
            self._connected_at = None
            self._last_error = f"连接断开: {reason}"
            logger.warning(f"WebSocket 连接断开: {reason}")

        @self._client.on("reconnecting")
        def on_reconnecting(attempt):
            logger.info(f"正在进行第 {attempt} 次重连...")

        @self._client.on("error")
        def on_error(error):
            self._last_error = str(error)
            logger.error(f"WebSocket 错误: {error}")

    def _setup_handlers(self) -> None:
        """注册消息和事件处理器"""
        # 延迟导入，避免循环依赖
        from app.wecom.handlers import (
            handle_text_message,
            handle_image_message,
            handle_file_message,
            handle_voice_message,
            handle_enter_chat,
            handle_template_card_event,
            handle_feedback_event,
        )

        # 消息处理
        @self._client.on("message.text")
        async def on_text(frame):
            self.increment_message_count()
            await handle_text_message(self._client, frame)

        @self._client.on("message.image")
        async def on_image(frame):
            self.increment_message_count()
            await handle_image_message(self._client, frame)

        @self._client.on("message.voice")
        async def on_voice(frame):
            self.increment_message_count()
            await handle_voice_message(self._client, frame)

        @self._client.on("message.file")
        async def on_file(frame):
            self.increment_message_count()
            await handle_file_message(self._client, frame)

        # 事件处理
        @self._client.on("event.enter_chat")
        async def on_enter_chat(frame):
            await handle_enter_chat(self._client, frame)

        @self._client.on("event.template_card_event")
        async def on_template_card(frame):
            await handle_template_card_event(self._client, frame)

        @self._client.on("event.feedback_event")
        async def on_feedback(frame):
            await handle_feedback_event(self._client, frame)

    async def stop(self) -> None:
        """停止长连接（在 FastAPI lifespan shutdown 中调用）"""
        if self._client:
            self._client.disconnect()
            logger.info("企业微信长连接已断开")

        if self._task and not self._task.done():
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass

        self._connected_at = None
        self._enabled = False


# 全局单例
wecom_manager = WeComLongConnManager()

"""
Bot 订阅用户注册表

记录与 bot 交互过的用户 ID，供定时推送使用。
使用文件持久化，应用重启后不会丢失。
"""

from __future__ import annotations

import json
import logging
import threading
from pathlib import Path

logger = logging.getLogger("wecom.subscribers")

_DATA_FILE = Path(__file__).resolve().parent.parent.parent / "data" / "subscribers.json"
_lock = threading.Lock()
_subscribers: set[str] = set()
_loaded = False


def _ensure_loaded() -> None:
    """首次调用时从文件加载"""
    global _loaded
    if _loaded:
        return
    with _lock:
        if _loaded:
            return
        if _DATA_FILE.exists():
            try:
                data = json.loads(_DATA_FILE.read_text(encoding="utf-8"))
                _subscribers.update(data)
                logger.info(f"已加载 {len(_subscribers)} 个订阅用户")
            except Exception as e:
                logger.error(f"加载订阅用户失败: {e}")
        _loaded = True


def _save() -> None:
    """持久化到文件"""
    try:
        _DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        _DATA_FILE.write_text(
            json.dumps(sorted(_subscribers), ensure_ascii=False),
            encoding="utf-8",
        )
    except Exception as e:
        logger.error(f"保存订阅用户失败: {e}")


def add_subscriber(userid: str) -> None:
    """添加订阅用户"""
    if not userid:
        return
    _ensure_loaded()
    with _lock:
        if userid not in _subscribers:
            _subscribers.add(userid)
            _save()
            logger.info(f"新增订阅用户: {userid}，当前共 {len(_subscribers)} 人")


def get_all_subscribers() -> list[str]:
    """获取所有订阅用户 ID"""
    _ensure_loaded()
    with _lock:
        return list(_subscribers)

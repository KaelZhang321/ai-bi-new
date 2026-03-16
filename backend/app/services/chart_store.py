"""
图表数据缓存

使用内存 TTL 缓存存储 ChartConfig，供企业微信卡片链接跳转查看。
"""

from __future__ import annotations

import time
import uuid
import threading
from typing import Any


_store: dict[str, dict[str, Any]] = {}
_lock = threading.Lock()

# 缓存过期时间（秒）：24 小时
TTL_SECONDS = 86400


def save_chart(chart_config) -> str:
    """保存图表配置，返回 chart_id"""
    chart_id = uuid.uuid4().hex[:12]
    data = {
        "chart_type": chart_config.chart_type,
        "categories": chart_config.categories,
        "series": chart_config.series,
    }
    with _lock:
        _cleanup_expired()
        _store[chart_id] = {
            "data": data,
            "created_at": time.time(),
        }
    return chart_id


def get_chart(chart_id: str) -> dict[str, Any] | None:
    """获取图表配置，如不存在或已过期返回 None"""
    with _lock:
        entry = _store.get(chart_id)
        if not entry:
            return None
        if time.time() - entry["created_at"] > TTL_SECONDS:
            del _store[chart_id]
            return None
        return entry["data"]


def _cleanup_expired() -> None:
    """清理过期条目"""
    now = time.time()
    expired = [k for k, v in _store.items() if now - v["created_at"] > TTL_SECONDS]
    for k in expired:
        del _store[k]

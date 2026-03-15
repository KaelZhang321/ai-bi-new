"""
会话上下文缓存 - 支持 AI 多轮对话改写
"""

import time
import threading
from dataclasses import dataclass, field

MAX_ROUNDS = 5
TTL_SECONDS = 30 * 60  # 30 分钟


@dataclass
class QARound:
    question: str       # 用户原始问题
    rewritten: str      # 改写后的完整问题
    sql: str = ""       # 生成的 SQL
    answer: str = ""    # 回答摘要


@dataclass
class ConversationContext:
    rounds: list[QARound] = field(default_factory=list)
    last_active: float = field(default_factory=time.time)


_store: dict[str, ConversationContext] = {}
_lock = threading.Lock()


def _cleanup_expired() -> None:
    now = time.time()
    expired = [k for k, v in _store.items() if now - v.last_active > TTL_SECONDS]
    for k in expired:
        del _store[k]


def get_last_question(conversation_id: str) -> str | None:
    """返回上一轮的 rewritten question，用于 generate_rewritten_question。"""
    with _lock:
        _cleanup_expired()
        ctx = _store.get(conversation_id)
        if ctx and ctx.rounds:
            ctx.last_active = time.time()
            return ctx.rounds[-1].rewritten
        return None


def save_round(conversation_id: str, qa_round: QARound) -> None:
    """保存当前轮到缓存。"""
    with _lock:
        _cleanup_expired()
        if conversation_id not in _store:
            _store[conversation_id] = ConversationContext()
        ctx = _store[conversation_id]
        ctx.rounds.append(qa_round)
        if len(ctx.rounds) > MAX_ROUNDS:
            ctx.rounds = ctx.rounds[-MAX_ROUNDS:]
        ctx.last_active = time.time()


def get_recent_rounds(conversation_id: str, n: int = 3) -> list[QARound]:
    """取最近 n 轮，用于回答生成 prompt。"""
    with _lock:
        ctx = _store.get(conversation_id)
        if ctx and ctx.rounds:
            ctx.last_active = time.time()
            return ctx.rounds[-n:]
        return []

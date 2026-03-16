"""
定时推送服务

每天中午 12:00 和晚上 19:00 通过群机器人 Webhook 向群聊推送 KPI 摘要。
"""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone, timedelta

import aiohttp

from app.db.session import SessionLocal
from app.services.kpi_service import get_kpi_overview
from app.config import settings

logger = logging.getLogger("wecom.scheduler")

MOBILE_URL = "https://digital-admin.ssjt101.com/meeting/mobile"

# 北京时间 UTC+8
CST = timezone(timedelta(hours=8))

# 推送时间点（时, 分）
PUSH_TIMES = [(12, 0), (18, 0), (21, 0)]

# 群机器人 Webhook 地址
WEBHOOK_URL = settings.WECOM_WEBHOOK_URL


def _now_cst() -> datetime:
    return datetime.now(CST)


def _build_kpi_summary() -> str | None:
    """查询数据库并构建 KPI 摘要文本（Markdown 格式）"""
    try:
        db = SessionLocal()
        try:
            kpi = get_kpi_overview(db)
        finally:
            db.close()

        now = _now_cst().strftime("%Y-%m-%d %H:%M")

        summary = (
            f"**318梅赛尔国际健康节 · 数据速报**\n"
            f"> 更新时间：{now}\n\n"
            f"📊 **核心指标一览**\n\n"
            f"👥 报名客户：**{int(kpi.registered_customers.value)}** 人\n"
            f"✅ 已抵达客户：**{int(kpi.arrived_customers.value)}** 人\n"
            f"💰 已成交金额：**¥{kpi.deal_amount.value:,.2f}** 万\n"
            f"📉 新规划消耗：**¥{kpi.consumed_budget.value:,.2f}** 万\n"
            f"💵 已收款金额：**¥{kpi.received_amount.value:,.2f}** 万\n"
            f"📈 总投资回报率：**{kpi.roi.value:.2f}%**\n\n"
            f"[点击查看完整大屏]({MOBILE_URL})"
        )
        return summary
    except Exception as e:
        logger.error(f"构建 KPI 摘要失败: {e}")
        return None


async def push_via_webhook() -> None:
    """通过群机器人 Webhook 推送 KPI 摘要"""
    if not WEBHOOK_URL:
        logger.warning("未配置 WECOM_WEBHOOK_URL，跳过推送")
        return

    summary = _build_kpi_summary()
    if not summary:
        return

    try:
        body = {
            "msgtype": "markdown",
            "markdown": {"content": summary},
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(WEBHOOK_URL, json=body) as resp:
                data = await resp.json()

        if data.get("errcode", 0) != 0:
            logger.error(f"Webhook 推送失败: errcode={data.get('errcode')}, errmsg={data.get('errmsg')}")
        else:
            logger.info("KPI 摘要已通过 Webhook 推送到群聊")

    except Exception as e:
        logger.error(f"Webhook 推送异常: {e}")


async def _scheduler_loop() -> None:
    """定时调度主循环"""
    pushed_today: dict[str, set[tuple[int, int]]] = {}

    while True:
        now = _now_cst()
        today_str = now.strftime("%Y-%m-%d")
        current_time = (now.hour, now.minute)

        if today_str not in pushed_today:
            pushed_today.clear()
            pushed_today[today_str] = set()

        today_pushed = pushed_today[today_str]

        if current_time in PUSH_TIMES and current_time not in today_pushed:
            logger.info(f"触发定时推送: {now.strftime('%Y-%m-%d %H:%M')} CST")
            await push_via_webhook()
            today_pushed.add(current_time)

        await asyncio.sleep(30)


def start_scheduler() -> asyncio.Task:
    """启动定时推送调度器"""
    now = _now_cst()
    logger.info(
        f"定时推送调度器已启动 | 当前北京时间: {now.strftime('%Y-%m-%d %H:%M:%S')} | "
        f"推送时间: {[f'{h:02d}:{m:02d}' for h, m in PUSH_TIMES]} | "
        f"Webhook: {'已配置' if WEBHOOK_URL else '未配置'}"
    )
    return asyncio.create_task(_scheduler_loop())

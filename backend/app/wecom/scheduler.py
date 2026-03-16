"""
定时推送服务

每天中午 12:00 和晚上 19:00 向企业微信应用可见范围内的用户推送 KPI 摘要。
"""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime, time as dtime

from app.db.session import SessionLocal
from app.services.kpi_service import get_kpi_overview

logger = logging.getLogger("wecom.scheduler")

MOBILE_URL = "https://digital-admin.ssjt101.com/meeting/mobile"

# 推送时间点（时, 分）
PUSH_TIMES = [(12, 0), (19, 0)]


def _build_kpi_summary() -> str | None:
    """查询数据库并构建 KPI 摘要文本（Markdown 格式）"""
    try:
        db = SessionLocal()
        try:
            kpi = get_kpi_overview(db)
        finally:
            db.close()

        now = datetime.now().strftime("%Y-%m-%d %H:%M")

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
            f"[👉 点击查看完整大屏]({MOBILE_URL})"
        )
        return summary
    except Exception as e:
        logger.error(f"构建 KPI 摘要失败: {e}")
        return None


async def _push_kpi_summary(client) -> None:
    """通过 REST API 向所有可见用户推送 KPI 摘要"""
    from app.wecom.media import get_access_token, _get_agent_id
    import aiohttp

    summary = _build_kpi_summary()
    if not summary:
        return

    try:
        token = await get_access_token()
        agent_id = await _get_agent_id()

        url = f"https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token={token}"
        body = {
            "touser": "@all",
            "msgtype": "markdown",
            "agentid": agent_id,
            "markdown": {"content": summary},
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=body) as resp:
                data = await resp.json()

        if data.get("errcode", 0) != 0:
            logger.error(f"推送失败: errcode={data.get('errcode')}, errmsg={data.get('errmsg')}")
        else:
            logger.info(f"KPI 摘要已推送给所有用户")

    except Exception as e:
        logger.error(f"定时推送异常: {e}")


async def _scheduler_loop(get_client) -> None:
    """定时调度主循环，每分钟检查一次是否到达推送时间点"""
    pushed_today: set[tuple[int, int]] = set()

    while True:
        now = datetime.now()
        current_time = (now.hour, now.minute)

        # 新的一天重置已推送记录
        if current_time == (0, 0):
            pushed_today.clear()

        # 检查是否到达推送时间
        if current_time in PUSH_TIMES and current_time not in pushed_today:
            client = get_client()
            if client and client.is_connected:
                logger.info(f"触发定时推送: {now.strftime('%H:%M')}")
                await _push_kpi_summary(client)
                pushed_today.add(current_time)
            else:
                logger.warning("企微长连接未就绪，跳过本次推送")

        # 每 30 秒检查一次
        await asyncio.sleep(30)


def start_scheduler(get_client) -> asyncio.Task:
    """
    启动定时推送调度器

    :param get_client: 获取 WSClient 实例的回调（lambda: wecom_manager.client）
    :return: asyncio Task
    """
    logger.info(f"定时推送调度器已启动，推送时间: {[f'{h:02d}:{m:02d}' for h, m in PUSH_TIMES]}")
    return asyncio.create_task(_scheduler_loop(get_client))

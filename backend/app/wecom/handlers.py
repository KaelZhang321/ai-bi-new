"""
企业微信消息与事件处理器

将企业微信回调路由到现有业务服务（AI 问数、KPI 查询等）。
所有 handler 均为 async 函数，接收 WSClient 实例和原始帧。
"""

from __future__ import annotations

import time
import logging
from typing import TYPE_CHECKING

from app.db.session import SessionLocal
from app.ai.query_executor import execute_ai_query
from app.services.chart_store import save_chart

if TYPE_CHECKING:
    from aibot import WSClient
    from aibot.types import WsFrame

logger = logging.getLogger("wecom.handlers")

MOBILE_URL = "https://digital-admin.ssjt101.com/meeting/mobile"
CHART_BASE_URL = "https://digital-admin.ssjt101.com/meeting/chart"


def _get_text_content(frame: dict) -> str:
    """从消息帧中提取文本内容"""
    return frame.get("body", {}).get("text", {}).get("content", "").strip()


def _get_sender_info(frame: dict) -> dict:
    """提取发送者信息"""
    body = frame.get("body", {})
    return {
        "userid": body.get("from", {}).get("userid", ""),
        "name": body.get("from", {}).get("name", ""),
        "chatid": body.get("chatid", ""),
    }


def _strip_markdown(text: str) -> str:
    """移除 Markdown 格式符号，保留纯文本"""
    import re
    # 移除表格分隔行 |---|---|
    text = re.sub(r'\n\s*\|[-:| ]+\|\s*\n', '\n', text)
    # 移除表格竖线，保留内容
    text = re.sub(r'\|', ' ', text)
    # 移除加粗/斜体
    text = re.sub(r'\*{1,3}(.+?)\*{1,3}', r'\1', text)
    # 移除标题符号
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    # 移除代码块
    text = re.sub(r'```[\s\S]*?```', '', text)
    # 移除行内代码
    text = re.sub(r'`(.+?)`', r'\1', text)
    # 移除链接，保留文字
    text = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', text)
    # 移除列表符号
    text = re.sub(r'^[\s]*[-*+]\s+', '', text, flags=re.MULTILINE)
    # 移除多余空行
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def _build_result_card(answer: str, result, chart_config, chart_url: str | None = None) -> dict:
    """构建模板卡片，包含 AI 回答文字 + 移动端大屏链接 + 图表链接"""
    row_count = len(result.rows)

    title = "查询结果"
    if chart_config:
        chart_type_map = {
            "pie": "饼图", "bar": "柱状图", "horizontal_bar": "条形图",
            "grouped_bar": "分组柱状图", "line": "折线图",
        }
        title = f"查询结果（含{chart_type_map.get(chart_config.chart_type, '图表')}）"

    # 截断过长的回答，移除 Markdown 格式
    clean_answer = _strip_markdown(answer)
    display_answer = clean_answer if len(clean_answer) <= 500 else clean_answer[:497] + "..."

    horizontal_content_list = [
        {"keyname": "数据来源", "value": "318梅赛尔国际健康节"},
    ]
    if chart_url:
        horizontal_content_list.append(
            {"keyname": "查看图表", "value": "点击查看 →", "type": 1, "url": chart_url}
        )
    horizontal_content_list.append(
        {"keyname": "查看大屏", "value": "点击打开 →", "type": 1, "url": MOBILE_URL}
    )

    jump_list = []
    if chart_url:
        jump_list.append({"type": 1, "title": "查看图表", "url": chart_url})
    jump_list.append({"type": 1, "title": "打开移动端大屏", "url": MOBILE_URL})

    return {
        "card_type": "text_notice",
        "source": {"desc": "BI 智能助手"},
        "main_title": {"title": title, "desc": f"共 {row_count} 条数据"},
        "sub_title_text": display_answer,
        "horizontal_content_list": horizontal_content_list,
        "jump_list": jump_list,
        "card_action": {"type": 1, "url": chart_url or MOBILE_URL},
        "task_id": f"task_{int(time.time() * 1000)}",
    }


async def handle_text_message(client: "WSClient", frame: dict) -> None:
    """
    处理文本消息

    将用户输入路由到 AI 问数服务，通过流式消息 + 模板卡片返回结果。
    """
    from aibot.utils import generate_req_id

    text = _get_text_content(frame)
    sender = _get_sender_info(frame)

    if not text:
        return

    logger.info(f"收到文本消息: user={sender['userid']}, text={text[:100]}")

    stream_id = generate_req_id("stream")
    feedback_id = generate_req_id("fb")

    # 第一步：发送"思考中"的中间状态（纯流式，不带卡片）
    try:
        await client.reply_stream(
            frame, stream_id, "正在查询中，请稍候...", finish=False,
            feedback={"id": feedback_id},
        )
    except Exception as e:
        logger.error(f"发送中间状态失败: {e}")
        return

    # 第二步：执行 AI 查询
    chart_config = None
    template_card = None
    try:
        db = SessionLocal()
        try:
            conversation_id = f"wecom_{sender['userid']}" if sender['userid'] else None
            result = execute_ai_query(text, db, conversation_id=conversation_id)
        finally:
            db.close()

        reply_content = result.answer if result.answer else "未能找到相关数据，请尝试换一种问法。"
        chart_config = result.chart
        logger.info(
            f"查询结果: rows={len(result.rows)}, columns={result.columns}, "
            f"chart={'有' if chart_config else '无'}({chart_config.chart_type if chart_config else 'N/A'})"
        )

        # 有数据时构建模板卡片（把 AI 回答放进卡片）
        if result.rows:
            chart_url = None
            if chart_config:
                chart_id = save_chart(chart_config)
                chart_url = f"{CHART_BASE_URL}/{chart_id}"
                logger.info(f"图表已缓存: chart_id={chart_id}")
            template_card = _build_result_card(reply_content, result, chart_config, chart_url)

    except Exception as e:
        logger.error(f"AI 查询执行失败: {e}")
        reply_content = f"查询出错了，请稍后重试。\n错误信息: {e}"

    # 第三步：结束流式消息（保留完整 AI 回答）
    try:
        await client.reply_stream(
            frame, stream_id, reply_content, finish=True,
        )
        logger.info(f"流式回复已发送: user={sender['userid']}")
    except Exception as e:
        logger.error(f"发送流式回复失败: {e}")
        return

    # 第四步：单独发送模板卡片
    if template_card:
        try:
            await client.reply_template_card(
                frame, template_card,
                feedback={"id": feedback_id},
            )
            logger.info(f"卡片已发送: user={sender['userid']}")
        except Exception as e:
            logger.error(f"发送卡片失败: {e}")

    # 第五步：如有图表，上传素材后通过 bot 发送图片
    if chart_config:
        await _send_chart_image(client, sender, chart_config)


async def handle_image_message(client: "WSClient", frame: dict) -> None:
    """处理图片消息"""
    from aibot.utils import generate_req_id

    sender = _get_sender_info(frame)
    logger.info(f"收到图片消息: user={sender['userid']}")

    stream_id = generate_req_id("stream")
    await client.reply_stream(
        frame,
        stream_id,
        "暂不支持图片消息处理，请发送文字描述您的查询需求。",
        finish=True,
    )


async def handle_voice_message(client: "WSClient", frame: dict) -> None:
    """
    处理语音消息

    企业微信会自动将语音转为文字，提取转写文本后按文本消息处理。
    """
    body = frame.get("body", {})
    voice_text = body.get("voice", {}).get("content", "").strip()

    if voice_text:
        # 将语音转写文本注入 body.text.content，复用文本消息处理逻辑
        if "text" not in body:
            body["text"] = {}
        body["text"]["content"] = voice_text
        frame["body"] = body
        await handle_text_message(client, frame)
    else:
        from aibot.utils import generate_req_id

        stream_id = generate_req_id("stream")
        await client.reply_stream(
            frame,
            stream_id,
            "语音识别失败，请尝试重新发送或使用文字输入。",
            finish=True,
        )


async def handle_file_message(client: "WSClient", frame: dict) -> None:
    """处理文件消息"""
    from aibot.utils import generate_req_id

    sender = _get_sender_info(frame)
    logger.info(f"收到文件消息: user={sender['userid']}")

    stream_id = generate_req_id("stream")
    await client.reply_stream(
        frame,
        stream_id,
        "暂不支持文件消息处理，请发送文字描述您的查询需求。",
        finish=True,
    )


async def handle_enter_chat(client: "WSClient", frame: dict) -> None:
    """
    处理进入会话事件

    用户当天首次进入机器人单聊时触发，需在 5 秒内回复欢迎语。
    """
    sender = _get_sender_info(frame)
    logger.info(f"用户进入会话: user={sender['userid']}")

    try:
        await client.reply_welcome(
            frame,
            {
                "msgtype": "text",
                "text": {
                    "content": (
                        "你好！我是会议 BI 智能助手，可以帮你查询各类业务数据。\n\n"
                        "你可以这样问我：\n"
                        "- 今天的报名数据是多少？\n"
                        "- 本周签到率如何？\n"
                        "- 各渠道来源对比\n\n"
                        "直接输入你的问题即可开始查询。"
                    )
                },
            },
        )
    except Exception as e:
        logger.error(f"发送欢迎语失败: {e}")


async def handle_template_card_event(client: "WSClient", frame: dict) -> None:
    """处理模板卡片事件（用户点击卡片按钮）"""
    body = frame.get("body", {})
    event = body.get("event", {})
    event_key = event.get("event_key", "")

    logger.info(f"收到模板卡片事件: event_key={event_key}")


async def handle_feedback_event(client: "WSClient", frame: dict) -> None:
    """处理用户反馈事件"""
    body = frame.get("body", {})
    event = body.get("event", {})

    logger.info(f"收到用户反馈事件: {event}")


async def _send_chart_image(client, sender: dict, chart_config) -> None:
    """渲染图表，上传临时素材，通过 bot 发送图片"""
    from app.wecom.chart_renderer import render_chart
    from app.wecom.media import upload_image, send_image_to_user

    try:
        img_bytes = render_chart(chart_config)
        if not img_bytes:
            return

        media_id = await upload_image(img_bytes)

        chatid = sender.get("chatid") or sender.get("userid")
        if not chatid:
            return

        try:
            await client.send_message(
                chatid,
                {"msgtype": "image", "image": {"media_id": media_id}},
            )
            logger.info(f"图表图片已发送: chatid={chatid}")
        except Exception as ws_err:
            logger.warning(f"bot 发送图片失败: {ws_err}，回退到 REST API")
            userid = sender.get("userid")
            if userid:
                await send_image_to_user(userid, media_id)

    except Exception as e:
        logger.error(f"图表发送失败: {e}")

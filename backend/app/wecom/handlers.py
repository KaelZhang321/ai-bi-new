"""
企业微信消息与事件处理器

将企业微信回调路由到现有业务服务（AI 问数、KPI 查询等）。
所有 handler 均为 async 函数，接收 WSClient 实例和原始帧。
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from app.db.session import SessionLocal
from app.ai.query_executor import execute_ai_query

if TYPE_CHECKING:
    from aibot import WSClient
    from aibot.types import WsFrame

logger = logging.getLogger("wecom.handlers")


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


async def handle_text_message(client: "WSClient", frame: dict) -> None:
    """
    处理文本消息

    将用户输入路由到 AI 问数服务，通过流式消息返回结果。
    """
    from aibot.utils import generate_req_id

    text = _get_text_content(frame)
    sender = _get_sender_info(frame)

    if not text:
        return

    logger.info(f"收到文本消息: user={sender['userid']}, text={text[:100]}")

    stream_id = generate_req_id("stream")

    # 第一步：发送"思考中"的中间状态
    try:
        await client.reply_stream(
            frame, stream_id, "正在查询中，请稍候...", finish=False
        )
    except Exception as e:
        logger.error(f"发送中间状态失败: {e}")
        return

    # 第二步：执行 AI 查询
    chart_config = None
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

    except Exception as e:
        logger.error(f"AI 查询执行失败: {e}")
        reply_content = f"查询出错了，请稍后重试。\n错误信息: {e}"

    # 第三步：发送最终文本结果
    try:
        await client.reply_stream(
            frame, stream_id, reply_content, finish=True
        )
        logger.info(f"回复已发送: user={sender['userid']}")
    except Exception as e:
        logger.error(f"发送最终回复失败: {e}")

    # 第四步：如有图表则渲染并发送图片
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
    """渲染图表并发送图片，优先通过 bot WebSocket，失败则回退到 REST API"""
    from app.wecom.chart_renderer import render_chart
    from app.wecom.media import upload_image, send_image_to_user

    try:
        print(f"[图表] 开始渲染: type={chart_config.chart_type}")

        img_bytes = render_chart(chart_config)
        if not img_bytes:
            print("[图表] 渲染返回空，跳过发送")
            return

        print(f"[图表] 渲染成功: {len(img_bytes)} bytes，开始上传...")

        media_id = await upload_image(img_bytes)
        print(f"[图表] 上传成功: media_id={media_id}")

        chatid = sender.get("chatid") or sender.get("userid")
        if not chatid:
            print("[图表] 无法确定发送目标，跳过")
            return

        # 优先通过 bot WebSocket 发送（图片显示在 bot 会话中）
        try:
            print(f"[图表] 通过 bot 发送图片到: {chatid}")
            await client.send_message(
                chatid,
                {
                    "msgtype": "image",
                    "image": {"media_id": media_id},
                },
            )
            print("[图表] bot 发送成功!")
        except Exception as ws_err:
            print(f"[图表] bot 发送失败: {ws_err}，回退到 REST API...")
            userid = sender.get("userid")
            if userid:
                await send_image_to_user(userid, media_id)
                print("[图表] REST API 发送成功!")

    except Exception as e:
        import traceback
        print(f"[图表] 发送失败: {e}")
        traceback.print_exc()

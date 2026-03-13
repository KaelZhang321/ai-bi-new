"""
企业微信 access_token 管理与临时素材上传

通过 corpid + corpsecret 获取 access_token，用于上传图片等素材。
"""

from __future__ import annotations

import io
import logging
import time
from typing import Optional

import aiohttp

from app.config import settings

logger = logging.getLogger("wecom.media")

# access_token 缓存
_access_token: Optional[str] = None
_token_expires_at: float = 0


async def get_access_token() -> str:
    """
    获取企业微信 access_token（带缓存，提前 5 分钟刷新）
    """
    global _access_token, _token_expires_at

    if _access_token and time.time() < _token_expires_at:
        return _access_token

    url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken"
    params = {
        "corpid": settings.WECOM_CORP_ID,
        "corpsecret": settings.WECOM_CORP_SECRET,
    }

    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as resp:
            data = await resp.json()

    if data.get("errcode", 0) != 0:
        raise RuntimeError(
            f"获取 access_token 失败: errcode={data.get('errcode')}, "
            f"errmsg={data.get('errmsg')}"
        )

    _access_token = data["access_token"]
    expires_in = data.get("expires_in", 7200)
    # 提前 5 分钟刷新
    _token_expires_at = time.time() + expires_in - 300

    logger.info("access_token 获取成功")
    return _access_token


async def upload_image(image_data: bytes, filename: str = "chart.png") -> str:
    """
    上传临时素材（图片），返回 media_id

    :param image_data: 图片二进制数据
    :param filename: 文件名
    :return: media_id
    """
    token = await get_access_token()
    url = "https://qyapi.weixin.qq.com/cgi-bin/media/upload"
    params = {"access_token": token, "type": "image"}

    form = aiohttp.FormData()
    form.add_field(
        "media",
        io.BytesIO(image_data),
        filename=filename,
        content_type="image/png",
    )

    async with aiohttp.ClientSession() as session:
        async with session.post(url, params=params, data=form) as resp:
            data = await resp.json()

    if data.get("errcode", 0) != 0:
        raise RuntimeError(
            f"上传素材失败: errcode={data.get('errcode')}, "
            f"errmsg={data.get('errmsg')}"
        )

    media_id = data["media_id"]
    logger.info(f"图片上传成功: media_id={media_id}")
    return media_id


# agentid 缓存
_agent_id: Optional[int] = None


async def _get_agent_id() -> int:
    """自动获取当前应用的 agentid"""
    global _agent_id

    if _agent_id is not None:
        return _agent_id

    token = await get_access_token()
    url = "https://qyapi.weixin.qq.com/cgi-bin/agent/list"
    params = {"access_token": token}

    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as resp:
            data = await resp.json()

    if data.get("errcode", 0) != 0:
        raise RuntimeError(
            f"获取应用列表失败: errcode={data.get('errcode')}, "
            f"errmsg={data.get('errmsg')}"
        )

    agents = data.get("agentlist", [])
    if not agents:
        raise RuntimeError("未找到任何应用，请检查 corpsecret 是否正确")

    _agent_id = agents[0]["agentid"]
    logger.info(f"自动获取 agentid={_agent_id}")
    return _agent_id


async def send_image_to_user(userid: str, media_id: str) -> dict:
    """
    通过 REST API 向用户发送图片消息

    :param userid: 接收者的 userid
    :param media_id: 上传后的 media_id
    :return: 接口响应
    """
    token = await get_access_token()
    agent_id = await _get_agent_id()

    url = f"https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token={token}"
    body = {
        "touser": userid,
        "msgtype": "image",
        "agentid": agent_id,
        "image": {"media_id": media_id},
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=body) as resp:
            data = await resp.json()

    if data.get("errcode", 0) != 0:
        raise RuntimeError(
            f"发送图片失败: errcode={data.get('errcode')}, "
            f"errmsg={data.get('errmsg')}"
        )

    logger.info(f"图片消息已通过 REST API 发送: userid={userid}")
    return data

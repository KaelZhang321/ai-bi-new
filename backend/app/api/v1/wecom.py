"""
企业微信长连接状态与控制 API
"""

from fastapi import APIRouter

from app.schemas.common import ApiResponse
from app.wecom.longconn import wecom_manager

router = APIRouter(prefix="/wecom", tags=["企业微信"])


@router.get("/status", response_model=ApiResponse[dict])
def wecom_status():
    """获取企业微信长连接状态"""
    return ApiResponse(data=wecom_manager.status)

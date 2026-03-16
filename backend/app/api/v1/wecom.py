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
    from app.wecom.subscribers import get_all_subscribers
    from app.wecom.scheduler import _now_cst, PUSH_TIMES

    status = wecom_manager.status
    status["subscribers"] = get_all_subscribers()
    status["subscriber_count"] = len(status["subscribers"])
    status["scheduler_push_times"] = [f"{h:02d}:{m:02d}" for h, m in PUSH_TIMES]
    status["server_time_cst"] = _now_cst().strftime("%Y-%m-%d %H:%M:%S")
    return ApiResponse(data=status)


@router.post("/test-push")
async def test_push():
    """手动触发一次 Webhook 群聊推送（测试用）"""
    from app.wecom.scheduler import push_via_webhook, WEBHOOK_URL

    if not WEBHOOK_URL:
        return {"code": -1, "message": "未配置 WECOM_WEBHOOK_URL"}

    await push_via_webhook()
    return {"code": 0, "message": "Webhook 推送完成"}

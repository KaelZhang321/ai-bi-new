from fastapi import APIRouter, HTTPException

from app.services.chart_store import get_chart

router = APIRouter(prefix="/chart", tags=["chart"])


@router.get("/{chart_id}")
def get_chart_data(chart_id: str):
    """获取缓存的图表配置"""
    data = get_chart(chart_id)
    if data is None:
        raise HTTPException(status_code=404, detail="图表不存在或已过期")
    return {"code": 0, "message": "ok", "data": data}

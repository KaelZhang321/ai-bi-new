from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.common import ApiResponse
from app.schemas.operations import OperationsKpi, TrendPoint
from app.services.operations_service import get_operations_kpi, get_trend_data

router = APIRouter(prefix="/operations", tags=["运营数据"])


@router.get("/kpi", response_model=ApiResponse[OperationsKpi])
def operations_kpi(
    date_from: str | None = Query(None),
    date_to: str | None = Query(None),
    db: Session = Depends(get_db),
):
    return ApiResponse(data=get_operations_kpi(db, date_from, date_to))


@router.get("/trend", response_model=ApiResponse[list[TrendPoint]])
def operations_trend(db: Session = Depends(get_db)):
    return ApiResponse(data=get_trend_data(db))

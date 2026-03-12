from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.common import ApiResponse
from app.schemas.kpi import KpiOverview
from app.services.kpi_service import get_kpi_overview

router = APIRouter(prefix="/kpi", tags=["KPI"])


@router.get("/overview", response_model=ApiResponse[KpiOverview])
def kpi_overview(db: Session = Depends(get_db)):
    data = get_kpi_overview(db)
    return ApiResponse(data=data)

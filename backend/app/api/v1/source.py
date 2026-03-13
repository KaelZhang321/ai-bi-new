from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.common import ApiResponse
from app.schemas.source import SourceCount, TargetArrival, TargetCustomerDetail
from app.services.source_service import get_source_distribution, get_target_arrival, get_target_customer_detail

router = APIRouter(prefix="/source", tags=["客户来源"])


@router.get("/distribution", response_model=ApiResponse[list[SourceCount]])
def source_distribution(db: Session = Depends(get_db)):
    return ApiResponse(data=get_source_distribution(db))


@router.get("/target-arrival", response_model=ApiResponse[list[TargetArrival]])
def target_arrival(db: Session = Depends(get_db)):
    return ApiResponse(data=get_target_arrival(db))


@router.get("/target-detail", response_model=ApiResponse[list[TargetCustomerDetail]])
def target_customer_detail(
    region: str | None = Query(None),
    db: Session = Depends(get_db),
):
    return ApiResponse(data=get_target_customer_detail(db, region))

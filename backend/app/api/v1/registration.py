from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.common import ApiResponse
from app.schemas.registration import RegionLevelCount, MatrixRow, RegistrationDetail
from app.services.registration_service import get_region_level_chart, get_matrix_table, get_registration_detail

router = APIRouter(prefix="/registration", tags=["报名签到"])


@router.get("/chart", response_model=ApiResponse[list[RegionLevelCount]])
def registration_chart(db: Session = Depends(get_db)):
    return ApiResponse(data=get_region_level_chart(db))


@router.get("/matrix", response_model=ApiResponse[list[MatrixRow]])
def registration_matrix(db: Session = Depends(get_db)):
    return ApiResponse(data=get_matrix_table(db))


@router.get("/detail", response_model=ApiResponse[list[RegistrationDetail]])
def registration_detail(
    region: str | None = Query(None),
    level: str | None = Query(None),
    db: Session = Depends(get_db),
):
    return ApiResponse(data=get_registration_detail(db, region, level))

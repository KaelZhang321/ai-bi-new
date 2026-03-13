from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.common import ApiResponse
from app.schemas.achievement import AchievementBar, AchievementRow, AchievementDetail
from app.services.achievement_service import get_achievement_chart, get_achievement_table, get_achievement_detail

router = APIRouter(prefix="/achievement", tags=["目标达成"])


@router.get("/chart", response_model=ApiResponse[list[AchievementBar]])
def achievement_chart(db: Session = Depends(get_db)):
    return ApiResponse(data=get_achievement_chart(db))


@router.get("/table", response_model=ApiResponse[list[AchievementRow]])
def achievement_table(db: Session = Depends(get_db)):
    return ApiResponse(data=get_achievement_table(db))


@router.get("/detail", response_model=ApiResponse[list[AchievementDetail]])
def achievement_detail(
    region: str | None = Query(None),
    db: Session = Depends(get_db),
):
    return ApiResponse(data=get_achievement_detail(db, region))

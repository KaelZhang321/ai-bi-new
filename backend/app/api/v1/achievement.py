from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.common import ApiResponse
from app.schemas.achievement import AchievementBar, AchievementRow
from app.services.achievement_service import get_achievement_chart, get_achievement_table

router = APIRouter(prefix="/achievement", tags=["目标达成"])


@router.get("/chart", response_model=ApiResponse[list[AchievementBar]])
def achievement_chart(db: Session = Depends(get_db)):
    return ApiResponse(data=get_achievement_chart(db))


@router.get("/table", response_model=ApiResponse[list[AchievementRow]])
def achievement_table(db: Session = Depends(get_db)):
    return ApiResponse(data=get_achievement_table(db))

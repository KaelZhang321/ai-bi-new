from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.common import ApiResponse
from app.schemas.progress import ProgressSummary
from app.services.progress_service import get_progress

router = APIRouter(prefix="/progress", tags=["完成进度"])


@router.get("/ranking", response_model=ApiResponse[ProgressSummary])
def progress_ranking(db: Session = Depends(get_db)):
    return ApiResponse(data=get_progress(db))

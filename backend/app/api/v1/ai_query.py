from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.common import ApiResponse
from app.schemas.ai_query import AiQueryRequest, AiQueryResponse
from app.ai.query_executor import execute_ai_query

router = APIRouter(prefix="/ai", tags=["AI查询"])


@router.post("/query", response_model=ApiResponse[AiQueryResponse])
def ai_query(req: AiQueryRequest, db: Session = Depends(get_db)):
    result = execute_ai_query(req.question, db)
    return ApiResponse(data=result)

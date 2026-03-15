from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sse_starlette.sse import EventSourceResponse

from app.db.dependencies import get_db
from app.schemas.common import ApiResponse
from app.schemas.ai_query import AiQueryRequest, AiQueryResponse
from app.ai.query_executor import execute_ai_query, execute_ai_query_stream

router = APIRouter(prefix="/ai", tags=["AI查询"])


@router.post("/query", response_model=ApiResponse[AiQueryResponse])
def ai_query(req: AiQueryRequest, db: Session = Depends(get_db)):
    result = execute_ai_query(req.question, db, conversation_id=req.conversation_id)
    return ApiResponse(data=result)


@router.post("/query/stream")
async def ai_query_stream(req: AiQueryRequest, db: Session = Depends(get_db)):
    return EventSourceResponse(execute_ai_query_stream(req.question, db, conversation_id=req.conversation_id))

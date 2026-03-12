from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.common import ApiResponse
from app.schemas.proposal import ProposalRow, ProposalCrossRow
from app.services.proposal_service import get_proposal_overview, get_proposal_cross_table

router = APIRouter(prefix="/proposal", tags=["方案情报"])


@router.get("/overview", response_model=ApiResponse[list[ProposalRow]])
def proposal_overview(db: Session = Depends(get_db)):
    return ApiResponse(data=get_proposal_overview(db))


@router.get("/cross-table", response_model=ApiResponse[list[ProposalCrossRow]])
def proposal_cross_table(db: Session = Depends(get_db)):
    return ApiResponse(data=get_proposal_cross_table(db))

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.common import ApiResponse
from app.schemas.customer import CustomerProfile
from app.services.customer_service import get_customer_profile

router = APIRouter(prefix="/customer", tags=["客户画像"])


@router.get("/profile", response_model=ApiResponse[CustomerProfile])
def customer_profile(db: Session = Depends(get_db)):
    return ApiResponse(data=get_customer_profile(db))

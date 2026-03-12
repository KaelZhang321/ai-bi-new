from fastapi import APIRouter

from app.api.v1 import (
    kpi,
    registration,
    customer,
    source,
    operations,
    achievement,
    progress,
    proposal,
    ai_query,
)

api_router = APIRouter()

v1_prefix = "/v1"

api_router.include_router(kpi.router, prefix=v1_prefix)
api_router.include_router(registration.router, prefix=v1_prefix)
api_router.include_router(customer.router, prefix=v1_prefix)
api_router.include_router(source.router, prefix=v1_prefix)
api_router.include_router(operations.router, prefix=v1_prefix)
api_router.include_router(achievement.router, prefix=v1_prefix)
api_router.include_router(progress.router, prefix=v1_prefix)
api_router.include_router(proposal.router, prefix=v1_prefix)
api_router.include_router(ai_query.router, prefix=v1_prefix)

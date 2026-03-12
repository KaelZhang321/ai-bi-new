from sqlalchemy import Column, Integer, String, TIMESTAMP
from app.db.session import Base


class MeetingRegionProposalTargets(Base):
    __tablename__ = "meeting_region_proposal_targets"

    id = Column(Integer, primary_key=True)
    region = Column(String(100))
    proposal_type = Column(String(100))
    target_count = Column(Integer)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)

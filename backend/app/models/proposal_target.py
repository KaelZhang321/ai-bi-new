from sqlalchemy import Column, Integer, String, TIMESTAM, Numeric
from app.db.session import Base


class MeetingProposalTargets(Base):
    __tablename__ = "meeting_proposal_targets"

    id = Column(Integer, primary_key=True)
    proposal_type = Column(String(100))
    sub_proposal_type = Column(String(100))
    target_count = Column(Integer)
    price = Column(Numeric(15, 2))
    target_amount = Column(Numeric(15, 2))
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)

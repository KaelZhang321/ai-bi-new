from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP
from app.db.session import Base


class MeetingRegionTransactionTargets(Base):
    __tablename__ = "meeting_region_transaction_targets"

    id = Column(Integer, primary_key=True)
    region = Column(String(100))
    attendance_target = Column(Integer)
    min_attendance_target = Column(Integer)
    system_registration_count = Column(Integer)
    prep_submission_count = Column(Integer)
    prep_submission_rate = Column(Numeric(10, 4))
    performance_target = Column(Numeric(15, 2))
    min_deal = Column(Numeric(15, 2))
    max_deal = Column(Numeric(15, 2))
    consumption_target = Column(Numeric(15, 2))
    actual_consumption_target = Column(Numeric(15, 2))
    high_level_target = Column(Numeric(15, 2))
    low_level_target = Column(Numeric(15, 2))
    balance_payment = Column(Numeric(15, 2))
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)

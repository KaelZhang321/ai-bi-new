from sqlalchemy import Column, Integer, String, Date, Text, Numeric, TIMESTAMP
from app.db.session import Base


class MeetingRegistration(Base):
    __tablename__ = "meeting_registration"

    id = Column(Integer, primary_key=True)
    audit_status = Column(String(50))
    sign_in_status = Column(String(50))
    customer_name = Column(String(100))
    gender = Column(String(10))
    customer_category = Column(String(50))
    attendee_role = Column(String(50))
    store_name = Column(String(100))
    president_name = Column(String(100))
    market_service_attribution = Column(String(100))
    ticket = Column(String(100))
    customer_level = Column(String(50))
    customer_level_name = Column(String(100))
    customer_unique_id = Column(String(50))
    res_rights_days = Column(Integer)
    check_out_date = Column(Date)
    record_date = Column(Date)
    real_identity = Column(String(100))
    ticket_2 = Column(String(100))
    sign_in_code = Column(String(50))
    arrive_time = Column(TIMESTAMP)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)

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
    ticket_2 = Column(String(100))
    sign_in_code = Column(String(50))
    flight_info = Column(String(255))
    allocation = Column(String(100))
    pre_room_allocation = Column(String(100))
    sign_in_date_1 = Column(Date)
    check_out_date_1 = Column(Date)
    remark = Column(Text)
    family_id = Column(String(50))
    family_total_consumption = Column(Numeric(15, 2))
    ranking = Column(Integer)
    base_or_forum = Column(String(100))
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)

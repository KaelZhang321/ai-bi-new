from sqlalchemy import Column, Integer, String, Date, Text, Numeric, DateTime
from app.db.session import Base


class MeetingTransactionDetails(Base):
    __tablename__ = "meeting_transaction_details"

    id = Column(Integer, primary_key=True)
    customer_unique_id = Column(String(50))
    record_date = Column(Date)
    region = Column(String(50))
    branch = Column(String(100))
    market_teacher = Column(String(100))
    store_name = Column(String(100))
    president_name = Column(String(100))
    identity_role = Column(String(50))
    customer_category = Column(String(50))
    sign_in_type = Column(String(50))
    customer_name = Column(String(100))
    deal_type = Column(String(50))
    deal_content = Column(Text)
    new_deal_amount = Column(Numeric(15, 2))
    received_amount = Column(Numeric(15, 2))
    consumed_amount = Column(Numeric(15, 2))
    new_deal_type = Column(String(50))
    plan_type = Column(String(50))
    plan_type_sub = Column(String(100))
    plan_quantity = Column(Integer)
    special_remarks = Column(Text)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

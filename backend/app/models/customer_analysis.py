from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime
from app.db.session import Base


class MeetingCustomerAnalysis(Base):
    __tablename__ = "meeting_customer_analysis"

    id = Column(Integer, primary_key=True)
    customer_unique_id = Column(String(50))
    region = Column(String(50))
    branch = Column(String(100))
    market_teacher = Column(String(100))
    customer_name = Column(String(100))
    new_or_old_customer = Column(String(20))
    customer_level = Column(String(50))
    customer_type = Column(String(50))
    invite_time = Column(String(255))
    invite_method_scene = Column(String(100))
    is_confirmed_attend = Column(String(20))
    prep_scene = Column(String(100))
    prep_inviter = Column(String(100))
    comm_content = Column(Text)
    customer_feedback = Column(Text)
    chief_complaint = Column(Text)
    cash_flow = Column(String(100))
    family_history = Column(Text)
    health_habits = Column(Text)
    deal_plan = Column(Text)
    min_deal = Column(Numeric(15, 2))
    max_deal = Column(Numeric(15, 2))
    consumption_target = Column(Numeric(15, 2))
    prep_maturity = Column(String(50))
    deal_path_proposal = Column(Text)
    main_responsible_person = Column(String(100))
    warm_up_person = Column(String(100))
    main_attacker = Column(String(100))
    revival_person = Column(String(100))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

from sqlalchemy import Column, Integer, String, Date, DateTime
from app.db.session import Base


class MeetingScheduleStats(Base):
    __tablename__ = "meeting_schedule_stats"

    id = Column(Integer, primary_key=True)
    scene = Column(String(100))
    time_period = Column(String(50))
    schedule_date = Column(Date)
    people_count = Column(Integer)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

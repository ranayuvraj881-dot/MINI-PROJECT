from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


def utc_now():
    return datetime.now(timezone.utc)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(256), nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String(32), default="General")  # Important, Academic, Attendance, Assignments, General
    timestamp_str = Column(String(64), nullable=True) # e.g. "Today, 10:30 AM" or formatted
    created_at = Column(DateTime, default=utc_now)
    read = Column(Boolean, default=False)
    action_url = Column(String(256), nullable=True)
    action_label = Column(String(64), nullable=True)

    user = relationship("User", back_populates="notifications")

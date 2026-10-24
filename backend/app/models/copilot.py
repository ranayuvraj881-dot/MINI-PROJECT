from datetime import datetime, timezone
import json
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


def utc_now():
    return datetime.now(timezone.utc)


class AIChatMessage(Base):
    __tablename__ = "ai_chat_messages"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    sender = Column(String(16), nullable=False)  # 'user' | 'assistant'
    content = Column(Text, nullable=False)
    timestamp_str = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    context_applied = Column(String(64), nullable=True)
    suggested_followups_json = Column(Text, nullable=True)
    reference_links_json = Column(Text, nullable=True)

    user = relationship("User", back_populates="chat_messages")

    @property
    def suggested_followups(self):
        if not self.suggested_followups_json:
            return []
        try:
            return json.loads(self.suggested_followups_json)
        except Exception:
            return []

    @suggested_followups.setter
    def suggested_followups(self, value):
        self.suggested_followups_json = json.dumps(value) if value else "[]"

    @property
    def reference_links(self):
        if not self.reference_links_json:
            return []
        try:
            return json.loads(self.reference_links_json)
        except Exception:
            return []

    @reference_links.setter
    def reference_links(self, value):
        self.reference_links_json = json.dumps(value) if value else "[]"

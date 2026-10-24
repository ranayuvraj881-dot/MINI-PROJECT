from typing import Optional
from pydantic import BaseModel


class AppNotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    category: str
    timestamp: str
    read: bool
    actionUrl: Optional[str] = None
    actionLabel: Optional[str] = None

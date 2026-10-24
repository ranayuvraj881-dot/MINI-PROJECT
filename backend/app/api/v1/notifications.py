from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import AppNotificationResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])


def _format_notification(n: Notification) -> AppNotificationResponse:
    return AppNotificationResponse(
        id=n.id,
        title=n.title,
        message=n.message,
        category=n.category,
        timestamp=n.timestamp_str or n.created_at.strftime("%b %d, %I:%M %p"),
        read=n.read,
        actionUrl=n.action_url,
        actionLabel=n.action_label,
    )


@router.get("", response_model=List[AppNotificationResponse])
def get_notifications(
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve notifications for the authenticated user with category filtering."""
    query = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
    )
    if category and category.lower() != "all":
        query = query.filter(Notification.category.ilike(category))

    notifications = query.all()
    return [_format_notification(n) for n in notifications]


@router.post("/{notification_id}/read", response_model=List[AppNotificationResponse])
def mark_notification_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a single notification as read and persist to database."""
    n = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == current_user.id)
        .first()
    )
    if n:
        n.read = True
        db.commit()

    all_notifs = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    return [_format_notification(x) for x in all_notifs]


@router.post("/read-all", response_model=List[AppNotificationResponse])
def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark all notifications for the current user as read in the database."""
    db.query(Notification).filter(Notification.user_id == current_user.id).update({"read": True})
    db.commit()

    all_notifs = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    return [_format_notification(x) for x in all_notifs]

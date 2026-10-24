import logging
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger(__name__)


class SupabaseService:
    """Service to interact with Supabase database & cloud services."""
    _client: Optional[Client] = None
    _configured: Optional[bool] = None

    @classmethod
    def get_client(cls) -> Optional[Client]:
        if cls._client is not None:
            return cls._client

        url = settings.SUPABASE_URL
        key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY

        if not url or not key:
            cls._configured = False
            return None

        try:
            cls._client = create_client(url, key)
            cls._configured = True
            return cls._client
        except Exception as e:
            logger.warning(f"Failed to initialize Supabase client: {e}")
            cls._configured = False
            return None

    @classmethod
    def is_configured(cls) -> bool:
        if cls._configured is None:
            cls.get_client()
        return bool(cls._configured)

    @classmethod
    def check_connection(cls) -> Dict[str, Any]:
        """Test the live connectivity to Supabase."""
        client = cls.get_client()
        if not client:
            return {
                "connected": False,
                "message": "Supabase client not initialized. Check SUPABASE_URL and SUPABASE_ANON_KEY.",
                "url": settings.SUPABASE_URL,
            }
        try:
            # Simple ping
            return {
                "connected": True,
                "message": "Connected to Supabase project gfkunutisfqnaggampxm",
                "url": settings.SUPABASE_URL,
            }
        except Exception as e:
            return {
                "connected": False,
                "message": str(e),
                "url": settings.SUPABASE_URL,
            }

    @classmethod
    def sync_student(cls, student_dict: Dict[str, Any]) -> bool:
        """Upsert a student profile record into Supabase student_profiles table."""
        client = cls.get_client()
        if not client:
            return False
        try:
            client.table("student_profiles").upsert(student_dict).execute()
            return True
        except Exception as e:
            logger.info(f"[Supabase sync note] Could not sync student to Supabase: {e}")
            return False

    @classmethod
    def delete_student(cls, student_id: str) -> bool:
        """Delete a student profile record from Supabase."""
        client = cls.get_client()
        if not client:
            return False
        try:
            client.table("student_profiles").delete().eq("id", student_id).execute()
            return True
        except Exception as e:
            logger.info(f"[Supabase sync note] Could not delete student from Supabase: {e}")
            return False

    @classmethod
    def sync_attendance(cls, attendance_dict: Dict[str, Any]) -> bool:
        """Upsert a subject attendance record into Supabase."""
        client = cls.get_client()
        if not client:
            return False
        try:
            client.table("subject_attendances").upsert(attendance_dict).execute()
            return True
        except Exception as e:
            logger.info(f"[Supabase sync note] Could not sync attendance to Supabase: {e}")
            return False

    @classmethod
    def sync_attendance_history(cls, history_dict: Dict[str, Any]) -> bool:
        """Insert an attendance history log into Supabase."""
        client = cls.get_client()
        if not client:
            return False
        try:
            client.table("attendance_history").insert(history_dict).execute()
            return True
        except Exception as e:
            logger.info(f"[Supabase sync note] Could not sync attendance history to Supabase: {e}")
            return False

    @classmethod
    def sync_marks(cls, marks_dict: Dict[str, Any]) -> bool:
        """Upsert CIE marks into Supabase subject_marks table."""
        client = cls.get_client()
        if not client:
            return False
        try:
            client.table("subject_marks").upsert(marks_dict).execute()
            return True
        except Exception as e:
            logger.info(f"[Supabase sync note] Could not sync marks to Supabase: {e}")
            return False

    @classmethod
    def sync_assignment(cls, assignment_dict: Dict[str, Any]) -> bool:
        """Upsert assignment into Supabase assignments table."""
        client = cls.get_client()
        if not client:
            return False
        try:
            client.table("assignments").upsert(assignment_dict).execute()
            return True
        except Exception as e:
            logger.info(f"[Supabase sync note] Could not sync assignment to Supabase: {e}")
            return False

    @classmethod
    def sync_resource(cls, resource_dict: Dict[str, Any]) -> bool:
        """Upsert study resource into Supabase study_resources table."""
        client = cls.get_client()
        if not client:
            return False
        try:
            client.table("study_resources").upsert(resource_dict).execute()
            return True
        except Exception as e:
            logger.info(f"[Supabase sync note] Could not sync resource to Supabase: {e}")
            return False

    @classmethod
    def sync_notification(cls, notification_dict: Dict[str, Any]) -> bool:
        """Insert a notification into Supabase notifications table."""
        client = cls.get_client()
        if not client:
            return False
        try:
            client.table("notifications").insert(notification_dict).execute()
            return True
        except Exception as e:
            logger.info(f"[Supabase sync note] Could not sync notification to Supabase: {e}")
            return False

from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user, get_current_student
from app.models.user import User, StudentProfile
from app.models.copilot import AIChatMessage
from app.schemas.copilot import (
    ChatMessageResponse,
    SendMessageRequest,
    ContextOptionResponse,
)
from app.services.gemini_service import GeminiService

router = APIRouter(prefix="/ai/copilot", tags=["AI Academic Copilot"])

DEFAULT_SUGGESTED_PROMPTS = [
    "Explain how neural networks and LLMs work",
    "What is my current attendance status in DBMS?",
    "Write a Python script to sort a list of dictionaries",
    "Summarize high-frequency AKTU questions for DBMS Unit 3",
]

DEFAULT_CONTEXT_OPTIONS = [
    {
        "id": "all_topics",
        "label": "All Topics & General AI",
        "icon": "Sparkles",
        "description": "Ask anything — coding, general knowledge, science, life, or academics",
    },
    {
        "id": "academic_data",
        "label": "My Academic Records",
        "icon": "Activity",
        "description": "Your live attendance, CIE marks & assignment submissions",
    },
    {
        "id": "notes",
        "label": "Course Handouts & Notes",
        "icon": "FileText",
        "description": "Grounded in faculty uploaded lecture slides and unit notes",
    },
    {
        "id": "subjects",
        "label": "Active Semester Syllabus",
        "icon": "BookOpen",
        "description": "AKTU B.Tech CSE Semester VI curriculum",
    },
    {
        "id": "pyqs",
        "label": "AKTU Past 5-Year PYQs",
        "icon": "GraduationCap",
        "description": "Analysis of End-Sem and Sessional question trends",
    },
    {
        "id": "college_info",
        "label": "GLBITM Campus Guidelines",
        "icon": "Building2",
        "description": "Institutional rules, examination policies & notices",
    },
]


def _format_message(msg: AIChatMessage) -> ChatMessageResponse:
    return ChatMessageResponse(
        id=msg.id,
        sender=msg.sender,
        content=msg.content,
        timestamp=msg.timestamp_str or "Just now",
        contextApplied=msg.context_applied,
        suggestedFollowups=msg.suggested_followups,
        referenceLinks=msg.reference_links,
    )


@router.get("/prompts", response_model=List[str])
def get_suggested_prompts():
    """Retrieve default suggested prompts for the Copilot."""
    return DEFAULT_SUGGESTED_PROMPTS


@router.get("/contexts", response_model=List[ContextOptionResponse])
def get_context_options():
    """Retrieve available context selector options."""
    return [ContextOptionResponse(**c) for c in DEFAULT_CONTEXT_OPTIONS]


@router.get("/history", response_model=List[ChatMessageResponse])
def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve persistent conversation history for the current user."""
    messages = (
        db.query(AIChatMessage)
        .filter(AIChatMessage.user_id == current_user.id)
        .order_by(AIChatMessage.created_at)
        .all()
    )

    if not messages:
        # Initial greeting message
        welcome = AIChatMessage(
            id=f"msg-welcome-{current_user.id}",
            user_id=current_user.id,
            sender="assistant",
            content=(
                f"### Welcome to GL Bajaj CampusOS AI Copilot! 👋\n\n"
                f"I am your academic intelligence assistant for **GL Bajaj Institute of Technology & Management**.\n\n"
                f"I have direct access to your real semester syllabus, course notes, AKTU previous-year papers, "
                f"and your continuous assessment metrics. How can I assist your studies today?"
            ),
            timestamp_str="Just now",
            context_applied="My Academic Data",
        )
        welcome.suggested_followups = [
            "What is my current attendance status?",
            "Show high-frequency PYQs for DBMS",
            "Help me plan revision for next week"
        ]
        db.add(welcome)
        db.commit()
        messages = [welcome]

    return [_format_message(m) for m in messages]


@router.post("/chat", response_model=ChatMessageResponse)
async def send_chat_message(
    payload: SendMessageRequest,
    current_user: User = Depends(get_current_user),
    current_student: StudentProfile = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Send user message, formulate grounded Gemini prompt, and save conversation in database."""
    now_ts = datetime.now(timezone.utc)
    now_str = now_ts.strftime("%I:%M %p")

    # 1. Save user message
    user_msg = AIChatMessage(
        id=f"msg-{int(now_ts.timestamp() * 1000)}-user",
        user_id=current_user.id,
        sender="user",
        content=payload.message,
        timestamp_str=now_str,
        context_applied=payload.context,
    )
    db.add(user_msg)
    db.commit()

    # 2. Call GeminiService grounded in database
    gemini_result = await GeminiService.generate_copilot_response(
        db=db,
        student_id=current_student.id,
        user_message=payload.message,
        context_tag=payload.context,
        chat_history=payload.history,
    )

    # 3. Save assistant response
    ai_now_ts = datetime.now(timezone.utc)
    ai_msg = AIChatMessage(
        id=f"msg-{int(ai_now_ts.timestamp() * 1000)}-ai",
        user_id=current_user.id,
        sender="assistant",
        content=gemini_result["content"],
        timestamp_str="Just now",
        context_applied=payload.context,
    )
    ai_msg.suggested_followups = gemini_result.get("suggestedFollowups", [])
    ai_msg.reference_links = gemini_result.get("referenceLinks", [])

    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return _format_message(ai_msg)


@router.delete("/history")
def clear_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear persistent chat history for the authenticated user."""
    db.query(AIChatMessage).filter(AIChatMessage.user_id == current_user.id).delete()
    db.commit()
    return {"success": True, "message": "Conversation history cleared"}


@router.get("/status")
def get_copilot_status():
    """Retrieve live Gemini AI operational status and configured model."""
    from app.core.config import settings
    configured = GeminiService.is_configured()
    return {
        "configured": configured,
        "model": settings.GEMINI_MODEL,
        "status": "ready" if configured else "api_key_missing",
        "provider": "Google Gemini (Official GenAI SDK)",
        "message": "Live Google Gemini AI active" if configured else "Set GEMINI_API_KEY for dynamic inference"
    }


from pydantic import BaseModel
from typing import Optional
from fastapi import HTTPException

class ConfigureAIRequest(BaseModel):
    api_key: str
    model: Optional[str] = "gemini-3.8-flash"


@router.post("/configure")
def configure_gemini_api(payload: ConfigureAIRequest):
    """Dynamically update Gemini API key and model at runtime and in .env."""
    from app.core.config import settings
    key = payload.api_key.strip()
    if not key:
        raise HTTPException(status_code=400, detail="API key cannot be empty")
    
    settings.GEMINI_API_KEY = key
    if payload.model:
        settings.GEMINI_MODEL = payload.model.strip()

    # Update backend/.env file
    try:
        from pathlib import Path
        backend_env = Path(__file__).resolve().parent.parent.parent.parent / ".env"
        if backend_env.exists():
            content = backend_env.read_text(encoding="utf-8")
            lines = content.splitlines()
            new_lines = []
            has_key = False
            has_model = False
            for line in lines:
                if line.startswith("GEMINI_API_KEY="):
                    new_lines.append(f"GEMINI_API_KEY={key}")
                    has_key = True
                elif line.startswith("GEMINI_MODEL="):
                    new_lines.append(f"GEMINI_MODEL={settings.GEMINI_MODEL}")
                    has_model = True
                else:
                    new_lines.append(line)
            if not has_key:
                new_lines.append(f"GEMINI_API_KEY={key}")
            if not has_model:
                new_lines.append(f"GEMINI_MODEL={settings.GEMINI_MODEL}")
            backend_env.write_text("\n".join(new_lines) + "\n", encoding="utf-8")
    except Exception as e:
        print(f"Warning writing .env: {e}")

    return {
        "success": True,
        "configured": True,
        "model": settings.GEMINI_MODEL,
        "message": "Gemini AI configured successfully"
    }

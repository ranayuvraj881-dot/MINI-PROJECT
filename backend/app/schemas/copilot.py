from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class ReferenceLink(BaseModel):
    title: str
    url: Optional[str] = None
    type: str = "doc"


class ChatMessageResponse(BaseModel):
    id: str
    sender: str  # 'user' | 'assistant'
    content: str
    timestamp: str
    contextApplied: Optional[str] = None
    suggestedFollowups: Optional[List[str]] = None
    referenceLinks: Optional[List[Dict[str, Any]]] = None


class SendMessageRequest(BaseModel):
    message: str
    context: str = "My Academic Data"
    history: Optional[List[Dict[str, Any]]] = None
    resourceReferenceId: Optional[str] = None


class ContextOptionResponse(BaseModel):
    id: str
    label: str
    icon: str
    description: str

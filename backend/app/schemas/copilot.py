"""Schemas for In-App AI Copilot and Client-Side Tool Action Calling."""

from __future__ import annotations
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.ai import CitationItem


class CopilotActionType(str, Enum):
    """Client-side UI actions executable by the frontend action dispatcher."""
    LOAD_JOURNEY = "LOAD_JOURNEY"
    OPEN_STEP = "OPEN_STEP"
    OPEN_DRAWER = "OPEN_DRAWER"
    SCROLL_TO_NODE = "SCROLL_TO_NODE"
    TRIGGER_CONSENT = "TRIGGER_CONSENT"
    SWITCH_LANGUAGE = "SWITCH_LANGUAGE"
    FILTER_CATALOG = "FILTER_CATALOG"
    HIGHLIGHT_ELEMENT = "HIGHLIGHT_ELEMENT"
    COMPLETE_STEP = "COMPLETE_STEP"
    SHOW_CHOICE_CHIPS = "SHOW_CHOICE_CHIPS"


class CopilotAction(BaseModel):
    """Single declarative UI action command emitted by the AI Copilot."""
    action_type: CopilotActionType = Field(..., description="Type of client-side UI action")
    payload: Dict[str, Any] = Field(
        default_factory=dict,
        description="Parameters for the action (journey_id, step_id, tab, selector, lang, doc_type, etc.)"
    )
    description: str = Field(..., description="Human-readable explanation of what the UI action does")


class CopilotRequest(BaseModel):
    """Citizen voice or text query for in-app copilot assistance."""
    query: str = Field(
        ...,
        min_length=2,
        description="User voice transcript or text query (e.g. 'Help me register for FSSAI food license in Karnataka')",
        examples=["Help me register for FSSAI food license in Karnataka"]
    )
    language: Optional[str] = Field("en", description="Citizen language code ('en', 'hi', 'kn')")
    active_journey_id: Optional[str] = Field(None, description="Currently loaded journey ID if any")
    active_step_id: Optional[str] = Field(None, description="Currently selected or focused step ID if any")
    active_screen: Optional[str] = Field("LANDING", description="Active screen ('LANDING' or 'ROADMAP')")


class CopilotResponse(BaseModel):
    """Structured response containing conversational speech output, grounded explanation, and UI action commands."""
    speech_text: str = Field(
        ...,
        description="Concise 1-sentence vocal summary in citizen's selected language for browser Text-to-Speech"
    )
    explanation_markdown: str = Field(
        ...,
        description="Detailed grounded guidance with statutory background and next steps"
    )
    actions: List[CopilotAction] = Field(
        default_factory=list,
        description="Ordered sequence of UI actions for frontend execution"
    )
    citations: List[CitationItem] = Field(
        default_factory=list,
        description="Statutory source manual citations from ChromaDB"
    )
    suggested_chips: List[str] = Field(
        default_factory=list,
        description="Contextual quick-reply prompt chips for citizen follow-up"
    )
    matched_journey_id: Optional[str] = Field(None, description="Matched journey blueprint ID")
    latency_ms: float = Field(..., description="Total copilot synthesis latency in milliseconds")
    is_fallback: bool = Field(False, description="True if heuristic/offline rule was used")


class CopilotStreamEvent(BaseModel):
    """Server-Sent Event (SSE) payload chunk for streaming copilot responses."""
    event: str = Field("token", description="Event type ('token', 'action', 'citation', 'done', 'error')")
    data: Dict[str, Any] = Field(default_factory=dict, description="Event payload data")


class ToolCall(BaseModel):
    """Function call tool invocation emitted by Gemini 2.5 Flash."""
    name: str = Field(..., description="Tool name (e.g. 'load_journey', 'open_step_drawer', 'trigger_consent_modal', 'switch_language')")
    arguments: Dict[str, Any] = Field(default_factory=dict, description="Function arguments dict")


class UIAction(BaseModel):
    """Declarative UI action format for Next.js frontend dispatcher."""
    action: str = Field(..., description="UI tool name (e.g. 'load_journey', 'open_step_drawer')")
    payload: Dict[str, Any] = Field(default_factory=dict, description="Tool arguments dictionary")


class CopilotQueryRequest(BaseModel):
    """Request payload for /api/copilot/query endpoint, supporting both 'message' and 'query'."""
    message: Optional[str] = Field(None, description="User prompt message (e.g. 'I want to open a cafe in Bangalore')")
    query: Optional[str] = Field(None, description="Alternative alias for user message query")
    language: Optional[str] = Field("en", description="Language preference ('en', 'hi', 'kn')")
    context_chunks: Optional[List[Dict[str, Any]]] = Field(None, description="Optional pre-retrieved ChromaDB RAG context chunks")
    journey_id: Optional[str] = Field(None, description="Currently active journey ID if any")
    step_id: Optional[str] = Field(None, description="Currently focused step ID if any")

    def get_prompt_text(self) -> str:
        """Returns normalized prompt text from either message or query field."""
        return (self.message or self.query or "").strip()


class CopilotQueryResponse(BaseModel):
    """Response payload for /api/copilot/query endpoint returning both ui_actions and tool_calls."""
    text_response: str = Field(..., description="Concise, polite synthesized explanation (max 2 sentences)")
    ui_actions: List[UIAction] = Field(default_factory=list, description="UI actions list for Next.js dispatcher ({action, payload})")
    tool_calls: List[ToolCall] = Field(default_factory=list, description="Structured UI tools called by the model ({name, arguments})")
    context_chunks: List[Dict[str, Any]] = Field(default_factory=list, description="Grounded RAG context chunks used from ChromaDB")
    model: str = Field("gemini-2.5-flash", description="Model used for generation")
    latency_ms: float = Field(0.0, description="Total execution latency in milliseconds")



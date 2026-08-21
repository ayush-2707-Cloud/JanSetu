"""
Pydantic Schemas for SQLite Session State Persistence.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.schemas.journey import JourneyRuntimeEvaluation


class SessionCreateRequest(BaseModel):
    """Payload to initialize or restore a citizen session."""
    session_id: Optional[str] = Field(None, description="Client session UUID if already assigned")
    active_journey_id: Optional[str] = Field("certified-tourist-guide", description="Active journey ID")
    profile_parameters: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Profile parameters (category, state, reservation, annual income)"
    )


class SessionStateResponse(BaseModel):
    """Full persisted session state."""
    session_id: str
    active_journey_id: Optional[str] = None
    profile_parameters: Dict[str, Any]
    completed_step_ids: List[str]
    current_step_id: Optional[str] = None
    progress_percentage: int = 0
    evaluated_journey: Optional[JourneyRuntimeEvaluation] = None
    created_at: str
    updated_at: str


class SessionStepCompleteRequest(BaseModel):
    """Payload to complete a step within a persisted session."""
    step_id: str = Field(..., description="Milestone step ID to complete")

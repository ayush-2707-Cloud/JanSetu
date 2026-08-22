"""Pydantic models for Event-Driven Pub/Sub & Server-Sent Events (SSE) Engine."""

from enum import Enum
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class EventType(str, Enum):
    STEP_SUBMITTED = "STEP_SUBMITTED"
    STEP_APPROVED = "STEP_APPROVED"
    STEP_REJECTED = "STEP_REJECTED"
    SLA_WARNING = "SLA_WARNING"
    SLA_BREACHED = "SLA_BREACHED"
    WORKFLOW_UPDATED = "WORKFLOW_UPDATED"
    DOC_AUTO_VERIFIED = "DOC_AUTO_VERIFIED"
    CONSENT_GRANTED = "CONSENT_GRANTED"


class GovTechEvent(BaseModel):
    event_id: str
    event_type: EventType
    utid: str
    step_id: Optional[str] = None
    department: str
    actor: str  # "CITIZEN", "OFFICER", "SYSTEM_MIDDLEWARE"
    message: str
    timestamp: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class EventPublishRequest(BaseModel):
    event_type: EventType
    utid: str = "UTID-MH-2026-094182"
    step_id: Optional[str] = "step-fssai-02"
    department: str = "Food Safety Authority of India"
    actor: str = "OFFICER_SCRUTINY_DESK_04"
    message: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

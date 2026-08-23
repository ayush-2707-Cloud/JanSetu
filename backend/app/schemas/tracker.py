"""Schemas for Unified Cross-Portal Application Tracker.

Consolidates applications across heterogeneous central, state, and municipal databases
into a single real-time citizen tracking view with SLA status and officer assignments.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class ApplicationTrackItem(BaseModel):
    utid: str = Field(..., description="Universal Transaction Identifier")
    application_id: str = Field(..., description="Department-specific application number")
    journey_id: str = Field(..., description="Journey identifier")
    journey_title: str = Field(..., description="Human readable journey title")
    department_code: str = Field(..., description="FSSAI | BMC | REVENUE | MSME | TRANSPORT")
    department_name: str = Field(..., description="Full department name")
    portal_origin: str = Field(..., description="Origin portal name e.g. FoSCoS, Aaple Sarkar, MCA21")
    current_milestone: str = Field(..., description="Active step or milestone name")
    status: str = Field(..., description="SUBMITTED | SCRUTINY_STAGE_1 | DOCUMENT_VERIFIED | APPROVED | DEFECT_FLAGGED | REJECTED")
    sla_total_days: int = Field(..., description="Prescribed statutory SLA duration in days")
    sla_days_remaining: int = Field(..., description="Days remaining before statutory escalation")
    sla_status: str = Field(..., description="ON_TRACK | WARNING | ESCALATED | COMPLETED")
    assigned_officer: str = Field(..., description="Name or designation of assigned officer")
    submitted_at: str = Field(..., description="ISO 8601 submission timestamp")
    last_updated_at: str = Field(..., description="ISO 8601 last modification timestamp")
    action_required_by_citizen: bool = Field(False, description="Whether citizen action is pending")
    action_notes: Optional[str] = Field(None, description="Instructions if action required")


class UnifiedTrackerResponse(BaseModel):
    citizen_name: str
    pan_masked: str
    total_active_applications: int
    completed_applications: int
    pending_actions_count: int
    overall_sla_compliance_rate: float
    applications: List[ApplicationTrackItem]

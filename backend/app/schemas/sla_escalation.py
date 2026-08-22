"""Pydantic models for Citizen Charter SLA & Auto-Escalation Engine (Maharashtra RTSA)."""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class SLAStatus(str, Enum):
    HEALTHY = "HEALTHY"       # > 12 hours remaining
    WARNING = "WARNING"       # <= 12 hours remaining
    BREACHED = "BREACHED"     # <= 0 hours remaining (SLA Violated)
    ESCALATED = "ESCALATED"   # Auto-escalated to District Collector / HOD


class ApplicationSLARecord(BaseModel):
    application_id: str
    utid: str
    citizen_name: str
    department: str
    step_title: str
    submitted_at: str
    statutory_sla_hours: int
    hours_remaining: float
    sla_status: SLAStatus
    assigned_officer: str
    escalated_to_appellate: Optional[str] = None
    rtsa_statutory_clause: str = "Maharashtra Right to Public Services Act 2015, Section 7(2)"


class EscalationTriggerRequest(BaseModel):
    application_id: str
    reason: str = "Statutory 48h Scrutiny Window Elapsed"
    escalate_to: str = "DISTRICT_COLLECTOR_APPELLATE_OFFICE_MUMBAI"

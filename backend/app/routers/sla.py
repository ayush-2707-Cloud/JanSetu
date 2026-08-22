"""FastAPI Router for Maharashtra RTSA Citizen Charter SLA & Escalation Engine."""

from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.sla_escalation import (
    ApplicationSLARecord,
    EscalationTriggerRequest,
)
from app.services.sla_engine import SLAEngine

router = APIRouter(
    prefix="/sla",
    tags=["Citizen Charter SLA & Escalation Engine (Maharashtra RTSA)"]
)


@router.get(
    "/applications",
    response_model=List[ApplicationSLARecord],
    summary="Get Active Applications with Live SLA Statuses",
    description="Returns applications categorized as HEALTHY, WARNING, or ESCALATED under Maharashtra RTSA 2015 statutory timelines."
)
async def api_get_sla_applications() -> List[ApplicationSLARecord]:
    """Retrieve applications with calculated SLA countdowns."""
    return SLAEngine.get_applications()


@router.post(
    "/escalate/{application_id}",
    response_model=ApplicationSLARecord,
    summary="Trigger Statutory Escalation for Overdue Application",
    description="Manually or automatically escalates an overdue application to the District Collector / Appellate Officer."
)
async def api_escalate_application(
    application_id: str,
    payload: EscalationTriggerRequest
) -> ApplicationSLARecord:
    """Escalate application to appellate authority."""
    return await SLAEngine.escalate_application(
        app_id=application_id,
        reason=payload.reason,
        escalate_to=payload.escalate_to
    )

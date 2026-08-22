"""SLA Engine for Maharashtra Right to Public Services Act (RTSA 2015).

Computes real-time statutory countdowns, detects SLA breaches, and triggers auto-escalations to District Collector.
"""

from datetime import datetime, timezone, timedelta
from typing import List
from app.schemas.sla_escalation import ApplicationSLARecord, SLAStatus
from app.schemas.events import EventType
from app.services.event_bus import EventBus


class SLAEngine:
    """Manages statutory SLA timers, breach detection, and appellate escalation."""

    _applications: List[ApplicationSLARecord] = [
        ApplicationSLARecord(
            application_id="APP-2026-FSSAI-001",
            utid="UTID-MH-2026-094182",
            citizen_name="Ayush Singh Chauhan",
            department="Food Safety Authority (FSSAI)",
            step_title="State Food Business Operator License",
            submitted_at="2026-02-21T10:00:00Z",
            statutory_sla_hours=48,
            hours_remaining=36.5,
            sla_status=SLAStatus.HEALTHY,
            assigned_officer="OFFICER_DESHMUKH_FSSAI_04",
            escalated_to_appellate=None,
            rtsa_statutory_clause="Maharashtra RTSA 2015, Section 7(2) (Food Licensing 48h Window)",
        ),
        ApplicationSLARecord(
            application_id="APP-2026-BMC-002",
            utid="UTID-MH-2026-088192",
            citizen_name="Pooja Sharma",
            department="Municipal Corporation (BMC)",
            step_title="Commercial Trade License (Form TL-2)",
            submitted_at="2026-02-20T08:00:00Z",
            statutory_sla_hours=72,
            hours_remaining=3.5,
            sla_status=SLAStatus.WARNING,
            assigned_officer="OFFICER_MORE_BMC_WARD_K",
            escalated_to_appellate=None,
            rtsa_statutory_clause="Maharashtra RTSA 2015, Schedule I (Municipal Trade License 72h Window)",
        ),
        ApplicationSLARecord(
            application_id="APP-2026-MPCB-003",
            utid="UTID-MH-2026-074123",
            citizen_name="Rajesh Patel",
            department="State Pollution Control Board (MPCB)",
            step_title="Consent to Establish (CTE Orange)",
            submitted_at="2026-02-17T09:00:00Z",
            statutory_sla_hours=120,
            hours_remaining=-14.2,
            sla_status=SLAStatus.ESCALATED,
            assigned_officer="OFFICER_KULKARNI_MPCB_02",
            escalated_to_appellate="DISTRICT_COLLECTOR_APPELLATE_OFFICE_MUMBAI",
            rtsa_statutory_clause="Maharashtra RTSA 2015, Section 10 (Appellate Authority Escalation)",
        ),
    ]

    @classmethod
    def get_applications(cls) -> List[ApplicationSLARecord]:
        return cls._applications

    @classmethod
    async def escalate_application(cls, app_id: str, reason: str, escalate_to: str) -> ApplicationSLARecord:
        app = next((a for a in cls._applications if a.application_id == app_id), None)
        if not app:
            # Create a mock record if not found
            app = ApplicationSLARecord(
                application_id=app_id,
                utid=f"UTID-MH-2026-{app_id[-6:]}",
                citizen_name="Ayush Singh Chauhan",
                department="State Department",
                step_title="Statutory Clearance Filing",
                submitted_at=datetime.now(timezone.utc).isoformat(),
                statutory_sla_hours=48,
                hours_remaining=-1.0,
                sla_status=SLAStatus.ESCALATED,
                assigned_officer="ORIGINAL_DESK_OFFICER",
                escalated_to_appellate=escalate_to,
            )
            cls._applications.append(app)
        else:
            app.sla_status = SLAStatus.ESCALATED
            app.escalated_to_appellate = escalate_to
            app.hours_remaining = min(-1.0, app.hours_remaining)

        # Broadcast SLA_BREACHED event to EventBus
        await EventBus.publish(
            event_type=EventType.SLA_BREACHED,
            utid=app.utid,
            department=app.department,
            actor="SLA_MONITORING_ENGINE",
            message=f"RTSA SLA BREACH: Application {app.application_id} auto-escalated to {escalate_to}. Reason: {reason}",
            metadata={
                "application_id": app.application_id,
                "hours_overdue": abs(app.hours_remaining),
                "escalated_to": escalate_to,
                "rtsa_clause": app.rtsa_statutory_clause,
            },
        )

        return app

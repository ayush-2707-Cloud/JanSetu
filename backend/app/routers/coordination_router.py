"""Router for Cross-Department Officer Coordination & Analytics.

Directly addresses: "Officials lack consolidated view of beneficiaries, applications,
approvals, grievances and service outcomes" from Problem Statement SIH26129.
"""

from typing import List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter(prefix="/api/officer/coordination", tags=["Cross-Department Officer Coordination"])


class DepartmentStat(BaseModel):
    department_code: str
    department_name: str
    icon: str
    total_received: int
    pending_scrutiny: int
    approved_count: int
    defects_flagged: int
    avg_turnaround_days: float
    sla_compliance_rate: float
    active_grievances: int


class InterDepartmentHandoff(BaseModel):
    handoff_id: str
    source_department: str
    target_department: str
    service_transition: str
    active_in_flight_count: int
    bottleneck_score: str  # LOW | MODERATE | HIGH
    recommendation: str


class CrossDepartmentSummaryResponse(BaseModel):
    total_statewide_applications: int
    total_approved_statewide: int
    total_active_grievances: int
    overall_sla_compliance_rate: float
    statewide_avg_days: float
    department_breakdown: List[DepartmentStat]
    inter_department_handoffs: List[InterDepartmentHandoff]


@router.get("/summary", response_model=CrossDepartmentSummaryResponse)
async def get_cross_department_summary() -> CrossDepartmentSummaryResponse:
    """Returns consolidated multi-department metrics and inter-agency pipeline health."""
    dept_stats = [
        DepartmentStat(
            department_code="FOOD_SAFETY",
            department_name="Food Safety Authority (FSSAI)",
            icon="🍲",
            total_received=1420,
            pending_scrutiny=180,
            approved_count=1180,
            defects_flagged=60,
            avg_turnaround_days=2.8,
            sla_compliance_rate=96.2,
            active_grievances=3,
        ),
        DepartmentStat(
            department_code="MUNICIPAL",
            department_name="Municipal Corporation (BMC / PMC)",
            icon="🏙️",
            total_received=2850,
            pending_scrutiny=490,
            approved_count=2150,
            defects_flagged=210,
            avg_turnaround_days=4.1,
            sla_compliance_rate=91.4,
            active_grievances=14,
        ),
        DepartmentStat(
            department_code="REVENUE",
            department_name="Revenue & Land Records (Mahabhulekh)",
            icon="📜",
            total_received=3100,
            pending_scrutiny=320,
            approved_count=2680,
            defects_flagged=100,
            avg_turnaround_days=3.4,
            sla_compliance_rate=95.8,
            active_grievances=6,
        ),
        DepartmentStat(
            department_code="MSME",
            department_name="MSME / Udyam Directorate",
            icon="🏢",
            total_received=4500,
            pending_scrutiny=85,
            approved_count=4390,
            defects_flagged=25,
            avg_turnaround_days=0.5,
            sla_compliance_rate=99.2,
            active_grievances=1,
        ),
        DepartmentStat(
            department_code="TRANSPORT",
            department_name="Transport & RTO Commissionerate",
            icon="🚛",
            total_received=1980,
            pending_scrutiny=240,
            approved_count=1680,
            defects_flagged=60,
            avg_turnaround_days=3.1,
            sla_compliance_rate=94.0,
            active_grievances=5,
        ),
    ]

    handoffs = [
        InterDepartmentHandoff(
            handoff_id="HO-FSSAI-BMC-01",
            source_department="Food Safety (FSSAI)",
            target_department="Municipal Corporation (Trade NOC)",
            service_transition="FSSAI License Issued -> Municipal Fire & Health Inspection",
            active_in_flight_count=142,
            bottleneck_score="LOW",
            recommendation="Auto-share FSSAI inspection report to bypass redundant municipal kitchen inspection.",
        ),
        InterDepartmentHandoff(
            handoff_id="HO-REV-BMC-02",
            source_department="Revenue (Mahabhulekh)",
            target_department="Municipal Corporation (Property Tax / PID)",
            service_transition="7/12 Mutation Approved -> Municipal Property Assessment PID",
            active_in_flight_count=285,
            bottleneck_score="MODERATE",
            recommendation="Trigger real-time EventBus webhook to sync mutation deed directly into municipal billing ledger.",
        ),
        InterDepartmentHandoff(
            handoff_id="HO-MSME-BANK-03",
            source_department="MSME Directorate",
            target_department="State Level Bankers Committee (SLBC)",
            service_transition="Udyam Registration -> Mudra Micro-Credit Sanction",
            active_in_flight_count=88,
            bottleneck_score="LOW",
            recommendation="Pre-populate credit appraisal memo using Once-Only verified PAN/GSTIN data.",
        ),
    ]

    return CrossDepartmentSummaryResponse(
        total_statewide_applications=13850,
        total_approved_statewide=12080,
        total_active_grievances=29,
        overall_sla_compliance_rate=95.3,
        statewide_avg_days=2.78,
        department_breakdown=dept_stats,
        inter_department_handoffs=handoffs,
    )

"""Router for Unified Cross-Portal Application Tracking.

Directly addresses: "Track applications across different portals" and "Unified application tracking"
from Problem Statement SIH26129.
"""

from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Query
from app.schemas.tracker import UnifiedTrackerResponse, ApplicationTrackItem

router = APIRouter(prefix="/api/tracker", tags=["Unified Cross-Portal Tracker"])

# Canonical In-Memory Applications Database (Synchronized across all departments)
TRACKER_APPLICATIONS_DB: List[ApplicationTrackItem] = [
    ApplicationTrackItem(
        utid="UTID-MH-2026-094182",
        application_id="FSSAI-MH-2026-88129",
        journey_id="commercial_restaurant_journey",
        journey_title="Commercial Restaurant & Food Establishment",
        department_code="FOOD_SAFETY",
        department_name="Food Safety and Standards Authority of India",
        portal_origin="FoSCoS Central Portal (FSSAI)",
        current_milestone="Stage 2: Designated Officer Document Scrutiny",
        status="SCRUTINY_STAGE_1",
        sla_total_days=14,
        sla_days_remaining=9,
        sla_status="ON_TRACK",
        assigned_officer="Dr. Rajesh G. Deshmukh (DO-Pune-04)",
        submitted_at="2026-02-18T10:30:00Z",
        last_updated_at="2026-02-22T14:15:00Z",
        action_required_by_citizen=False,
        action_notes="Application undergoing desk scrutiny for water test certificate.",
    ),
    ApplicationTrackItem(
        utid="UTID-MH-2026-094182",
        application_id="BMC-TRADE-2026-44012",
        journey_id="commercial_restaurant_journey",
        journey_title="Commercial Restaurant & Food Establishment",
        department_code="MUNICIPAL",
        department_name="Brihanmumbai Municipal Corporation (BMC)",
        portal_origin="Aaple Sarkar Municipal Gateway",
        current_milestone="Health Trade License & Fire NOC Verification",
        status="DEFECT_FLAGGED",
        sla_total_days=21,
        sla_days_remaining=4,
        sla_status="WARNING",
        assigned_officer="Shri Vikas Kulkarni (Health Officer K-East)",
        submitted_at="2026-02-16T11:00:00Z",
        last_updated_at="2026-02-23T09:45:00Z",
        action_required_by_citizen=True,
        action_notes="Uploaded Commercial Rent Agreement missing Sub-Registrar stamp seal. Re-upload requested.",
    ),
    ApplicationTrackItem(
        utid="UTID-MH-2026-094182",
        application_id="REV-MH-712-90184",
        journey_id="commercial_restaurant_journey",
        journey_title="Commercial Restaurant & Food Establishment",
        department_code="REVENUE",
        department_name="Department of Revenue & Land Records (Mahabhulekh)",
        portal_origin="Mahabhulekh Land Records System",
        current_milestone="Non-Agricultural (NA) Land Conversion Clearance",
        status="APPROVED",
        sla_total_days=30,
        sla_days_remaining=0,
        sla_status="COMPLETED",
        assigned_officer="Smt. Anjali S. Patil (Tahsildar Haveli)",
        submitted_at="2026-02-05T09:00:00Z",
        last_updated_at="2026-02-19T16:20:00Z",
        action_required_by_citizen=False,
        action_notes="Digitally signed 7/12 extract and NA Certificate issued via DigiLocker.",
    ),
    ApplicationTrackItem(
        utid="UTID-MH-2026-094182",
        application_id="UDYAM-MH-26-0091823",
        journey_id="msme_udyam_journey",
        journey_title="Udyam MSME Enterprise Registration",
        department_code="MSME",
        department_name="Ministry of Micro, Small and Medium Enterprises",
        portal_origin="National Udyam Registration Portal",
        current_milestone="Automated ITR & GSTIN Inter-linking",
        status="APPROVED",
        sla_total_days=1,
        sla_days_remaining=0,
        sla_status="COMPLETED",
        assigned_officer="Automated MDM Interoperability Gateway",
        submitted_at="2026-02-10T14:20:00Z",
        last_updated_at="2026-02-10T14:21:00Z",
        action_required_by_citizen=False,
        action_notes="Zero-touch instant issuance based on verified PAN & GST token.",
    ),
    ApplicationTrackItem(
        utid="UTID-MH-2026-094182",
        application_id="RTO-MH-12-COM-55102",
        journey_id="commercial_vehicle_permit",
        journey_title="Commercial Goods & Transport Permit",
        department_code="TRANSPORT",
        department_name="Maharashtra Motor Vehicles Department (RTO)",
        portal_origin="Vahan 4.0 National Transport Registry",
        current_milestone="Fitness Inspection & Environmental Clearance",
        status="SUBMITTED",
        sla_total_days=7,
        sla_days_remaining=6,
        sla_status="ON_TRACK",
        assigned_officer="Shri Nitin R. More (RTO Pune Central)",
        submitted_at="2026-02-22T08:30:00Z",
        last_updated_at="2026-02-22T08:30:00Z",
        action_required_by_citizen=False,
        action_notes="Vehicle inspection appointment scheduled for 25th Feb 2026.",
    ),
]


@router.get("/my-applications", response_model=UnifiedTrackerResponse)
async def get_my_applications(
    citizen_name: str = "Ayush Singh Chauhan",
    status_filter: Optional[str] = Query(None, description="Filter by status")
) -> UnifiedTrackerResponse:
    """Returns unified consolidated applications across all connected government department portals."""
    apps = TRACKER_APPLICATIONS_DB
    if status_filter and status_filter != "ALL":
        apps = [a for a in apps if a.status == status_filter or a.sla_status == status_filter]

    total_active = len([a for a in apps if a.status not in ["APPROVED", "REJECTED"]])
    total_completed = len([a for a in apps if a.status == "APPROVED"])
    pending_actions = len([a for a in apps if a.action_required_by_citizen])

    return UnifiedTrackerResponse(
        citizen_name=citizen_name,
        pan_masked="BKZPC****A",
        total_active_applications=total_active,
        completed_applications=total_completed,
        pending_actions_count=pending_actions,
        overall_sla_compliance_rate=94.5,
        applications=apps,
    )

"""Router for Exception Handling & Resolution Pipeline.

Directly addresses: "exception handling" and "data-quality checks"
from Problem Statement SIH26129.
"""

from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/officer/exceptions", tags=["Officer Exception Handling Pipeline"])


class ExceptionRecord(BaseModel):
    exception_id: str
    utid: str
    application_id: str
    citizen_name: str
    department_code: str
    department_name: str
    exception_type: str  # NAME_MISMATCH | EXPIRED_DOCUMENT | LOW_OCR_CONFIDENCE | MISSING_PREREQUISITE | TAX_SCHEMA_MISMATCH
    severity: str  # WARNING | BLOCKED | CRITICAL
    description: str
    detected_value: str
    expected_value: str
    ai_confidence_score: float
    ai_suggested_fix: str
    status: str  # PENDING_RESOLUTION | AUTO_FIXED | MANUALLY_OVERRIDDEN | REJECTED | REUPLOAD_REQUESTED
    logged_at: str
    resolved_at: Optional[str] = None
    resolved_by: Optional[str] = None
    resolution_notes: Optional[str] = None


class ResolveExceptionRequest(BaseModel):
    action: str  # ACCEPT_AI_FIX | MANUAL_OVERRIDE | REQUEST_REUPLOAD | REJECT_APPLICATION
    officer_notes: str
    officer_id: str = "OFFICER-MH-8492"


# In-Memory Exception Queue
EXCEPTION_QUEUE_DB: List[ExceptionRecord] = [
    ExceptionRecord(
        exception_id="EXC-2026-00192",
        utid="UTID-MH-2026-094182",
        application_id="BMC-TRADE-2026-44012",
        citizen_name="Ayush Singh Chauhan",
        department_code="MUNICIPAL",
        department_name="Municipal Corporation (BMC)",
        exception_type="NAME_MISMATCH",
        severity="WARNING",
        description="Fuzzy demographic discrepancy detected between Aadhaar e-KYC and Municipal Property Tax Record.",
        detected_value="Ayush S. Chouhan",
        expected_value="Ayush Singh Chauhan",
        ai_confidence_score=94.2,
        ai_suggested_fix="Accept phonetically normalized identity via DigiLocker PAN deterministic cross-verification.",
        status="PENDING_RESOLUTION",
        logged_at="2026-02-23T09:45:00Z",
    ),
    ExceptionRecord(
        exception_id="EXC-2026-00193",
        utid="UTID-MH-2026-094182",
        application_id="FSSAI-MH-2026-88129",
        citizen_name="Ayush Singh Chauhan",
        department_code="FOOD_SAFETY",
        department_name="Food Safety Authority (FSSAI)",
        exception_type="LOW_OCR_CONFIDENCE",
        severity="WARNING",
        description="Water Potability Laboratory Test Report scan has low contrast (OCR score 64%).",
        detected_value="Scanned Water Report (Blurry Header)",
        expected_value="NABL Accredited Lab Report with QR Code",
        ai_confidence_score=81.0,
        ai_suggested_fix="Directly fetch verified e-Report from Maharashtra Pollution Control Board (MPCB) repository.",
        status="PENDING_RESOLUTION",
        logged_at="2026-02-22T14:15:00Z",
    ),
    ExceptionRecord(
        exception_id="EXC-2026-00194",
        utid="UTID-MH-2026-088194",
        application_id="REV-MH-712-88102",
        citizen_name="Rajendra Tukaram Shinde",
        department_code="REVENUE",
        department_name="Revenue & Land Records (Mahabhulekh)",
        exception_type="EXPIRED_DOCUMENT",
        severity="BLOCKED",
        description="Uploaded 7/12 Land Extract is dated 2023 (exceeds statutory 90-day validity window).",
        detected_value="7/12 Extract dated 14-Aug-2023",
        expected_value="Fresh 7/12 Extract (< 90 days)",
        ai_confidence_score=99.5,
        ai_suggested_fix="Auto-pull fresh real-time digitally signed 7/12 extract from Mahabhulekh API in 1-click.",
        status="PENDING_RESOLUTION",
        logged_at="2026-02-21T11:20:00Z",
    ),
]


@router.get("", response_model=List[ExceptionRecord])
async def get_exceptions(
    status_filter: Optional[str] = None,
    department_code: Optional[str] = None
) -> List[ExceptionRecord]:
    """Returns the list of active or resolved statutory validation exceptions in the officer queue."""
    res = EXCEPTION_QUEUE_DB
    if status_filter and status_filter != "ALL":
        res = [e for e in res if e.status == status_filter]
    if department_code and department_code != "ALL":
        res = [e for e in res if e.department_code == department_code]
    return res


@router.post("/{exception_id}/resolve", response_model=ExceptionRecord)
async def resolve_exception(exception_id: str, req: ResolveExceptionRequest) -> ExceptionRecord:
    """Executes an officer decision on an exception (Accept AI Fix, Manual Override, Request Reupload, Reject)."""
    for e in EXCEPTION_QUEUE_DB:
        if e.exception_id == exception_id:
            now_iso = datetime.now(timezone.utc).isoformat()
            e.resolved_at = now_iso
            e.resolved_by = req.officer_id
            e.resolution_notes = req.officer_notes

            if req.action == "ACCEPT_AI_FIX":
                e.status = "AUTO_FIXED"
            elif req.action == "MANUAL_OVERRIDE":
                e.status = "MANUALLY_OVERRIDDEN"
            elif req.action == "REQUEST_REUPLOAD":
                e.status = "REUPLOAD_REQUESTED"
            elif req.action == "REJECT_APPLICATION":
                e.status = "REJECTED"
            else:
                e.status = "MANUALLY_OVERRIDDEN"

            return e

    raise HTTPException(status_code=404, detail="Exception ID not found in active queue")

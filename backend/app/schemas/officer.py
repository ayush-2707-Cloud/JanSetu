"""
Pydantic Schemas for Official/Admin Back-Office Cross-Departmental Review.
Supports multi-department statutory application processing (MSME, FSSAI, Revenue, Municipal, Transport).
"""

from __future__ import annotations
from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field, AliasChoices
from datetime import datetime


class ApplicationStatus(str, Enum):
    PENDING_REVIEW = "PENDING_REVIEW"
    APPROVED = "APPROVED"
    DEFECT_FLAGGED = "DEFECT_FLAGGED"
    REJECTED = "REJECTED"


class DepartmentCode(str, Enum):
    MSME = "MSME"
    FOOD_SAFETY = "FOOD_SAFETY"  # FSSAI
    REVENUE = "REVENUE"
    MUNICIPAL = "MUNICIPAL"
    TRANSPORT = "TRANSPORT"
    LABOUR = "LABOUR"


class VerificationTimelineItem(BaseModel):
    step_id: str
    step_title: str
    department: str
    completed_at: Optional[str] = None
    status: str  # "VERIFIED", "PENDING", "DEFECT", "NOT_REACHED"
    verified_by: Optional[str] = None
    officer_remarks: Optional[str] = None


class DossierDocument(BaseModel):
    doc_id: str
    doc_name: str
    category: str
    verification_status: str  # "VERIFIED_DIGILOCKER", "REQUIRES_SCRUTINY", "SELF_ATTESTED", "DEFECT"
    issuing_authority: str
    file_url: Optional[str] = None
    hash_checksum: Optional[str] = None
    uploaded_at: str


class BeneficiaryDossier(BaseModel):
    citizen_name: str
    applicant_id: str
    aadhaar_masked: str
    pan_masked: str
    mobile: str
    email: str
    enterprise_name: Optional[str] = None
    entity_type: Optional[str] = None
    registered_address: str = Field(..., validation_alias=AliasChoices("registered_address", "registeredAddress"))
    pincode: str
    state: str
    district: str
    timeline: List[VerificationTimelineItem] = Field(default_factory=list)
    documents: List[DossierDocument] = Field(default_factory=list)

    model_config = {"populate_by_name": True}


class OfficerApplication(BaseModel):
    application_id: str
    citizen_name: str
    enterprise_name: Optional[str] = None
    department: DepartmentCode
    department_name: str
    service_title: str
    journey_id: str
    current_step_id: str
    current_step_title: str
    status: ApplicationStatus = ApplicationStatus.PENDING_REVIEW
    submission_date: str
    sla_deadline: str  # ISO string or datetime
    sla_hours_total: int = 48
    sla_hours_remaining: float
    is_sla_breached: bool = False
    risk_score: int = Field(default=15, description="0-100 score, higher means higher regulatory risk")
    dossier: BeneficiaryDossier
    last_action_date: Optional[str] = None
    last_officer_id: Optional[str] = None
    last_officer_remarks: Optional[str] = None


class OfficerDecisionRequest(BaseModel):
    application_id: str
    step_id: str
    decision: ApplicationStatus  # APPROVED, DEFECT_FLAGGED, REJECTED
    remarks: str
    defect_reasons: Optional[List[str]] = Field(default_factory=list)
    officer_id: str = "OFFICER-KA-9942"
    officer_name: str = "Shri S. Ranganathan"
    officer_designation: str = "Assistant Commissioner / Nodal Scrutiny Officer"
    department: DepartmentCode = DepartmentCode.MSME


class OfficerDecisionResponse(BaseModel):
    success: bool
    application_id: str
    new_status: ApplicationStatus
    decision_timestamp: str
    sla_time_delta_hours: float
    sla_performance_summary: str
    audit_reference_id: str
    officer_id: str
    message: str


class DossierAnalysisRequest(BaseModel):
    application_id: str
    service_title: str
    department: str
    citizen_name: str
    enterprise_name: Optional[str] = None
    documents: List[Dict[str, Any]] = Field(default_factory=list)
    timeline: List[Dict[str, Any]] = Field(default_factory=list)
    additional_notes: Optional[str] = None


class DossierAnalysisResponse(BaseModel):
    application_id: str
    identity_verification_status: str
    document_completeness: str
    regulatory_red_flags: str
    overall_risk_level: str  # "LOW", "MEDIUM", "ELEVATED"
    risk_score: int  # 0 - 100
    statutory_citations: List[str] = Field(default_factory=list)
    recommended_action: str  # "APPROVE", "REQUEST_CLARIFICATION", "REJECT"
    analysis_timestamp: str

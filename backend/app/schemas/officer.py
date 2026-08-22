"""
Pydantic Schemas for Official/Admin Back-Office Cross-Departmental Review.
Supports multi-department statutory application processing (MSME, FSSAI, Revenue, Municipal, Transport).
"""

from __future__ import annotations
from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field, AliasChoices
from datetime import datetime


class UserRole(str, Enum):
    OFFICER_ROLE = "OFFICER_ROLE"
    CITIZEN_ROLE = "CITIZEN_ROLE"
    ADMIN_ROLE = "ADMIN_ROLE"


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
    utid: str = Field(..., validation_alias=AliasChoices("utid", "application_id"), description="Universal Transaction Identifier")
    application_id: Optional[str] = None
    applicant_name: str = Field(..., validation_alias=AliasChoices("applicant_name", "citizen_name"))
    citizen_name: Optional[str] = None
    enterprise_name: Optional[str] = None
    department: DepartmentCode
    department_name: str
    target_goal: str = Field(..., validation_alias=AliasChoices("target_goal", "service_title"))
    service_title: Optional[str] = None
    journey_id: str
    current_step_id: str
    current_department_stage: str = Field(..., validation_alias=AliasChoices("current_department_stage", "current_step_title"))
    current_step_title: Optional[str] = None
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

    def model_post_init(self, __context: Any) -> None:
        if not self.application_id:
            self.application_id = self.utid
        if not self.citizen_name:
            self.citizen_name = self.applicant_name
        if not self.service_title:
            self.service_title = self.target_goal
        if not self.current_step_title:
            self.current_step_title = self.current_department_stage

    model_config = {"populate_by_name": True}


class OfficerDecisionRequest(BaseModel):
    utid: str = Field(..., validation_alias=AliasChoices("utid", "application_id"), description="Universal Transaction Identifier")
    application_id: Optional[str] = None
    step_id: str
    decision: ApplicationStatus  # APPROVED, DEFECT_FLAGGED, REJECTED
    remarks: str
    defect_reasons: Optional[List[str]] = Field(default_factory=list)
    officer_id: str = "OFFICER-KA-9942"
    officer_name: str = "Shri S. Ranganathan"
    officer_designation: str = "Assistant Commissioner / Nodal Scrutiny Officer"
    department: Optional[DepartmentCode] = None

    def model_post_init(self, __context: Any) -> None:
        if not self.application_id:
            self.application_id = self.utid

    model_config = {"populate_by_name": True}


class OfficerDecisionResponse(BaseModel):
    success: bool
    utid: str = Field(..., validation_alias=AliasChoices("utid", "application_id"))
    application_id: Optional[str] = None
    new_status: ApplicationStatus
    decision_timestamp: str
    sla_time_delta_hours: float
    sla_performance_summary: str
    audit_reference_id: str
    officer_id: str
    message: str
    citizen_roadmap_updated: bool = True

    def model_post_init(self, __context: Any) -> None:
        if not self.application_id:
            self.application_id = self.utid

    model_config = {"populate_by_name": True}


class DossierAnalysisRequest(BaseModel):
    utid: str = Field(..., validation_alias=AliasChoices("utid", "application_id"))
    application_id: Optional[str] = None
    service_title: str
    department: str
    citizen_name: str
    enterprise_name: Optional[str] = None
    documents: List[Dict[str, Any]] = Field(default_factory=list)
    timeline: List[Dict[str, Any]] = Field(default_factory=list)
    additional_notes: Optional[str] = None

    def model_post_init(self, __context: Any) -> None:
        if not self.application_id:
            self.application_id = self.utid

    model_config = {"populate_by_name": True}


class DossierAnalysisResponse(BaseModel):
    utid: str = Field(..., validation_alias=AliasChoices("utid", "application_id"))
    application_id: Optional[str] = None
    identity_verification_status: str
    document_completeness: str
    regulatory_red_flags: str
    overall_risk_level: str  # "LOW", "MEDIUM", "ELEVATED"
    risk_score: int  # 0 - 100
    statutory_citations: List[str] = Field(default_factory=list)
    recommended_action: str  # "APPROVE", "REQUEST_CLARIFICATION", "REJECT"
    analysis_timestamp: str

    def model_post_init(self, __context: Any) -> None:
        if not self.application_id:
            self.application_id = self.utid

    model_config = {"populate_by_name": True}

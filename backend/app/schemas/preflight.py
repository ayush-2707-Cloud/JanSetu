"""Pydantic schemas for GovTech Pre-Flight Validation and AI Exception Handling."""

from __future__ import annotations
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ValidationSeverity(str, Enum):
    PASSED = "PASSED"
    WARNING = "WARNING"
    BLOCKED = "BLOCKED"


class IssueCategory(str, Enum):
    NAME_MISMATCH = "NAME_MISMATCH"
    DOCUMENT_EXPIRED = "DOCUMENT_EXPIRED"
    EXPIRING_SOON = "EXPIRING_SOON"
    SCHEMA_INVALID = "SCHEMA_INVALID"
    MISSING_MANDATORY_FIELD = "MISSING_MANDATORY_FIELD"
    OCR_LOW_CONFIDENCE = "OCR_LOW_CONFIDENCE"
    RESOLUTION_LOW = "RESOLUTION_LOW"
    PREREQUISITE_UNMET = "PREREQUISITE_UNMET"


class UploadedDocument(BaseModel):
    id: str = Field(..., description="Unique ID of the uploaded document")
    doc_type: str = Field(..., description="E.g. PAN_CARD, AADHAAR_CARD, RENT_AGREEMENT, FSSAI_NOC, ELECTRICITY_BILL")
    file_name: str = Field(..., description="Original filename")
    file_size_kb: Optional[float] = Field(default=250.0, description="File size in kilobytes")
    extracted_name: Optional[str] = Field(default=None, description="Name parsed from OCR/DigiLocker")
    extracted_identifier: Optional[str] = Field(default=None, description="PAN, Aadhaar last-4, License number")
    extracted_address: Optional[str] = Field(default=None, description="Address extracted from document")
    expiry_date: Optional[str] = Field(default=None, description="Expiry date in YYYY-MM-DD format")
    issue_date: Optional[str] = Field(default=None, description="Issue date in YYYY-MM-DD format")
    ocr_confidence: Optional[float] = Field(default=0.95, description="OCR confidence score between 0.0 and 1.0")
    resolution_dpi: Optional[int] = Field(default=300, description="Document image DPI")
    digilocker_verified: Optional[bool] = Field(default=False, description="Whether document is DigiLocker verified")


class PreflightValidationRequest(BaseModel):
    journey_id: Optional[str] = Field(default=None, description="Optional journey blueprint ID")
    step_id: Optional[str] = Field(default=None, description="Optional current step ID")
    applicant_name: Optional[str] = Field(default=None, description="Official applicant name entered in form")
    applicant_pan: Optional[str] = Field(default=None, description="Entered PAN")
    applicant_aadhaar_last4: Optional[str] = Field(default=None, description="Entered Aadhaar last 4 digits")
    applicant_dob: Optional[str] = Field(default=None, description="Date of birth YYYY-MM-DD")
    applicant_pin: Optional[str] = Field(default=None, description="6-digit postal PIN code")
    applicant_phone: Optional[str] = Field(default=None, description="10-digit mobile number")
    applicant_email: Optional[str] = Field(default=None, description="Applicant email address")
    form_data: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary form parameters")
    uploaded_documents: List[UploadedDocument] = Field(default_factory=list, description="List of uploaded certificate metadata")


class DiscrepancyDetail(BaseModel):
    field_a_name: str
    field_a_value: str
    field_b_name: str
    field_b_value: str
    similarity_score: Optional[float] = None
    is_recognized_alias: Optional[bool] = None


class ValidationIssue(BaseModel):
    id: str = Field(..., description="Unique issue identifier")
    severity: ValidationSeverity = Field(..., description="PASSED, WARNING, or BLOCKED")
    category: IssueCategory = Field(..., description="Category of the quality issue")
    field: str = Field(..., description="Field or document name affected")
    title: str = Field(..., description="Short human-readable title")
    description: str = Field(..., description="Detailed technical explanation")
    discrepancy: Optional[DiscrepancyDetail] = Field(default=None, description="Field comparison detail if mismatch")
    rejection_reason: str = Field(..., description="Plain-language reason why government portals will reject this")
    corrective_action: str = Field(..., description="Exact 1-step corrective action the citizen should take")
    can_override: bool = Field(default=False, description="Whether citizen can proceed with self-declaration")
    autofix_available: bool = Field(default=False, description="Whether an automated 1-click fix is available")
    autofix_action: Optional[str] = Field(default=None, description="Action code: SYNC_NAME_TO_AADHAAR, DRAFT_AFFIDAVIT, RENEW_DOC")


class QualityMetrics(BaseModel):
    quality_score: int = Field(..., description="Overall quality score (0-100)")
    ocr_confidence_avg: float = Field(..., description="Average OCR confidence across documents (0.0-1.0)")
    name_similarity_min: float = Field(..., description="Lowest name match similarity score (0.0-1.0)")
    schema_completeness_pct: int = Field(..., description="Mandatory schema completeness (0-100)")
    validity_guardrail_passed: bool = Field(..., description="Whether all documents are unexpired")


class PreflightValidationResponse(BaseModel):
    overall_status: ValidationSeverity = Field(..., description="PASSED, WARNING, or BLOCKED")
    metrics: QualityMetrics
    passed_checks_count: int
    warning_checks_count: int
    blocked_checks_count: int
    issues: List[ValidationIssue]
    ai_summary: str = Field(..., description="Executive AI assessment of filing quality")
    timestamp: str


class ExceptionResolutionRequest(BaseModel):
    issue_id: str
    field_a_name: str
    field_a_value: str
    field_b_name: str
    field_b_value: str
    doc_type: str = "OFFICIAL_GOVERNMENT_DOC"
    portal_target: str = "National GovTech Portal (FSSAI / MSME / Revenue)"


class ExceptionResolutionResponse(BaseModel):
    issue_id: str
    rejection_risk: str  # HIGH, MEDIUM, LOW
    portal_rule_citation: str
    plain_language_explanation: str
    exact_1step_corrective_action: str
    affidavit_template_snippet: Optional[str] = None
    recognized_as_alias: bool = False
    ai_model_used: str = "Gemini 2.5 Flash GovTech Exception Engine"

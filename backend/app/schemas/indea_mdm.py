"""Pydantic models for IndEA 2.0 (India Enterprise Architecture) Canonical Data Schema.

Conforms to National e-Governance Division (NeGD) and MeitY IndEA 2.0 metadata standards.
"""

from __future__ import annotations
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class CanonicalAddress(BaseModel):
    line1: str = Field(..., description="Premises / Building / Flat number")
    locality: str = Field(..., description="Street or Locality")
    city: str = Field(..., description="City / District")
    state: str = Field(..., description="Indian State / Union Territory")
    pin_code: str = Field(..., description="6-digit Indian Postal PIN Code")
    country: str = Field(default="IN", description="ISO 3166-1 alpha-2 country code")
    is_verified: bool = Field(default=True, description="DigiLocker / e-KYC verified address")


class CanonicalCitizenRecord(BaseModel):
    utid: str = Field(..., description="Unified Tracking & Citizen Identifier (IndEA 2.0 UTID)")
    full_name: str = Field(..., description="Normalized Full Name in standard order (First Middle Last)")
    pan_number: str = Field(..., description="Standardized 10-character Permanent Account Number")
    aadhaar_token: str = Field(..., description="Masked or Vault Token UID (No plain 12-digit stored)")
    mobile: str = Field(..., description="E.164 formatted Mobile Number (+91-XXXXXXXXXX)")
    email: str = Field(..., description="Normalized lowercase email address")
    date_of_birth: str = Field(..., description="ISO 8601 YYYY-MM-DD Date of Birth")
    gender: str = Field(..., description="Standardized Gender: MALE, FEMALE, TRANSGENDER, OTHER")
    entity_type: str = Field(..., description="INDIVIDUAL, PROPRIETORSHIP, PRIVATE_LIMITED, PARTNERSHIP")
    address: CanonicalAddress = Field(..., description="Canonical IndEA 2.0 Address")
    registered_enterprises: List[Dict[str, Any]] = Field(default_factory=list)
    schema_version: str = Field(default="IndEA-2.0-GovTech", description="IndEA Specification Version")


class HarmonizationRule(BaseModel):
    rule_id: str
    source_field: str
    target_canonical_field: str
    transformation_applied: str  # e.g. "REGEX_NORMALIZE_PAN", "SPLIT_AND_ORDER_NAME", "ADDRESS_STRUCTURER"
    sample_input: str
    sample_output: str


class HarmonizationRequest(BaseModel):
    department_code: str = Field(..., description="Source department: REVENUE_DEPT, MUNICIPAL_CORP, MSME_UDYAM, FSSAI_FOSCOS")
    raw_payload: Dict[str, Any] = Field(..., description="Disparate legacy department payload")


class HarmonizationResponse(BaseModel):
    department_code: str
    status: str = "HARMONIZED_SUCCESS"
    canonical_record: CanonicalCitizenRecord
    rules_applied: List[HarmonizationRule]
    raw_keys_mapped_count: int
    data_quality_score: float = 100.0
    schema_conformance: str = "IndEA 2.0 Standard (MeitY/NeGD)"

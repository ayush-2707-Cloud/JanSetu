"""Pydantic schemas for GovTech Interoperability Middleware.

Defines data contracts for:
1. Reusable Connectors & Protocol Conversion (SOAP/XML <-> REST/JSON)
2. Master Data Management (MDM) Golden Citizen Record & Once-Only Auto-Populate
3. Cryptographic Tamper-Evident SHA-256 Audit Trail & SLA Compliance Engine
"""

from __future__ import annotations
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ConnectorProtocol(str, Enum):
    REST_JSON = "REST_JSON"
    SOAP_XML = "SOAP_XML"
    BATCH_XML = "BATCH_XML"
    WEBHOOK = "WEBHOOK"
    OAUTH2_BRIDGE = "OAUTH2_BRIDGE"


class ConnectorStatus(str, Enum):
    ACTIVE = "ACTIVE"
    DEGRADED = "DEGRADED"
    STANDBY = "STANDBY"


class ConnectorSpec(BaseModel):
    id: str = Field(..., description="Unique connector identifier")
    name: str = Field(..., description="Human-readable name of the portal connector")
    department: str = Field(..., description="Issuing/Operating Government Ministry")
    protocol: ConnectorProtocol = Field(..., description="Underlying communication protocol")
    version: str = Field(default="v1.0", description="API/Adapter specification version")
    endpoint_url: str = Field(..., description="Standardized endpoint or mock gateway URI")
    latency_ms: int = Field(default=45, description="Average response latency in milliseconds")
    uptime_percentage: float = Field(default=99.95, description="Rolling 30-day uptime SLA")
    status: ConnectorStatus = Field(default=ConnectorStatus.ACTIVE, description="Current operational state")
    supported_operations: List[str] = Field(default_factory=list, description="Operations like FETCH_DOC, VERIFY_TOKEN")
    sample_legacy_payload: str = Field(..., description="Raw SOAP/XML envelope or legacy payload")
    sample_canonical_json: Dict[str, Any] = Field(..., description="Transformed canonical JSON data structure")


class ProtocolTransformRequest(BaseModel):
    connector_id: str
    direction: str = Field(default="LEGACY_TO_CANONICAL", description="LEGACY_TO_CANONICAL or CANONICAL_TO_LEGACY")
    payload_content: str = Field(..., description="XML string or JSON string to transform")


class ProtocolTransformResponse(BaseModel):
    connector_id: str
    direction: str
    original_protocol: ConnectorProtocol
    transformed_protocol: ConnectorProtocol
    transformed_content: str
    schema_validation_passed: bool
    transformation_latency_ms: float
    mapped_fields_count: int


# --- Master Data Management (MDM) Schemas ---

class ProvenanceSource(BaseModel):
    department: str
    registry_name: str
    verified_at: str
    verification_method: str  # e.g. "DIGILOCKER_EKYC", "CBDT_PAN_LOOKUP", "BHOOMI_RTC"
    confidence_score: float = 1.0


class IdentityAttribute(BaseModel):
    key: str
    label: str
    value: str
    provenance: ProvenanceSource
    is_authoritative: bool = True


class MDMGoldenRecord(BaseModel):
    citizen_id: str = Field(..., description="Canonical Unified Citizen ID (e.g. CIT-2026-IND-9481)")
    full_name: str
    pan_number: str
    aadhaar_masked: str
    phone_masked: str
    email_masked: str
    date_of_birth: str
    gender: str
    primary_address: Dict[str, str]
    registered_enterprises: List[Dict[str, Any]] = Field(default_factory=list)
    land_parcels: List[Dict[str, Any]] = Field(default_factory=list)
    identity_attributes: List[IdentityAttribute] = Field(default_factory=list)
    deduplication_confidence: float = 0.998
    last_sync_timestamp: str


class AutoPopulateRequest(BaseModel):
    citizen_id: str = "CIT-2026-IND-9481"
    target_departments: List[str] = Field(
        default_factory=lambda: ["MSME_UDYAM", "FSSAI_FOSCOS", "MUNICIPAL_TRADE_LICENSE", "POLLUTION_CONTROL_NOC"]
    )


class DepartmentPreFilledForm(BaseModel):
    department_code: str
    form_title: str
    statutory_portal: str
    pre_filled_fields: Dict[str, Any]
    eliminated_manual_keystrokes: int
    auto_validated_docs: List[str]


class AutoPopulateResponse(BaseModel):
    citizen_id: str
    once_only_principle_applied: bool = True
    total_eliminated_fields: int
    total_time_saved_minutes: int
    department_forms: List[DepartmentPreFilledForm]


# --- Cryptographic Audit Trail & SLA Analytics Schemas ---

class AuditActionType(str, Enum):
    APPLICATION_INITIATED = "APPLICATION_INITIATED"
    DPDP_CONSENT_GRANTED = "DPDP_CONSENT_GRANTED"
    PREFLIGHT_QUALITY_PASSED = "PREFLIGHT_QUALITY_PASSED"
    LEGACY_CONNECTOR_SYNC = "LEGACY_CONNECTOR_SYNC"
    OFFICER_SCRUTINY_APPROVED = "OFFICER_SCRUTINY_APPROVED"
    DEFECT_NOTICE_ISSUED = "DEFECT_NOTICE_ISSUED"
    STATUTORY_LICENSE_GRANTED = "STATUTORY_LICENSE_GRANTED"


class CryptographicAuditEvent(BaseModel):
    event_id: str
    sequence_number: int
    timestamp: str
    action_type: AuditActionType
    actor_role: str  # "CITIZEN", "OFFICER", "SYSTEM_MIDDLEWARE"
    actor_identifier: str
    department: str
    details: str
    previous_hash: str
    current_hash: str
    signature_algorithm: str = "SHA-256 (ECDSA P-256)"
    ip_origin: str = "10.14.22.8 (GovNIC Secure Gateway)"


class AuditLedgerResponse(BaseModel):
    utid: str
    total_events: int
    genesis_timestamp: str
    latest_hash: str
    is_ledger_tamper_free: bool = True
    events: List[CryptographicAuditEvent]


class SLAMetric(BaseModel):
    department: str
    service_name: str
    statutory_sla_days: int
    actual_average_days: float
    sla_compliance_rate: float
    active_in_flight: int
    escalated_cases: int
    right_to_services_act_clause: str


class DepartmentSLAAnalytics(BaseModel):
    overall_sla_compliance_pct: float
    total_turnaround_reduction_pct: float
    average_processing_days: float
    active_bottleneck_department: str
    department_metrics: List[SLAMetric]
    timestamp: str

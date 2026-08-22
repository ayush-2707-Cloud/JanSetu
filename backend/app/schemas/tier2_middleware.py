"""Pydantic schemas for Tier-2 Enterprise Middleware Suite (SIH26129 - Maharashtra).

Covers:
1. IndEA 2.0 6-Pillar Standards Compliance
2. Circuit Breaker & Dead-Letter Queue (DLQ)
3. CPGRAMS & Maharashtra RTSA Grievance Bridge
4. Observability & APM Telemetry
5. Master Citizen Index (MCI) & De-Duplication Engine
"""

from __future__ import annotations
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


# --- 1. IndEA 2.0 Standards & Open API Compliance ---

class IndEAPillarAudit(BaseModel):
    pillar_code: str  # BRM, DRM, ARM, TRM, SRM, PRM
    pillar_name: str
    compliance_status: str = "COMPLIANT_100_PERCENT"
    standard_applied: str
    verified_features: List[str]
    audit_remarks: str


class IndEAComplianceReport(BaseModel):
    framework_version: str = "IndEA 2.0 (MeitY / NeGD Standard)"
    audit_date: str
    overall_compliance_score: float = 100.0
    pillars: List[IndEAPillarAudit]
    response_headers_enforced: Dict[str, str]


# --- 2. Resiliency Engine (Circuit Breaker + DLQ) ---

class CircuitStateEnum(str, Enum):
    CLOSED = "CLOSED"       # Normal: Calls pass to external API
    OPEN = "OPEN"           # Broken: Fast-fails, routes to DLQ buffer
    HALF_OPEN = "HALF_OPEN" # Probing: Testing if downstream API recovered


class DLQItem(BaseModel):
    item_id: str
    service_name: str
    endpoint: str
    payload: Dict[str, Any]
    failed_at: str
    retry_count: int = 0
    max_retries: int = 3
    next_retry_at: str
    status: str = "BUFFERED_IN_DLQ"
    error_message: str


class ChaosOutageToggleRequest(BaseModel):
    service_name: str  # fssai_portal, revenue_gateway, municipal_portal, digilocker
    status: bool = True  # True = Break service, False = Restore normal


class ResilienceStatusResponse(BaseModel):
    active_circuit_states: Dict[str, CircuitStateEnum]
    dlq_buffered_count: int
    dlq_items: List[DLQItem]
    chaos_outages_active: Dict[str, bool]
    message: str


# --- 3. Inter-Departmental Grievance Bridge (CPGRAMS / RTSA) ---

class GrievanceDraftRequest(BaseModel):
    utid: str
    department: str
    citizen_name: str
    delay_days: int = 7
    reason: Optional[str] = "Statutory Scrutiny SLA Window Elapsed with No Decision"


class GrievanceDraftResponse(BaseModel):
    utid: str
    department: str
    statutory_clause: str = "Maharashtra Right to Public Services Act 2015, Section 8 & Section 10"
    relief_requested: str
    drafted_petition: str
    target_authority: str = "DISTRICT_COLLECTOR_APPELLATE_AUTHORITY"


class GrievanceFileRequest(BaseModel):
    utid: str
    department: str
    citizen_name: str
    phone: str = "+91 98765-43210"
    grievance_text: str
    relief_requested: str = "Immediate statutory license issuance and departmental inquiry under RTSA Section 8"


class GrievanceRecord(BaseModel):
    grievance_id: str  # e.g. CPGRAMS-2026-GRV-8491
    utid: str
    department: str
    citizen_name: str
    filed_at: str
    status: str = "ESCALATED_TO_APPELLATE_AUTHORITY"
    assigned_appellate_officer: str = "ADDITIONAL_DISTRICT_MAGISTRATE_MUMBAI"
    tracking_url: str


# --- 4. Observability & APM Telemetry ---

class DepartmentLatencyMetric(BaseModel):
    department_code: str
    department_name: str
    latency_ms: float
    status: str  # HEALTHY, DEGRADED, OUTAGE
    requests_per_sec: float
    error_rate_percent: float


class APMTelemetryMetrics(BaseModel):
    system_uptime_percent: float = 99.98
    total_api_transactions_24h: int = 142850
    active_connections_count: int = 42
    timestamp: str
    department_latencies: List[DepartmentLatencyMetric]
    circuit_breaker_summary: Dict[str, str]
    dlq_queue_depth: int


# --- 5. Master Citizen Index (MCI) & De-Duplication ---

class MCIAuditRequest(BaseModel):
    utid: str
    full_name: str
    pan_number: str
    aadhaar_token: str
    phone: str
    proposed_subsidy_code: Optional[str] = None


class MCIAuditResponse(BaseModel):
    utid: str
    has_conflict: bool
    conflict_type: Optional[str] = None  # DUPLICATE_PAN, SUBSIDY_CLASH, MULTIPLE_IDENTITY_FOUND
    conflicting_utid: Optional[str] = None
    confidence_score: float = 0.0
    reason: str
    recommended_action: str

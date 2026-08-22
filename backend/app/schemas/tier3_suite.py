"""Pydantic schemas for Tier-3 Demo & Compliance Suite (SIH26129 - Maharashtra).

Covers:
1. Proactive Citizen WhatsApp & SMS Push Notification Simulator
2. Synthetic API Load Benchmark Generator
3. DPDP 2025 Data Portability Dossier & Right-to-be-Forgotten Erasure Certificate
"""

from __future__ import annotations
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


# --- 1. Proactive WhatsApp & SMS Push Notifications ---

class PushNotificationRequest(BaseModel):
    utid: str = "UTID-MH-2026-094182"
    channel: str = "WHATSAPP"  # WHATSAPP | SMS
    event_type: str = "MILESTONE_APPROVED"  # MILESTONE_APPROVED | DEFECT_FLAGGED | SLA_WARNING | DEEMED_APPROVAL
    recipient_name: str = "Ayush Singh Chauhan"
    phone: str = "+91 98765-43210"
    department: str = "Food Safety Authority (FSSAI)"
    message: Optional[str] = None


class PushNotificationRecord(BaseModel):
    notification_id: str
    utid: str
    channel: str
    event_type: str
    recipient_name: str
    phone: str
    department: str
    timestamp: str
    message: str
    delivery_status: str = "DELIVERED"
    read_receipt: bool = True


# --- 2. Synthetic API Load Benchmark Generator ---

class BenchmarkRequest(BaseModel):
    transaction_count: int = Field(default=500, ge=10, le=5000)
    concurrency_level: int = Field(default=25, ge=1, le=100)


class BenchmarkResult(BaseModel):
    benchmark_id: str
    total_transactions_processed: int
    concurrency_level: int
    elapsed_time_sec: float
    throughput_ops_per_sec: float
    p50_latency_ms: float
    p95_latency_ms: float
    p99_latency_ms: float
    success_rate_percent: float = 100.0
    error_rate_percent: float = 0.0
    timestamp: str
    architecture_stamp: str = "FastAPI Async IO + Uvicorn Worker Pool"


# --- 3. DPDP 2025 Data Portability & Erasure Certificate ---

class ConsentRecordExport(BaseModel):
    consent_id: str
    purpose: str
    data_elements: List[str]
    granted_at: str
    status: str = "ACTIVE"
    legal_basis: str = "DPDP Act 2023 Section 6(1)"


class CitizenDossierExport(BaseModel):
    export_id: str
    utid: str
    generated_at: str
    data_principal_name: str
    pan_masked: str
    aadhaar_vault_token: str
    mobile: str
    email: str
    active_applications: List[Dict[str, Any]]
    consents_logged: List[ConsentRecordExport]
    cryptographic_checksum_sha256: str
    regulatory_framework: str = "Digital Personal Data Protection Act 2023 / DPDP Rules 2025"


class ErasureRequest(BaseModel):
    utid: str = "UTID-MH-2026-094182"
    reason: str = "Citizen Right-to-be-Forgotten Request under DPDP Act 2023 Section 12(3)"


class ErasureCertificate(BaseModel):
    certificate_id: str
    utid: str
    erasure_timestamp: str
    purged_records_count: int
    data_principal_name: str
    issuing_authority: str = "Data Protection Officer (DPO), Govt of Maharashtra"
    legal_clause: str = "DPDP Act 2023, Section 12(3) (Right to Correction and Erasure)"
    sha256_verification_hash: str
    status: str = "PERMANENTLY_PURGED_FROM_ACTIVE_REGISTRIES"

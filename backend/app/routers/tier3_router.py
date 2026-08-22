"""FastAPI Router for Tier-3 Demo & Compliance Suite (SIH26129 - Maharashtra).

Implements:
1. Proactive WhatsApp & SMS Push Simulator
2. Synthetic API Load Benchmark Generator
3. DPDP 2025 Data Portability Dossier & Right-to-be-Forgotten Erasure Certificate
"""

from fastapi import APIRouter, Query, status
from typing import List, Dict, Any
from app.schemas.tier3_suite import (
    PushNotificationRequest,
    PushNotificationRecord,
    BenchmarkRequest,
    BenchmarkResult,
    CitizenDossierExport,
    ErasureRequest,
    ErasureCertificate,
)
from app.services.push_notification_service import PushNotificationService
from app.services.benchmark_service import BenchmarkService
from app.services.privacy_service import PrivacyService

router = APIRouter(tags=["Tier-3 Demo & Compliance Suite (SIH26129)"])


# --- 1. Proactive WhatsApp & SMS Push Simulator ---

@router.post(
    "/notifications/simulate-push",
    response_model=PushNotificationRecord,
    summary="Simulate Proactive WhatsApp / SMS Push Notification",
    description="Dispatches a realistic statutory milestone notification to the citizen's mobile phone simulator."
)
async def api_simulate_push_notification(payload: PushNotificationRequest) -> PushNotificationRecord:
    """Trigger proactive push notification."""
    return PushNotificationService.simulate_push(payload)


@router.get(
    "/notifications/history/{utid}",
    response_model=List[PushNotificationRecord],
    summary="Get Push Notification History for Citizen UTID",
    description="Returns all dispatched WhatsApp and SMS push alerts for a specific application."
)
async def api_get_notification_history(utid: str) -> List[PushNotificationRecord]:
    """Retrieve notification log for UTID."""
    return PushNotificationService.get_history_for_utid(utid)


@router.get(
    "/notifications/recent",
    response_model=List[PushNotificationRecord],
    summary="Get All Recent Push Notifications",
    description="Returns global recent notification events."
)
async def api_get_recent_notifications() -> List[PushNotificationRecord]:
    """Retrieve all recent notifications."""
    return PushNotificationService.get_all_recent()


# --- 2. Synthetic API Load Benchmark Generator ---

@router.post(
    "/dev/benchmark",
    response_model=BenchmarkResult,
    summary="Execute Synthetic 500+ Transaction Load Benchmark",
    description="Spawns concurrent asynchronous tasks executing real IndEA 2.0 schema conversions, UTID generation, and state validations to benchmark throughput (ops/sec) and p95/p99 latency."
)
async def api_execute_benchmark(
    count: int = Query(default=500, ge=10, le=5000, description="Total transactions to simulate"),
    concurrency: int = Query(default=25, ge=1, le=100, description="Concurrency level"),
) -> BenchmarkResult:
    """Execute high-load stress test benchmark."""
    req = BenchmarkRequest(transaction_count=count, concurrency_level=concurrency)
    return await BenchmarkService.execute_benchmark(req)


@router.get(
    "/dev/benchmark/history",
    response_model=List[BenchmarkResult],
    summary="Get Past Benchmark Stress Test Results",
    description="Retrieves historical throughput and latency metrics from previous benchmark runs."
)
async def api_get_benchmark_history() -> List[BenchmarkResult]:
    """Retrieve benchmark run history."""
    return BenchmarkService.get_history()


# --- 3. DPDP 2025 Data Portability & Erasure Certificate ---

@router.get(
    "/privacy/export-dossier",
    response_model=CitizenDossierExport,
    summary="Download Portable Citizen Data Dossier (DPDP 2025)",
    description="Exports a complete, portable JSON dossier of all citizen data elements, logged consent tokens, and application history under DPDP Act 2023 Section 12."
)
async def api_export_citizen_dossier(
    utid: str = Query(default="UTID-MH-2026-094182", description="Citizen Unified Tracking ID")
) -> CitizenDossierExport:
    """Export complete citizen data dossier."""
    return PrivacyService.export_citizen_dossier(utid)


@router.post(
    "/privacy/purge-session",
    response_model=ErasureCertificate,
    summary="Right-to-be-Forgotten: Purge Session & Generate Cryptographic Erasure Certificate",
    description="Purges in-memory citizen cache and returns a SHA-256 signed official Erasure Certificate compliant with DPDP Act Section 12(3)."
)
async def api_purge_citizen_session(payload: ErasureRequest) -> ErasureCertificate:
    """Purge citizen session data and issue cryptographic certificate."""
    return PrivacyService.purge_citizen_session(payload)

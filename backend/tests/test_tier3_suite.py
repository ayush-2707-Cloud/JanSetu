"""Automated Pytest Suite for Tier-3 Demo & Compliance Suite (SIH26129 - Maharashtra).

Verifies:
1. Proactive Citizen WhatsApp & SMS Push Notification Simulator
2. Synthetic API Load Benchmark Multi-Threaded Generator
3. DPDP 2025 Data Portability Dossier & Right-to-be-Forgotten Erasure Certificate
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_simulate_push_notification_whatsapp():
    """Verify simulating a WhatsApp milestone notification."""
    req = {
        "utid": "UTID-MH-2026-094182",
        "channel": "WHATSAPP",
        "event_type": "MILESTONE_APPROVED",
        "recipient_name": "Ayush Singh Chauhan",
        "phone": "+91 98765-43210",
        "department": "Food Safety Authority (FSSAI)",
        "message": "Govt of Maharashtra: Your FSSAI license has been approved.",
    }
    response = client.post("/api/notifications/simulate-push", json=req)
    assert response.status_code == 200
    data = response.json()
    assert data["notification_id"].startswith("NOTIF-WH-")
    assert data["channel"] == "WHATSAPP"
    assert data["delivery_status"] == "DELIVERED"
    assert data["read_receipt"] is True


def test_simulate_push_notification_sms():
    """Verify simulating an SMS statutory warning notification."""
    req = {
        "utid": "UTID-MH-2026-094182",
        "channel": "SMS",
        "event_type": "SLA_WARNING",
        "recipient_name": "Ayush Singh Chauhan",
        "phone": "+91 98765-43210",
        "department": "Revenue Department",
    }
    response = client.post("/api/notifications/simulate-push", json=req)
    assert response.status_code == 200
    data = response.json()
    assert data["notification_id"].startswith("NOTIF-SM-")
    assert data["channel"] == "SMS"
    assert "SLA" in data["message"]


def test_get_notification_history():
    """Verify retrieving notification history for a citizen UTID."""
    response = client.get("/api/notifications/history/UTID-MH-2026-094182")
    assert response.status_code == 200
    records = response.json()
    assert isinstance(records, list)
    assert len(records) >= 1


def test_execute_benchmark_load_test():
    """Verify executing synthetic concurrent load test."""
    response = client.post("/api/dev/benchmark?count=50&concurrency=10")
    assert response.status_code == 200
    result = response.json()
    assert result["total_transactions_processed"] == 50
    assert result["concurrency_level"] == 10
    assert result["throughput_ops_per_sec"] > 0
    assert result["p95_latency_ms"] >= 0
    assert result["success_rate_percent"] == 100.0


def test_export_citizen_dossier_dpdp():
    """Verify export of portable citizen data dossier under DPDP Act 2023."""
    response = client.get("/api/privacy/export-dossier?utid=UTID-MH-2026-094182")
    assert response.status_code == 200
    dossier = response.json()
    assert dossier["utid"] == "UTID-MH-2026-094182"
    assert dossier["data_principal_name"] == "Ayush Singh Chauhan"
    assert dossier["pan_masked"] == "BKZPC****A"
    assert "TOK-UID" in dossier["aadhaar_vault_token"]
    assert len(dossier["consents_logged"]) >= 2
    assert len(dossier["cryptographic_checksum_sha256"]) == 64


def test_purge_citizen_session_erasure_certificate():
    """Verify right-to-be-forgotten erasure and signed certificate generation."""
    req = {
        "utid": "UTID-MH-2026-094182",
        "reason": "Citizen statutory deletion request under DPDP Act 2023 Section 12(3)",
    }
    response = client.post("/api/privacy/purge-session", json=req)
    assert response.status_code == 200
    cert = response.json()
    assert cert["certificate_id"].startswith("DPDP-ERASURE-")
    assert cert["utid"] == "UTID-MH-2026-094182"
    assert cert["status"] == "PERMANENTLY_PURGED_FROM_ACTIVE_REGISTRIES"
    assert len(cert["sha256_verification_hash"]) == 64

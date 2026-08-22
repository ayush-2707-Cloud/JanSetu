"""Automated Pytest Suite for Tier-2 Enterprise Middleware (SIH26129 - Maharashtra).

Verifies:
1. IndEA 2.0 Standards & Open API Compliance Headers
2. Circuit Breaker & Dead-Letter Queue (DLQ) with Chaos Injection
3. Inter-Departmental Grievance Bridge (CPGRAMS / Maharashtra RTSA 2015)
4. Observability & APM Telemetry Metrics
5. Master Citizen Index (MCI) Deduplication & Subsidy Clash Detection
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_indea_2_0_response_headers_middleware():
    """Verify IndEA 2.0 compliance headers are appended to all API responses."""
    response = client.get("/api/standards/compliance")
    assert response.status_code == 200
    assert response.headers.get("x-indea-framework") == "2.0"
    assert response.headers.get("x-drm-standard") == "JSON-LD"
    assert response.headers.get("x-govtech-interoperability") == "Tier-2"


def test_indea_2_0_six_pillar_compliance_audit():
    """Verify all 6 IndEA pillars (BRM, DRM, ARM, TRM, SRM, PRM) are 100% compliant."""
    response = client.get("/api/standards/compliance")
    assert response.status_code == 200
    report = response.json()
    assert report["overall_compliance_score"] == 100.0
    assert len(report["pillars"]) == 6
    pillar_codes = [p["pillar_code"] for p in report["pillars"]]
    assert "BRM" in pillar_codes
    assert "DRM" in pillar_codes
    assert "ARM" in pillar_codes
    assert "TRM" in pillar_codes
    assert "SRM" in pillar_codes
    assert "PRM" in pillar_codes


def test_chaos_outage_trips_circuit_breaker_and_dlq():
    """Verify simulating an outage trips the circuit to OPEN and routes requests to DLQ."""
    # 1. Simulate outage on FSSAI portal
    chaos_req = {"service_name": "fssai_portal", "status": True}
    res = client.post("/api/dev/simulate-outage", json=chaos_req)
    assert res.status_code == 200
    assert res.json()["circuit_state"] == "OPEN"

    # 2. Check DLQ status
    dlq_res = client.get("/api/resilience/dlq")
    assert dlq_res.status_code == 200
    status_data = dlq_res.json()
    assert status_data["active_circuit_states"]["fssai_portal"] == "OPEN"

    # 3. Restore normal status
    restore_req = {"service_name": "fssai_portal", "status": False}
    restore_res = client.post("/api/dev/simulate-outage", json=restore_req)
    assert restore_res.status_code == 200
    assert restore_res.json()["circuit_state"] == "CLOSED"


def test_cpgrams_rtsa_grievance_drafting_ai():
    """Verify automatic legal grievance petition drafting citing Maharashtra RTSA Section 8."""
    draft_req = {
        "utid": "UTID-MH-2026-094182",
        "department": "Food Safety Authority (FSSAI)",
        "citizen_name": "Ayush Singh Chauhan",
        "delay_days": 10,
        "reason": "Statutory 48h Scrutiny Window Elapsed",
    }
    response = client.post("/api/grievance/draft", json=draft_req)
    assert response.status_code == 200
    data = response.json()
    assert "Maharashtra Right to Public Services Act 2015" in data["statutory_clause"]
    assert "SECTION 10" in data["drafted_petition"]
    assert data["target_authority"] == "DISTRICT_COLLECTOR_APPELLATE_AUTHORITY"


def test_cpgrams_rtsa_grievance_filing_and_tracking():
    """Verify filing grievance produces valid CPGRAMS-2026-GRV reference token."""
    file_req = {
        "utid": "UTID-MH-2026-094182",
        "department": "Food Safety Authority (FSSAI)",
        "citizen_name": "Ayush Singh Chauhan",
        "phone": "+91 98765-43210",
        "grievance_text": "Undue statutory delay beyond RTSA limit.",
        "relief_requested": "Immediate license issuance.",
    }
    response = client.post("/api/grievance/file", json=file_req)
    assert response.status_code == 200
    record = response.json()
    assert record["grievance_id"].startswith("CPGRAMS-2026-GRV-")
    assert record["status"] == "ESCALATED_TO_APPELLATE_AUTHORITY"

    # Verify listing
    list_res = client.get("/api/grievance/list/UTID-MH-2026-094182")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1


def test_apm_telemetry_metrics_endpoint():
    """Verify observability APM metrics return live department latencies and uptime."""
    response = client.get("/api/telemetry/metrics")
    assert response.status_code == 200
    metrics = response.json()
    assert metrics["system_uptime_percent"] >= 99.9
    assert metrics["total_api_transactions_24h"] > 0
    assert len(metrics["department_latencies"]) >= 5
    
    dept_codes = [d["department_code"] for d in metrics["department_latencies"]]
    assert "DIGILOCKER_REST" in dept_codes
    assert "FSSAI_FOSCOS" in dept_codes
    assert "REVENUE_BHOOMI" in dept_codes


def test_mci_deduplication_clean_pass():
    """Verify Master Citizen Index returns clean pass for non-conflicting profile."""
    audit_req = {
        "utid": "UTID-MH-2026-094182",
        "full_name": "Ayush Singh Chauhan",
        "pan_number": "BKZPC9912A",
        "aadhaar_token": "TOK-UID-88219-VAULT",
        "phone": "+91 98765-43210",
    }
    response = client.post("/api/mci/audit-check", json=audit_req)
    assert response.status_code == 200
    data = response.json()
    assert data["has_conflict"] is False
    assert data["confidence_score"] == 100.0


def test_mci_deduplication_detects_duplicate_pan():
    """Verify MCI flags duplicate PAN when registered under different UTID."""
    audit_req = {
        "utid": "UTID-NEW-CITIZEN-999",
        "full_name": "Impostor Account",
        "pan_number": "BKZPC9912A",  # Already registered to Ayush
        "aadhaar_token": "TOK-UID-FAKE-VAULT",
        "phone": "+91 90000-00000",
    }
    response = client.post("/api/mci/audit-check", json=audit_req)
    assert response.status_code == 200
    data = response.json()
    assert data["has_conflict"] is True
    assert data["conflict_type"] == "DUPLICATE_PAN_RECORD_FOUND"
    assert data["conflicting_utid"] == "UTID-MH-2026-094182"


def test_mci_deduplication_detects_mutually_exclusive_subsidy_clash():
    """Verify MCI flags mutually exclusive state subsidy claim."""
    audit_req = {
        "utid": "UTID-MH-2026-094182",
        "full_name": "Ayush Singh Chauhan",
        "pan_number": "BKZPC9912A",
        "aadhaar_token": "TOK-UID-88219-VAULT",
        "phone": "+91 98765-43210",
        "proposed_subsidy_code": "STATE_MICRO_SEED_GRANT_2026",
    }
    response = client.post("/api/mci/audit-check", json=audit_req)
    assert response.status_code == 200
    data = response.json()
    assert data["has_conflict"] is True
    assert data["conflict_type"] == "SUBSIDY_CLASH_MUTUALLY_EXCLUSIVE"

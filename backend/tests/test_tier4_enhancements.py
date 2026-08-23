"""Pytest Suite for Tier-4 Problem Statement Enhancements (SIH26129).

Tests:
1. Unified Application Tracker across heterogeneous departmental portals
2. Consent-Based Data Sharing Ledger and DPDP revocation
3. Cross-Department Officer Coordination and Inter-Department handoffs
4. Exception Resolution Queue and AI fix acceptance
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_unified_application_tracker():
    """Test retrieving consolidated cross-portal citizen applications."""
    res = client.get("/api/tracker/my-applications")
    assert res.status_code == 200
    data = res.json()
    assert "applications" in data
    assert len(data["applications"]) >= 5
    assert data["total_active_applications"] >= 1
    assert data["overall_sla_compliance_rate"] >= 90.0

    # Verify origin portals span central, state, and municipal databases
    portals = [a["portal_origin"] for a in data["applications"]]
    assert any("FoSCoS" in p for p in portals)
    assert any("Municipal" in p or "Aaple Sarkar" in p for p in portals)
    assert any("Mahabhulekh" in p for p in portals)


def test_unified_application_tracker_status_filter():
    """Test filtering tracker applications by status."""
    res = client.get("/api/tracker/my-applications?status_filter=APPROVED")
    assert res.status_code == 200
    data = res.json()
    for app_item in data["applications"]:
        assert app_item["status"] == "APPROVED" or app_item["sla_status"] == "APPROVED"


def test_consent_ledger_retrieval():
    """Test retrieving citizen consent grants across departments."""
    res = client.get("/api/consent/ledger?utid=UTID-MH-2026-094182")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 4
    for c in data:
        assert c["status"] in ["ACTIVE", "REVOKED", "EXPIRED"]
        assert len(c["data_elements_shared"]) > 0
        assert "DPDP" in c["legal_basis"]


def test_consent_revocation():
    """Test revoking department consent under DPDP Act 2023 Sec 6(4)."""
    payload = {
        "consent_id": "CNS-FSSAI-094182",
        "reason": "Statutory citizen consent revocation test"
    }
    res = client.post("/api/consent/revoke", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "REVOKED"
    assert len(data["sha256_revocation_hash"]) == 64


def test_cross_department_officer_summary():
    """Test consolidated officer summary across all 5 departments."""
    res = client.get("/api/officer/coordination/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["total_statewide_applications"] > 10000
    assert len(data["department_breakdown"]) == 5
    assert len(data["inter_department_handoffs"]) >= 3
    assert data["overall_sla_compliance_rate"] >= 90.0


def test_exception_resolution_queue_and_action():
    """Test retrieving exceptions and executing officer resolution action."""
    res = client.get("/api/officer/exceptions")
    assert res.status_code == 200
    exceptions = res.json()
    assert len(exceptions) >= 3

    # Test resolving an exception by accepting AI fix
    target_id = exceptions[0]["exception_id"]
    resolve_payload = {
        "action": "ACCEPT_AI_FIX",
        "officer_notes": "Accepted AI suggested cross-registry phonetic normalization.",
        "officer_id": "OFFICER-MH-8492"
    }
    post_res = client.post(f"/api/officer/exceptions/{target_id}/resolve", json=resolve_payload)
    assert post_res.status_code == 200
    updated_exc = post_res.json()
    assert updated_exc["status"] == "AUTO_FIXED"
    assert updated_exc["resolved_by"] == "OFFICER-MH-8492"

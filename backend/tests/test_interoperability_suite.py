"""Automated Pytest Suite for Enterprise Interoperability Middleware.

Verifies:
1. Reusable Connectors catalog and bidirectional XML <-> JSON transformations.
2. Master Data Management (MDM) Golden Record aggregation & Once-Only Principle.
3. Cryptographic SHA-256 tamper-evident hash chaining and SLA compliance calculations.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_list_connectors_returns_all_5_connectors():
    """Verify that all 5 essential connectors are registered with active health."""
    response = client.get("/api/connectors/list")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
    
    connector_ids = [c["id"] for c in data]
    assert "conn-digilocker" in connector_ids
    assert "conn-bhoomi" in connector_ids
    assert "conn-mca21" in connector_ids
    assert "conn-fssai" in connector_ids
    assert "conn-gstn" in connector_ids

    bhoomi = next(c for c in data if c["id"] == "conn-bhoomi")
    assert bhoomi["protocol"] == "SOAP_XML"
    assert bhoomi["uptime_percentage"] >= 99.8


def test_connector_legacy_soap_to_canonical_json_transformation():
    """Verify Bhoomi SOAP XML envelope parses into canonical Open API 3.0 JSON."""
    soap_sample = """<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetRtcExtract xmlns="http://bhoomi.kar.nic.in/">
      <DistrictCode>18</DistrictCode>
      <TalukCode>04</TalukCode>
      <SurveyNo>142/2A</SurveyNo>
    </GetRtcExtract>
  </soap:Body>
</soap:Envelope>"""

    payload = {
        "connector_id": "conn-bhoomi",
        "direction": "LEGACY_TO_CANONICAL",
        "payload_content": soap_sample
    }
    response = client.post("/api/connectors/transform", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["direction"] == "LEGACY_TO_CANONICAL"
    assert data["schema_validation_passed"] is True
    assert data["transformation_latency_ms"] < 50.0  # Sub-50ms high-speed conversion
    assert "canonical_parcel_id" in data["transformed_content"]
    assert "LAND-KA-18-04" in data["transformed_content"]


def test_connector_batch_xml_to_canonical_json_transformation():
    """Verify MCA21 Batch XML parses into canonical company JSON."""
    xml_sample = """<CompanyDataRequest version="4.1">
  <Query>
    <CIN>U72900KA2026PTC192841</CIN>
  </Query>
</CompanyDataRequest>"""

    payload = {
        "connector_id": "conn-mca21",
        "direction": "LEGACY_TO_CANONICAL",
        "payload_content": xml_sample
    }
    response = client.post("/api/connectors/transform", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["schema_validation_passed"] is True
    assert "U72900KA2026PTC192841" in data["transformed_content"]


def test_connector_canonical_json_to_legacy_transformation():
    """Verify bidirectional transformation from Canonical JSON back to SOAP/XML."""
    payload = {
        "connector_id": "conn-bhoomi",
        "direction": "CANONICAL_TO_LEGACY",
        "payload_content": '{"parcel_id": "LAND-KA-18-04-019-142-2A"}'
    }
    response = client.post("/api/connectors/transform", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["direction"] == "CANONICAL_TO_LEGACY"
    assert "<soap:Envelope" in data["transformed_content"]


def test_mdm_golden_record_aggregates_multiple_sources():
    """Verify Master Data Management combines PAN, Aadhaar, Land, and MSME data."""
    response = client.get("/api/mdm/golden-record/CIT-2026-IND-9481")
    assert response.status_code == 200
    golden = response.json()
    
    assert golden["citizen_id"] == "CIT-2026-IND-9481"
    assert golden["full_name"] == "Vikram Sheshadri Rao"
    assert golden["pan_number"] == "BKZPC9912A"
    assert golden["deduplication_confidence"] >= 0.99
    assert len(golden["identity_attributes"]) >= 4
    assert len(golden["registered_enterprises"]) >= 1
    assert len(golden["land_parcels"]) >= 1


def test_mdm_auto_populate_once_only_principle():
    """Verify Once-Only Principle auto-populates 4 department forms with 0 manual typing."""
    payload = {
        "citizen_id": "CIT-2026-IND-9481",
        "target_departments": ["MSME_UDYAM", "FSSAI_FOSCOS", "MUNICIPAL_TRADE_LICENSE", "POLLUTION_CONTROL_NOC"]
    }
    response = client.post("/api/mdm/auto-populate", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert data["once_only_principle_applied"] is True
    assert data["total_eliminated_fields"] >= 30
    assert data["total_time_saved_minutes"] >= 60
    assert len(data["department_forms"]) == 4

    fssai_form = next(f for f in data["department_forms"] if f["department_code"] == "FSSAI_FOSCOS")
    assert fssai_form["pre_filled_fields"]["food_business_operator"] == "Vikram Sheshadri Rao"
    assert fssai_form["pre_filled_fields"]["pan_reference"] == "BKZPC9912A"


def test_cryptographic_audit_ledger_hash_chain_integrity():
    """Verify SHA-256 cryptographic chaining across all sequential lifecycle events."""
    response = client.get("/api/audit/ledger/APP-2026-MSME-0841")
    assert response.status_code == 200
    data = response.json()
    
    assert data["utid"] == "APP-2026-MSME-0841"
    assert data["is_ledger_tamper_free"] is True
    assert data["total_events"] == 6

    events = data["events"]
    assert events[0]["previous_hash"] == "0000000000000000000000000000000000000000000000000000000000000000"
    
    # Check that event N previous_hash == event N-1 current_hash
    for i in range(1, len(events)):
        assert events[i]["previous_hash"] == events[i - 1]["current_hash"], (
            f"Broken SHA-256 hash chain at event index {i}!"
        )


def test_sla_metrics_calculation_and_turnaround_reduction():
    """Verify Right to Public Services Act SLA compliance and turnaround compression."""
    response = client.get("/api/audit/sla-metrics")
    assert response.status_code == 200
    data = response.json()
    
    assert data["overall_sla_compliance_pct"] >= 90.0
    assert data["total_turnaround_reduction_pct"] > 70.0  # >70% compression
    assert len(data["department_metrics"]) >= 5
    
    fssai_sla = next(m for m in data["department_metrics"] if "FSSAI" in m["department"])
    assert fssai_sla["statutory_sla_days"] == 14
    assert fssai_sla["actual_average_days"] < 14
    assert "FSS Act 2006" in fssai_sla["right_to_services_act_clause"]


def test_api_v1_versioned_interoperability_routes():
    """Verify that all interoperability endpoints are accessible under versioned /api/v1/ prefix."""
    res1 = client.get("/api/v1/connectors/list")
    assert res1.status_code == 200

    res2 = client.get("/api/v1/mdm/golden-record/CIT-2026-IND-9481")
    assert res2.status_code == 200

    res3 = client.get("/api/v1/audit/ledger/APP-2026-MSME-0841")
    assert res3.status_code == 200

    res4 = client.get("/api/v1/audit/sla-metrics")
    assert res4.status_code == 200

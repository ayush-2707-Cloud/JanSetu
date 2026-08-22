"""Unit tests for Statutory Stamp Duty and SMS/WhatsApp Dispatch Routers."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_stamp_duty_schedules():
    """Test retrieving full state stamp duty schedules catalog."""
    res = client.get("/api/legal/stamp-duty/schedules")
    assert res.status_code == 200
    data = res.json()
    assert "KA" in data
    assert "MH" in data
    assert "DL" in data
    assert "Karnataka Stamp Act" in data["KA"]["governing_act"]

def test_calculate_stamp_duty_karnataka():
    """Test calculation for Karnataka commercial lease agreement."""
    payload = {
        "state_code": "KA",
        "article_type": "RENT_AGREEMENT_COMMERCIAL",
        "monthly_rent_inr": 30000.0,
        "lease_term_months": 11,
        "refundable_deposit_inr": 100000.0,
    }
    res = client.post("/api/legal/stamp-duty/calculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["state_code"] == "KA"
    assert data["calculated_stamp_duty_inr"] > 0
    assert data["registration_fee_inr"] > 0
    assert data["total_statutory_cost_inr"] == data["calculated_stamp_duty_inr"] + data["registration_fee_inr"]
    assert "kaverionline" in data["official_estamp_portal"]

def test_calculate_stamp_duty_maharashtra_partnership():
    """Test calculation for Maharashtra partnership firm deed."""
    payload = {
        "state_code": "MH",
        "article_type": "PARTNERSHIP_DEED",
        "capital_contribution_inr": 200000.0,
    }
    res = client.post("/api/legal/stamp-duty/calculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["state_code"] == "MH"
    assert data["calculated_stamp_duty_inr"] == 500.0
    assert "igrmaharashtra" in data["official_estamp_portal"]

def test_simulate_whatsapp_notification_dispatch():
    """Test WhatsApp statutory notification dispatch simulation."""
    payload = {
        "channel": "WHATSAPP",
        "recipient_mobile": "+919876543210",
        "journey_title": "Karnataka Cloud Kitchen Setup",
        "step_title": "FSSAI State License Verification",
        "language": "en",
    }
    res = client.post("/api/notifications/simulate-dispatch", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["channel"] == "WHATSAPP"
    assert data["status"] == "DELIVERED_TO_GATEWAY"
    assert "JanSetu" in data["rendered_message_text"]
    assert data["dispatch_id"].startswith("CDAC-")

def test_simulate_sms_notification_dispatch_hindi():
    """Test SMS gateway notification dispatch simulation in Hindi."""
    payload = {
        "channel": "SMS",
        "recipient_mobile": "+919123456789",
        "journey_title": "पीएम विद्यालक्ष्मी शिक्षा ऋण",
        "step_title": "दस्तावेज़ सत्यापन",
        "language": "hi",
    }
    res = client.post("/api/notifications/simulate-dispatch", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["channel"] == "SMS"
    assert "e-Pramaan" in data["gateway_reference"]

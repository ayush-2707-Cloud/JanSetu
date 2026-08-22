"""
Unit & Integration Tests for Unified Authentication, Role Separation & Recovery.
Tests Citizen Login/Registration, Officer Login, Portal Validation, and Forgot Password.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_citizen_login_success_with_username():
    """Verify citizen login with username."""
    payload = {
        "identifier": "anand_kumar",
        "password": "JanSetu@2026",
        "portal_type": "CITIZEN"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["role"] == "CITIZEN_ROLE"
    assert data["redirect_url"] == "/"
    assert "access_token" in data


def test_citizen_login_success_with_email():
    """Verify citizen login with email."""
    payload = {
        "identifier": "anand.kumar@citizen.gov.in",
        "password": "JanSetu@2026",
        "portal_type": "CITIZEN"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["username"] == "anand_kumar"


def test_officer_login_success():
    """Verify department officer login with Officer ID."""
    payload = {
        "identifier": "OFFICER-KA-9942",
        "password": "Officer@2026",
        "portal_type": "OFFICER"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["role"] == "OFFICER_ROLE"
    assert data["redirect_url"] == "/officer"


def test_citizen_blocked_from_officer_portal():
    """Verify citizen credentials cannot access the officer portal."""
    payload = {
        "identifier": "anand_kumar",
        "password": "JanSetu@2026",
        "portal_type": "OFFICER"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 403
    assert "Access Denied" in response.json()["detail"]


def test_officer_blocked_from_citizen_portal():
    """Verify officer credentials cannot access citizen portal directly without proper role."""
    payload = {
        "identifier": "OFFICER-KA-9942",
        "password": "Officer@2026",
        "portal_type": "CITIZEN"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 403
    assert "Access Denied" in response.json()["detail"]


def test_invalid_password_returns_401():
    """Verify incorrect password returns 401 Unauthorized."""
    payload = {
        "identifier": "anand_kumar",
        "password": "WrongPassword!2026",
        "portal_type": "CITIZEN"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["detail"]


def test_unknown_user_returns_401():
    """Verify non-existent user returns 401."""
    payload = {
        "identifier": "nonexistent_citizen_9999",
        "password": "AnyPassword",
        "portal_type": "CITIZEN"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 401


def test_citizen_registration_flow():
    """Verify citizen registration creates new user with CITIZEN_ROLE."""
    username = f"citizen_new_{pytest.__version__.replace('.', '')[:4]}"
    payload = {
        "full_name": "Vikramaditya Sharma",
        "username": username,
        "email": f"{username}@testmail.gov.in",
        "phone": "+91 91234 56789",
        "password": "SecurePassword@2026",
        "aadhaar_number": "1234-5678-9012",
        "state": "Maharashtra",
        "district": "Pune"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["username"] == username
    assert data["user"]["role"] == "CITIZEN_ROLE"
    assert data["user"]["aadhaar_masked"] == "XXXX-XXXX-9012"
    assert data["redirect_url"] == "/"


def test_forgot_password_flow():
    """Verify forgot password OTP dispatch response."""
    payload = {
        "identifier": "anand_kumar",
        "portal_type": "CITIZEN"
    }
    response = client.post("/api/auth/forgot-password", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "otp_reference_id" in data
    assert "dispatched" in data["message"].lower()


def test_forgot_password_nonexistent_user_returns_404():
    """Verify forgot password for invalid user returns 404."""
    payload = {
        "identifier": "random_ghost_identity_000",
        "portal_type": "CITIZEN"
    }
    response = client.post("/api/auth/forgot-password", json=payload)
    assert response.status_code == 404

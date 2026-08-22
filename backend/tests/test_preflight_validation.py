"""Comprehensive automated tests for GovTech Pre-Flight Validation and AI Exception Handling."""

import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.preflight import (
    PreflightValidationRequest,
    UploadedDocument,
    ValidationSeverity,
    IssueCategory,
    ExceptionResolutionRequest,
)
from app.engine.preflight_engine import (
    calculate_name_similarity,
    validate_expiry_date,
    run_preflight_validation,
)
from app.ai.preflight_ai import resolve_discrepancy_with_gemini

client = TestClient(app)


def test_fuzzy_name_similarity_exact_and_variations():
    # Exact match
    score, is_alias = calculate_name_similarity("Ayush Singh Chauhan", "Ayush Singh Chauhan")
    assert score == 1.0
    assert is_alias is False

    # Honorifics stripping & case insensitivity
    score, is_alias = calculate_name_similarity("Mr. Ayush Singh Chauhan", "AYUSH SINGH CHAUHAN")
    assert score == 1.0

    # Initial expansion (Recognized Alias)
    score, is_alias = calculate_name_similarity("Ayush Singh Chauhan", "Ayush S. Chauhan")
    assert score >= 0.80
    assert is_alias is True

    # Multi-initial abbreviation
    score, is_alias = calculate_name_similarity("Vikram Sheshadri Rao", "V. S. Rao")
    assert score >= 0.75
    assert is_alias is True

    # Completely different name
    score, is_alias = calculate_name_similarity("Ramesh Kumar", "Suresh Verma")
    assert score < 0.40
    assert is_alias is False


def test_expiry_date_validation_guardrails():
    today = date.today()

    # Expired in past
    expired_str = (today - timedelta(days=10)).strftime("%Y-%m-%d")
    sev, reason = validate_expiry_date(expired_str)
    assert sev == ValidationSeverity.BLOCKED
    assert "expired on" in reason.lower()

    # Expiring within 30 days
    soon_str = (today + timedelta(days=15)).strftime("%Y-%m-%d")
    sev, reason = validate_expiry_date(soon_str)
    assert sev == ValidationSeverity.WARNING
    assert "expires in" in reason.lower()

    # Expiring within 60 days
    sixty_str = (today + timedelta(days=45)).strftime("%Y-%m-%d")
    sev, reason = validate_expiry_date(sixty_str)
    assert sev == ValidationSeverity.WARNING

    # Valid far in future
    future_str = (today + timedelta(days=400)).strftime("%Y-%m-%d")
    sev, reason = validate_expiry_date(future_str)
    assert sev == ValidationSeverity.PASSED


def test_preflight_clean_pass():
    req = PreflightValidationRequest(
        applicant_name="Vikram Sheshadri Rao",
        applicant_pan="ABCDE1234F",
        applicant_aadhaar_last4="8842",
        applicant_pin="560001",
        uploaded_documents=[
            UploadedDocument(
                id="doc-pan",
                doc_type="PAN_CARD",
                file_name="pan.pdf",
                extracted_name="Vikram Sheshadri Rao",
                ocr_confidence=0.98,
                resolution_dpi=300,
                digilocker_verified=True,
            ),
            UploadedDocument(
                id="doc-rent",
                doc_type="RENT_AGREEMENT",
                file_name="rent.pdf",
                extracted_name="Vikram Sheshadri Rao",
                expiry_date=(date.today() + timedelta(days=365)).strftime("%Y-%m-%d"),
                ocr_confidence=0.95,
                resolution_dpi=300,
            ),
        ],
    )

    res = run_preflight_validation(req)
    assert res.overall_status == ValidationSeverity.PASSED
    assert res.metrics.quality_score >= 95
    assert res.blocked_checks_count == 0
    assert res.warning_checks_count == 0
    assert len(res.issues) == 0


def test_preflight_name_mismatch_warning_and_autofix():
    req = PreflightValidationRequest(
        applicant_name="Ayush Singh Chauhan",
        applicant_pan="BKZPC9912A",
        applicant_pin="400001",
        uploaded_documents=[
            UploadedDocument(
                id="doc-pan",
                doc_type="PAN_CARD",
                file_name="pan.jpg",
                extracted_name="A. S. Chauhan",
                ocr_confidence=0.94,
            )
        ],
    )

    res = run_preflight_validation(req)
    assert res.overall_status == ValidationSeverity.WARNING
    assert res.warning_checks_count >= 1
    assert res.blocked_checks_count == 0

    mismatch_issue = next((i for i in res.issues if i.category == IssueCategory.NAME_MISMATCH), None)
    assert mismatch_issue is not None
    assert mismatch_issue.severity == ValidationSeverity.WARNING
    assert mismatch_issue.autofix_available is True
    assert mismatch_issue.autofix_action == "SYNC_NAME_TO_AADHAAR"
    assert mismatch_issue.discrepancy.is_recognized_alias is True


def test_preflight_severe_name_mismatch_blocked():
    req = PreflightValidationRequest(
        applicant_name="Ayush Chauhan",
        applicant_pan="BKZPC9912A",
        uploaded_documents=[
            UploadedDocument(
                id="doc-pan",
                doc_type="PAN_CARD",
                file_name="pan.jpg",
                extracted_name="Pooja Sharma",
                ocr_confidence=0.94,
            )
        ],
    )

    res = run_preflight_validation(req)
    assert res.overall_status == ValidationSeverity.BLOCKED
    assert res.blocked_checks_count >= 1
    assert any(i.severity == ValidationSeverity.BLOCKED and i.category == IssueCategory.NAME_MISMATCH for i in res.issues)


def test_preflight_expired_doc_and_low_ocr_blocked():
    req = PreflightValidationRequest(
        applicant_name="Pooja Sharma",
        applicant_pan="POOJA9912B",
        applicant_pin="411001",
        uploaded_documents=[
            UploadedDocument(
                id="doc-lease",
                doc_type="RENT_AGREEMENT",
                file_name="lease.pdf",
                extracted_name="Pooja Sharma",
                expiry_date="2024-01-01",
                ocr_confidence=0.62,
            )
        ],
    )

    res = run_preflight_validation(req)
    assert res.overall_status == ValidationSeverity.BLOCKED
    assert res.blocked_checks_count >= 1
    assert res.metrics.validity_guardrail_passed is False


def test_preflight_invalid_pan_and_pin_schema():
    req = PreflightValidationRequest(
        applicant_name="Vikram Rao",
        applicant_pan="INVALID_PAN_123",  # Malformed
        applicant_pin="000123",  # Invalid (leading 0)
    )

    res = run_preflight_validation(req)
    assert res.overall_status == ValidationSeverity.BLOCKED
    pan_issue = next((i for i in res.issues if i.id == "pan-format-invalid"), None)
    pin_issue = next((i for i in res.issues if i.id == "pin-code-invalid"), None)
    assert pan_issue is not None
    assert pin_issue is not None


def test_ai_exception_resolution_handler():
    req = ExceptionResolutionRequest(
        issue_id="name-mismatch-doc-pan",
        field_a_name="Form Applicant Name",
        field_a_value="Ayush Singh Chauhan",
        field_b_name="PAN Card Name",
        field_b_value="A. S. Chauhan",
        portal_target="FSSAI FoSCoS Portal",
    )

    res = resolve_discrepancy_with_gemini(req)
    assert res.issue_id == "name-mismatch-doc-pan"
    assert res.rejection_risk in ["HIGH", "MEDIUM", "LOW"]
    assert len(res.plain_language_explanation) > 20
    assert len(res.exact_1step_corrective_action) > 10
    assert res.affidavit_template_snippet is not None
    assert res.recognized_as_alias is True


def test_fastapi_preflight_and_exception_endpoints():
    # 1. Test POST /api/validate/preflight
    payload = {
        "applicant_name": "Ayush Singh Chauhan",
        "applicant_pan": "BKZPC9912A",
        "applicant_pin": "400001",
        "uploaded_documents": [
            {
                "id": "doc-01",
                "doc_type": "PAN_CARD",
                "file_name": "pan.jpg",
                "extracted_name": "A. S. Chauhan",
                "ocr_confidence": 0.94,
            }
        ]
    }
    resp = client.post("/api/validate/preflight", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "overall_status" in data
    assert "metrics" in data
    assert data["metrics"]["quality_score"] > 0
    assert len(data["issues"]) >= 1

    # 2. Test POST /api/validate/resolve-exception
    resolve_payload = {
        "issue_id": "test-issue-1",
        "field_a_name": "PAN Name",
        "field_a_value": "A. S. Chauhan",
        "field_b_name": "Aadhaar Name",
        "field_b_value": "Ayush Singh Chauhan",
        "doc_type": "PAN_CARD",
        "portal_target": "CBDT / MSME",
    }
    resp_ai = client.post("/api/validate/resolve-exception", json=resolve_payload)
    assert resp_ai.status_code == 200
    ai_data = resp_ai.json()
    assert ai_data["issue_id"] == "test-issue-1"
    assert "plain_language_explanation" in ai_data
    assert "exact_1step_corrective_action" in ai_data

    # 3. Test GET /api/validate/demo-cases
    resp_demo = client.get("/api/validate/demo-cases")
    assert resp_demo.status_code == 200
    demo_data = resp_demo.json()
    assert "clean_pass" in demo_data
    assert "name_mismatch_warning" in demo_data
    assert "expired_blocker" in demo_data

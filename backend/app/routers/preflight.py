"""FastAPI Router for GovTech Pre-Flight Validation & AI Exception Handling."""

from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List
from app.schemas.preflight import (
    PreflightValidationRequest,
    PreflightValidationResponse,
    ExceptionResolutionRequest,
    ExceptionResolutionResponse,
    UploadedDocument,
)
from app.engine.preflight_engine import run_preflight_validation
from app.ai.preflight_ai import resolve_discrepancy_with_gemini

router = APIRouter(
    prefix="/validate",
    tags=["GovTech Pre-Flight Validation & AI Exception Engine"]
)


@router.post(
    "/preflight",
    response_model=PreflightValidationResponse,
    summary="Run Statutory Pre-Flight Quality Gate",
    description=(
        "Performs deterministic multi-point validation (fuzzy name similarity, expiry verification, "
        "statutory regex schema checks, OCR confidence evaluation) and enriches discrepancies with AI guidance."
    )
)
async def api_run_preflight(payload: PreflightValidationRequest) -> PreflightValidationResponse:
    """Execute complete GovTech pre-flight validation pipeline."""
    try:
        return run_preflight_validation(payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Pre-flight validation failed: {str(e)}"
        )


@router.post(
    "/resolve-exception",
    response_model=ExceptionResolutionResponse,
    summary="AI Discrepancy & Exception Resolver",
    description="Analyzes specific field discrepancies using Gemini 2.5 Flash and returns plain-language rejection reasons and 1-step corrective actions."
)
async def api_resolve_exception(payload: ExceptionResolutionRequest) -> ExceptionResolutionResponse:
    """Generate Gemini AI exception resolution analysis for a flagged discrepancy."""
    try:
        return resolve_discrepancy_with_gemini(payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Exception resolution failed: {str(e)}"
        )


@router.get(
    "/demo-cases",
    summary="Get Pre-Configured Demo Test Cases for UI Testing",
    description="Returns pre-seeded test payloads representing Clean Pass, Name Discrepancy Warning, and Expired Document Blocker."
)
async def api_get_demo_cases() -> Dict[str, Any]:
    """Provide realistic sample payloads for interactive demonstration."""
    return {
        "clean_pass": {
            "title": "Clean Pass: MSME Food Business (100% Quality Score)",
            "description": "All credentials match DigiLocker e-KYC perfectly with valid unexpired documents.",
            "request": {
                "journey_id": "msme-cloud-kitchen",
                "step_id": "fssai-state-license",
                "applicant_name": "Vikram Sheshadri Rao",
                "applicant_pan": "ABCDE1234F",
                "applicant_aadhaar_last4": "8842",
                "applicant_dob": "1992-07-14",
                "applicant_pin": "560001",
                "applicant_phone": "9876543210",
                "form_data": {
                    "enterprise_name": "Rao Culinary Labs Pvt Ltd",
                    "gstin": "29ABCDE1234F1Z5",
                    "fssai_license_number": "11223344556677"
                },
                "uploaded_documents": [
                    {
                        "id": "doc-pan-01",
                        "doc_type": "PAN_CARD",
                        "file_name": "ePAN_Vikram_Rao.pdf",
                        "file_size_kb": 320.0,
                        "extracted_name": "Vikram Sheshadri Rao",
                        "extracted_identifier": "ABCDE1234F",
                        "ocr_confidence": 0.98,
                        "resolution_dpi": 300,
                        "digilocker_verified": True
                    },
                    {
                        "id": "doc-aadhaar-02",
                        "doc_type": "AADHAAR_CARD",
                        "file_name": "DigiLocker_Aadhaar_Masked.pdf",
                        "file_size_kb": 410.0,
                        "extracted_name": "Vikram Sheshadri Rao",
                        "extracted_identifier": "8842",
                        "ocr_confidence": 0.99,
                        "resolution_dpi": 300,
                        "digilocker_verified": True
                    },
                    {
                        "id": "doc-rent-03",
                        "doc_type": "RENT_AGREEMENT",
                        "file_name": "Commercial_Lease_Agreement_2026.pdf",
                        "file_size_kb": 1250.0,
                        "extracted_name": "Vikram Sheshadri Rao",
                        "expiry_date": "2027-12-31",
                        "ocr_confidence": 0.94,
                        "resolution_dpi": 300,
                        "digilocker_verified": False
                    }
                ]
            }
        },
        "name_mismatch_warning": {
            "title": "Amber Warning: Initial Expansion Discrepancy (82% Match)",
            "description": "Applicant entered expanded name while PAN contains initials. Flagged with 1-click Auto-Fix.",
            "request": {
                "journey_id": "msme-cloud-kitchen",
                "step_id": "pan-verification",
                "applicant_name": "Ayush Singh Chauhan",
                "applicant_pan": "BKZPC9912A",
                "applicant_aadhaar_last4": "4491",
                "applicant_pin": "400001",
                "form_data": {
                    "enterprise_name": "Chauhan Enterprises"
                },
                "uploaded_documents": [
                    {
                        "id": "doc-pan-mismatch",
                        "doc_type": "PAN_CARD",
                        "file_name": "PAN_Card_Scan.jpg",
                        "file_size_kb": 280.0,
                        "extracted_name": "A. S. Chauhan",
                        "extracted_identifier": "BKZPC9912A",
                        "ocr_confidence": 0.94,
                        "resolution_dpi": 300,
                        "digilocker_verified": True
                    },
                    {
                        "id": "doc-aadhaar-match",
                        "doc_type": "AADHAAR_CARD",
                        "file_name": "Aadhaar_DigiLocker.pdf",
                        "file_size_kb": 350.0,
                        "extracted_name": "Ayush Singh Chauhan",
                        "extracted_identifier": "4491",
                        "ocr_confidence": 0.97,
                        "resolution_dpi": 300,
                        "digilocker_verified": True
                    }
                ]
            }
        },
        "expired_blocker": {
            "title": "Red Blocker: Expired Rent Agreement & Low Resolution Scan",
            "description": "Commercial rent agreement has expired and scan resolution is sub-optimal. Submission blocked.",
            "request": {
                "journey_id": "msme-cloud-kitchen",
                "step_id": "premises-noc",
                "applicant_name": "Pooja Sharma",
                "applicant_pan": "POOJA9912B",
                "applicant_pin": "411001",
                "uploaded_documents": [
                    {
                        "id": "doc-expired-lease",
                        "doc_type": "RENT_AGREEMENT",
                        "file_name": "Old_Rent_Agreement_2023.pdf",
                        "file_size_kb": 45.0,
                        "extracted_name": "Pooja Sharma",
                        "expiry_date": "2024-06-30",
                        "ocr_confidence": 0.68,
                        "resolution_dpi": 120,
                        "digilocker_verified": False
                    }
                ]
            }
        }
    }

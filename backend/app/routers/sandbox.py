"""
Mock DigiLocker & API Setu Sandbox Router.
Implements simulated OAuth2 token exchange and verifiable document fetch endpoints
mirroring official National Data Governance / API Setu requester specifications.
"""

import hashlib
import time
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from app.schemas.sandbox import (
    DocumentType,
    TokenRequest,
    TokenResponse,
    DocumentFetchRequest,
    VerifiedDocumentResponse,
    DigitalSignatureMetadata
)

router = APIRouter(prefix="/api/sandbox/apisetu", tags=["Mock DigiLocker & API Setu Sandbox"])


@router.post("/oauth/token", response_model=TokenResponse)
@router.post("/token", response_model=TokenResponse)
def generate_apisetu_token(payload: TokenRequest):
    """
    Simulate API Setu / DigiLocker Citizen Consent OAuth2 Token Endpoint.
    Returns simulated Bearer access token valid for 3600 seconds.
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    raw_token_data = f"{payload.client_id}:{now_iso}:{payload.consent_artifact_id or 'DPDP-CONSENT-DIRECT'}"
    token_hash = hashlib.sha256(raw_token_data.encode()).hexdigest()

    return TokenResponse(
        access_token=f"apisetu_live_sim_{token_hash[:32]}",
        token_type="Bearer",
        expires_in=3600,
        scope="read:verified_credentials",
        consent_timestamp=now_iso
    )


@router.post("/fetch-document", response_model=VerifiedDocumentResponse)
def fetch_verified_document(payload: DocumentFetchRequest):
    """
    Simulate API Setu Verifiable Document Pull Gateway.
    Generates a cryptographically simulated, signed digital document payload (PKCS#7 / SHA-256)
    for Aadhaar, PAN, Marksheet, Degree, Udyam, Income, and Police Clearances.
    """
    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()
    doc_id_clean = payload.doc_id.strip().upper()

    doc_meta_map = {
        DocumentType.PAN_CARD: {
            "uri_prefix": "in.gov.pan",
            "issuer": "Income Tax Department, Government of India (Protean/NSDL)",
            "authority_code": "ITD-ND-01",
            "cert_serial": "8F92A13D45C2",
            "ca": "CCA India - NSDL Class 3 Document Signer CA 2024",
            "attrs": {
                "pan_number": doc_id_clean,
                "pan_holder_status": "Individual",
                "aadhaar_seeding_status": "SEEDED_AND_ACTIVE",
                "category": "General",
                "jurisdiction_ao_code": "KAR-BNG-WARD-3(1)"
            }
        },
        DocumentType.AADHAAR: {
            "uri_prefix": "in.gov.uidai",
            "issuer": "Unique Identification Authority of India (UIDAI)",
            "authority_code": "UIDAI-DELHI-HQ",
            "cert_serial": "7C118B99A04F",
            "ca": "CCA India - UIDAI Sub-CA for Offline Verification",
            "attrs": {
                "masked_aadhaar": f"XXXX-XXXX-{doc_id_clean[-4:] if len(doc_id_clean) >= 4 else '9012'}",
                "ekyc_auth_type": "OTP_BASED_CONSENT",
                "state": "Karnataka",
                "pincode": "560001",
                "gender": "Male"
            }
        },
        DocumentType.MARKSHEET_10: {
            "uri_prefix": "in.gov.cbse.10",
            "issuer": "Central Board of Secondary Education (CBSE) / NAD",
            "authority_code": "CBSE-HQ-EXAM",
            "cert_serial": "4B83C01E921A",
            "ca": "CCA India - National Academic Depository (DigiLocker CA)",
            "attrs": {
                "roll_number": doc_id_clean,
                "passing_year": 2022,
                "grade": "A1",
                "percentage": "92.4%",
                "result": "PASS",
                "school_code": "CBSE-83021"
            }
        },
        DocumentType.MARKSHEET_12: {
            "uri_prefix": "in.gov.cbse.12",
            "issuer": "Central Board of Secondary Education (CBSE) / NAD",
            "authority_code": "CBSE-HQ-EXAM",
            "cert_serial": "4B83C01E921B",
            "ca": "CCA India - National Academic Depository (DigiLocker CA)",
            "attrs": {
                "roll_number": doc_id_clean,
                "passing_year": 2024,
                "stream": "Science / PCM",
                "percentage": "89.6%",
                "result": "PASS",
                "eligibility_for_higher_education": "YES"
            }
        },
        DocumentType.DEGREE_CERTIFICATE: {
            "uri_prefix": "in.gov.nad.degree",
            "issuer": "National Academic Depository (NAD) & State University Registrar",
            "authority_code": "UGC-AIU-UNIV-01",
            "cert_serial": "9D23E412A55B",
            "ca": "CCA India - Ministry of Education NAD Digital Attestation CA",
            "attrs": {
                "degree_title": "Bachelor of Technology (Computer Science & Engineering)",
                "enrollment_number": doc_id_clean,
                "cgpa": "8.75 / 10.0",
                "division": "First Class with Distinction",
                "year_of_passing": 2025
            }
        },
        DocumentType.INCOME_CERTIFICATE: {
            "uri_prefix": "in.gov.revenue.income",
            "issuer": "Revenue Department, Tahsildar Office (e-District Portal)",
            "authority_code": "REV-KA-BNG-01",
            "cert_serial": "3A19F870C12D",
            "ca": "CCA India - State Government e-District Signing Authority",
            "attrs": {
                "certificate_number": doc_id_clean,
                "assessed_annual_income": "₹3,50,000",
                "income_category": "Economically Weaker Section (EWS) / Non-Creamy Layer",
                "validity_years": 3,
                "issuing_tahsildar_officer": "Tahsildar, Bangalore Urban Sub-Division"
            }
        },
        DocumentType.UDYAM_CERTIFICATE: {
            "uri_prefix": "in.gov.msme.udyam",
            "issuer": "Ministry of Micro, Small and Medium Enterprises (MSME)",
            "authority_code": "MSME-UDYAM-DELHI",
            "cert_serial": "1F88B339D002",
            "ca": "CCA India - National MSME Portal Digital Signer CA",
            "attrs": {
                "udyam_registration_number": doc_id_clean,
                "enterprise_type": "Micro",
                "major_activity": "Services & Food Operations",
                "nic_5_digit_code": "56102 (Restaurants and Mobile Food Service Activities)",
                "date_of_incorporation": "2026-01-15"
            }
        },
        DocumentType.POLICE_CLEARANCE: {
            "uri_prefix": "in.gov.passport.pcc",
            "issuer": "Passport Seva Kendra & State Police Commissionerate",
            "authority_code": "MEA-PCC-SZ-01",
            "cert_serial": "6E44A12F998C",
            "ca": "CCA India - Ministry of External Affairs Digital Signature CA",
            "attrs": {
                "pcc_reference_no": doc_id_clean,
                "criminal_antecedents": "CLEAR - NO ADVERSE RECORD FOUND",
                "verification_status": "SATISFACTORY",
                "validity_duration": "6 Months"
            }
        },
        DocumentType.DPIIT_CERTIFICATE: {
            "uri_prefix": "in.gov.startupindia.dpiit",
            "issuer": "Department for Promotion of Industry and Internal Trade (DPIIT)",
            "authority_code": "DPIIT-COMMERCE-HQ",
            "cert_serial": "2A55C890E111",
            "ca": "CCA India - Startup India Digital Certification CA",
            "attrs": {
                "dipp_recognition_number": doc_id_clean,
                "eligible_under_section": "Section 80-IAC & Section 56(2)(viib)",
                "industry_sector": "IT Services / GovTech",
                "validity": "10 Years from Date of Incorporation"
            }
        }
    }

    meta = doc_meta_map.get(payload.doc_type, {
        "uri_prefix": "in.gov.generic",
        "issuer": "Government of India Statutory Authority",
        "authority_code": "GOI-STATUTORY-01",
        "cert_serial": "0A0A0A0A0A0A",
        "ca": "CCA India Class 3 CA",
        "attrs": {"document_identifier": doc_id_clean}
    })

    # Generate synthetic digital signature digest
    signature_raw = f"{payload.doc_type}:{doc_id_clean}:{payload.full_name or 'Citizen'}:{now_iso}:{meta['authority_code']}"
    sig_digest = hashlib.sha256(signature_raw.encode()).hexdigest()
    doc_hash = hashlib.sha256(f"{meta['uri_prefix']}/{doc_id_clean}".encode()).hexdigest()

    digital_sig = DigitalSignatureMetadata(
        algorithm="SHA256withRSA-PKCS#7",
        # pyrefly: ignore [bad-argument-type]
        cert_serial_number=meta["cert_serial"],
        # pyrefly: ignore [bad-argument-type]
        issuer_ca=meta["ca"],
        signature_timestamp=now_iso,
        signature_digest=f"0x{sig_digest}",
        is_revoked=False,
        validity_period=f"{now.year}-01-01 to {now.year + 3}-12-31"
    )

    citizen_name = payload.full_name if payload.full_name else "AARAV SHARMA"

    return VerifiedDocumentResponse(
        status="VERIFIED",
        doc_type=payload.doc_type,
        doc_id=doc_id_clean,
        digilocker_uri=f"{meta['uri_prefix']}/{doc_id_clean}",
        citizen_name=citizen_name,
        # pyrefly: ignore [bad-argument-type]
        issuing_authority=meta["issuer"],
        issuance_date=now.strftime("%Y-%m-%d"),
        # pyrefly: ignore [bad-argument-type]
        attributes=meta["attrs"],
        digital_signature=digital_sig,
        verification_hash=f"SHA256:{doc_hash[:40]}"
    )

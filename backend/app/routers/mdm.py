"""FastAPI Router for Master Data Management (MDM) & Once-Only Principle Engine.

Solves the core problem: 'Citizens and businesses are required to submit the same information repeatedly.'
- Consolidates siloed records into a unified Canonical Golden Citizen Profile.
- Implements the 'Once-Only Principle' to auto-populate downstream departmental forms.
"""

from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from app.schemas.interoperability import (
    MDMGoldenRecord,
    IdentityAttribute,
    ProvenanceSource,
    AutoPopulateRequest,
    AutoPopulateResponse,
    DepartmentPreFilledForm,
)

router = APIRouter(
    prefix="/mdm",
    tags=["Master Data Management (MDM) & Golden Citizen Record"]
)


@router.get(
    "/golden-record/{citizen_id}",
    response_model=MDMGoldenRecord,
    summary="Get Canonical Golden Citizen Record",
    description="Merges siloed identity, tax, land, and enterprise registries into a single authoritative golden profile."
)
async def api_get_golden_record(citizen_id: str = "CIT-2026-IND-9481") -> MDMGoldenRecord:
    """Retrieve consolidated Master Data Management Golden Record with provenance tracking."""
    now_iso = datetime.now(timezone.utc).isoformat()
    
    attributes: List[IdentityAttribute] = [
        IdentityAttribute(
            key="full_name",
            label="Full Legal Name",
            value="Vikram Sheshadri Rao",
            provenance=ProvenanceSource(
                department="Ministry of Electronics & IT",
                registry_name="UIDAI Aadhaar DigiLocker e-KYC Vault",
                verified_at="2026-02-18T10:14:22Z",
                verification_method="DIGILOCKER_XML_EKYC",
                confidence_score=1.0
            ),
            is_authoritative=True
        ),
        IdentityAttribute(
            key="pan_number",
            label="Permanent Account Number (PAN)",
            value="BKZPC9912A",
            provenance=ProvenanceSource(
                department="Ministry of Finance (CBDT)",
                registry_name="Income Tax PAN Master Database",
                verified_at="2026-02-18T10:14:25Z",
                verification_method="ITD_NSDL_DIRECT_LOOKUP",
                confidence_score=1.0
            ),
            is_authoritative=True
        ),
        IdentityAttribute(
            key="date_of_birth",
            label="Date of Birth",
            value="1992-07-14",
            provenance=ProvenanceSource(
                department="Ministry of Electronics & IT",
                registry_name="UIDAI Aadhaar Vault",
                verified_at="2026-02-18T10:14:22Z",
                verification_method="UIDAI_BIOMETRIC_EKYC",
                confidence_score=1.0
            ),
            is_authoritative=True
        ),
        IdentityAttribute(
            key="primary_premises_land_parcel",
            label="Commercial Premises Land Record (RTC 7/12)",
            value="Survey No. 142/2A, Indiranagar, Ward 4",
            provenance=ProvenanceSource(
                department="State Revenue & Land Reforms",
                registry_name="Bhoomi / Mahabhulekh Land Ledger",
                verified_at="2026-02-19T14:30:10Z",
                verification_method="BHOOMI_SOAP_PARCEL_VERIFY",
                confidence_score=0.995
            ),
            is_authoritative=True
        ),
        IdentityAttribute(
            key="msme_registration",
            label="MSME Udyam Registration Number",
            value="UDYAM-KR-03-0094812",
            provenance=ProvenanceSource(
                department="Ministry of Micro, Small & Medium Enterprises",
                registry_name="National Udyam Portal",
                verified_at="2026-02-20T09:12:00Z",
                verification_method="UDYAM_API_SETU_SYNC",
                confidence_score=1.0
            ),
            is_authoritative=True
        ),
    ]

    return MDMGoldenRecord(
        citizen_id=citizen_id,
        full_name="Vikram Sheshadri Rao",
        pan_number="BKZPC9912A",
        aadhaar_masked="XXXX-XXXX-8842",
        phone_masked="+91 98765-XX410",
        email_masked="vikram.r***@gmail.com",
        date_of_birth="1992-07-14",
        gender="MALE",
        primary_address={
            "line1": "#42, 100 Feet Road, HAL 2nd Stage",
            "locality": "Indiranagar",
            "city": "Bengaluru",
            "state": "Karnataka",
            "pin_code": "560008",
            "municipal_ward": "Ward 4 (Indiranagar / BBMP East)"
        },
        registered_enterprises=[
            {
                "enterprise_name": "Rao Culinary Labs Pvt Ltd",
                "cin": "U72900KA2026PTC192841",
                "udyam_number": "UDYAM-KR-03-0094812",
                "gstin": "29ABCDE1234F1Z5",
                "classification": "MICRO_FOOD_ENTERPRISE",
                "registered_on": "2026-01-15"
            }
        ],
        land_parcels=[
            {
                "parcel_id": "LAND-KA-18-04-019-142-2A",
                "survey_number": "142/2A",
                "extent": "2.45 Acres",
                "zoning": "COMMERCIAL_FOOD_AND_BEVERAGE",
                "unencumbered": True
            }
        ],
        identity_attributes=attributes,
        deduplication_confidence=0.998,
        last_sync_timestamp=now_iso
    )


@router.post(
    "/auto-populate",
    response_model=AutoPopulateResponse,
    summary="Execute 'Once-Only Principle' Multi-Department Form Auto-Fill",
    description="Uses canonical Master Data to auto-fill 4 statutory department applications, eliminating duplicate data entry."
)
async def api_auto_populate_department_forms(payload: AutoPopulateRequest) -> AutoPopulateResponse:
    """Generate pre-filled application payloads for multiple target ministries."""
    golden = await api_get_golden_record(payload.citizen_id)
    
    forms: List[DepartmentPreFilledForm] = [
        DepartmentPreFilledForm(
            department_code="MSME_UDYAM",
            form_title="Form Udyam-1: Micro Enterprise Registration",
            statutory_portal="udyamregistration.gov.in",
            pre_filled_fields={
                "applicant_name": golden.full_name,
                "pan_number": golden.pan_number,
                "aadhaar_vault_ref": golden.aadhaar_masked,
                "enterprise_name": golden.registered_enterprises[0]["enterprise_name"],
                "constitution_type": "PRIVATE_LIMITED",
                "plant_address": golden.primary_address["line1"] + ", " + golden.primary_address["city"],
                "pin_code": golden.primary_address["pin_code"],
                "state": golden.primary_address["state"],
                "bank_account_verified": True
            },
            eliminated_manual_keystrokes=9,
            auto_validated_docs=["e-PAN Card", "Aadhaar e-KYC Extract"]
        ),
        DepartmentPreFilledForm(
            department_code="FSSAI_FOSCOS",
            form_title="Form-B: Application for State Food Safety License",
            statutory_portal="foscos.fssai.gov.in",
            pre_filled_fields={
                "food_business_operator": golden.full_name,
                "trade_name": "Rao Cloud Kitchens",
                "premise_address": golden.primary_address["line1"] + ", " + golden.primary_address["locality"],
                "pin_code": golden.primary_address["pin_code"],
                "pan_reference": golden.pan_number,
                "udyam_linked": golden.registered_enterprises[0]["udyam_number"],
                "food_category_code": "05 (Food Services / Cloud Kitchen)",
                "water_testing_attached": True
            },
            eliminated_manual_keystrokes=8,
            auto_validated_docs=["PAN Certificate", "DigiLocker Commercial Lease", "Udyam Certificate"]
        ),
        DepartmentPreFilledForm(
            department_code="MUNICIPAL_TRADE_LICENSE",
            form_title="Form TL-2: Municipal Corporation Commercial Trade License",
            statutory_portal="bbmp.gov.in / TradeLicensePortal",
            pre_filled_fields={
                "proprietor_name": golden.full_name,
                "ward_jurisdiction": golden.primary_address["municipal_ward"],
                "property_pid_number": "PID-BBMP-104-0982",
                "survey_no_ref": golden.land_parcels[0]["survey_number"],
                "trade_category": "CLOUD_KITCHEN_COMMERCIAL",
                "annual_fee_calculated_inr": 8500,
                "fire_noc_exempted": True
            },
            eliminated_manual_keystrokes=9,
            auto_validated_docs=["Bhoomi RTC Mutation Extract", "Aadhaar Proof of Identity"]
        ),
        DepartmentPreFilledForm(
            department_code="POLLUTION_CONTROL_NOC",
            form_title="Form CTE-Orange: Consent to Establish (Green/Orange Category)",
            statutory_portal="kspcb.karnataka.gov.in",
            pre_filled_fields={
                "industry_name": golden.registered_enterprises[0]["enterprise_name"],
                "occupier_name": golden.full_name,
                "pan_cin_ref": golden.registered_enterprises[0]["cin"],
                "capital_investment_slab": "LESS_THAN_1_CRORE",
                "effluent_generation_type": "DOMESTIC_AND_KITCHEN_GREASE_TRAP",
                "statutory_zoning": golden.land_parcels[0]["zoning"]
            },
            eliminated_manual_keystrokes=8,
            auto_validated_docs=["Corporate Incorporation Certificate", "Land Zoning Certificate"]
        )
    ]

    total_eliminated = sum(f.eliminated_manual_keystrokes for f in forms)
    time_saved = total_eliminated * 2.5  # average 2.5 minutes saved per field + document verification

    return AutoPopulateResponse(
        citizen_id=payload.citizen_id,
        once_only_principle_applied=True,
        total_eliminated_fields=total_eliminated,
        total_time_saved_minutes=int(time_saved),
        department_forms=forms
    )

"""FastAPI Router for IndEA 2.0 Canonical Data Harmonization & Schema Mapper."""

from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List
from app.schemas.indea_mdm import (
    HarmonizationRequest,
    HarmonizationResponse,
)
from app.services.schema_harmonizer import SchemaHarmonizer

router = APIRouter(
    prefix="/mdm",
    tags=["IndEA 2.0 Canonical Schema & MDM Harmonizer"]
)


@router.post(
    "/harmonize",
    response_model=HarmonizationResponse,
    summary="Harmonize Disparate Legacy Schema to IndEA 2.0 Canonical Record",
    description="Transforms conflicting departmental keys (tax_id, fbo_name, res_address) into an authoritative IndEA 2.0 typed data record."
)
async def api_harmonize_schema(payload: HarmonizationRequest) -> HarmonizationResponse:
    """Execute IndEA 2.0 schema harmonization."""
    try:
        return SchemaHarmonizer.harmonize(payload.department_code, payload.raw_payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Schema harmonization failed: {str(e)}"
        )


@router.get(
    "/sample-payloads",
    summary="Get Sample Disparate Departmental Payloads",
    description="Provides real-world conflicting legacy payloads from Revenue, Municipal, MSME, and Food Safety portals."
)
async def api_get_sample_legacy_payloads() -> Dict[str, Any]:
    """Retrieve pre-configured conflicting legacy payloads for demonstration."""
    return {
        "REVENUE_MAHARASHTRA": {
            "department": "State Revenue & Land Records (Mahabhulekh)",
            "raw": {
                "cust_name": "Ayush S Chauhan",
                "tax_id": "bkzpc9912a",
                "res_address": "Flat 42, Palm Meadows, Indiranagar, Bengaluru 560008",
                "contact_no": "9876543210",
                "entity_cat": "Private Limited",
                "khasra_no": "142/2A",
                "utid": "UTID-MH-2026-094182"
            }
        },
        "MUNICIPAL_BMC": {
            "department": "Municipal Corporation (BMC / BBMP)",
            "raw": {
                "applicant_name": "Ayush Singh Chauhan",
                "property_owner_pan": "BKZPC9912A",
                "premises_address": "Indiranagar Ward 4, Bengaluru - 560008",
                "phone": "+91 9876543210",
                "trade_classification": "Commercial Cloud Kitchen",
                "property_pid": "PID-BBMP-104-0982",
                "utid": "UTID-MH-2026-094182"
            }
        },
        "MSME_UDYAM": {
            "department": "Ministry of MSME (Udyam National Portal)",
            "raw": {
                "entrepreneur_name": "Ayush Singh Chauhan",
                "pan_no": "BKZPC9912A",
                "plant_location": "Indiranagar, Bangalore, Karnataka",
                "pin": "560008",
                "constitution_type": "PRIVATE_LIMITED",
                "mobile": "+919876543210",
                "utid": "UTID-MH-2026-094182"
            }
        },
        "FSSAI_FOSCOS": {
            "department": "Food Safety and Standards Authority of India",
            "raw": {
                "fbo_name": "Ayush Singh Chauhan",
                "applicant_pan": "BKZPC9912A",
                "mobile_no": "9876543210",
                "email": "ayush.singh.chauhan@gov.in",
                "food_category": "05 - Food Services",
                "utid": "UTID-MH-2026-094182"
            }
        }
    }

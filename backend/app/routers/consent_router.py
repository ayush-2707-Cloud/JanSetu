"""Router for Consent-Based Data Sharing Ledger.

Directly addresses: "Consent-based data sharing" and "Master-data management"
under Digital Personal Data Protection (DPDP) Act 2023 / Rules 2025.
"""

from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/consent", tags=["Consent-Based Data Sharing Ledger"])


class ConsentItem(BaseModel):
    consent_id: str
    utid: str
    department_code: str
    department_name: str
    purpose: str
    data_elements_shared: List[str]
    legal_basis: str
    granted_at: str
    expiry_at: str
    status: str  # ACTIVE | REVOKED | EXPIRED
    access_frequency: str  # ONCE | ON_DEMAND | RECURRING
    total_data_access_count: int


class ConsentRevokeRequest(BaseModel):
    consent_id: str
    reason: str


class ConsentRevokeResponse(BaseModel):
    consent_id: str
    status: str
    revoked_at: str
    message: str
    sha256_revocation_hash: str


# In-Memory Ledger Database
CONSENT_LEDGER_DB: List[ConsentItem] = [
    ConsentItem(
        consent_id="CNS-FSSAI-094182",
        utid="UTID-MH-2026-094182",
        department_code="FOOD_SAFETY",
        department_name="Food Safety Authority (FSSAI)",
        purpose="Food Business Operator Registration & Hygiene Scrutiny",
        data_elements_shared=["PAN_NUMBER", "FULL_NAME", "BUSINESS_ADDRESS", "ELECTRICITY_BILL_PROOF"],
        legal_basis="DPDP Act 2023 Sec 6(1) & FSS Act 2006",
        granted_at="2026-02-18T10:30:00Z",
        expiry_at="2027-02-18T10:30:00Z",
        status="ACTIVE",
        access_frequency="ON_DEMAND",
        total_data_access_count=3,
    ),
    ConsentItem(
        consent_id="CNS-BMC-094182",
        utid="UTID-MH-2026-094182",
        department_code="MUNICIPAL",
        department_name="Brihanmumbai Municipal Corporation (BMC)",
        purpose="Municipal Health Trade License & Fire Safety NOC",
        data_elements_shared=["PAN_NUMBER", "PROPERTY_PID", "KHASRA_PLOT_NO", "WATER_TEST_REPORT"],
        legal_basis="MMC Act 1888 Sec 394 & DPDP 2023",
        granted_at="2026-02-16T11:00:00Z",
        expiry_at="2027-02-16T11:00:00Z",
        status="ACTIVE",
        access_frequency="ONCE",
        total_data_access_count=1,
    ),
    ConsentItem(
        consent_id="CNS-REV-094182",
        utid="UTID-MH-2026-094182",
        department_code="REVENUE",
        department_name="Revenue & Land Records (Mahabhulekh)",
        purpose="7/12 Land Title Extract & NA Conversion Title Search",
        data_elements_shared=["AADHAAR_VAULT_TOKEN", "KHASRA_PLOT_NO", "DISTRICT_PUNE_CODE"],
        legal_basis="MLR Code 1966 & DPDP Act 2023",
        granted_at="2026-02-05T09:00:00Z",
        expiry_at="2027-02-05T09:00:00Z",
        status="ACTIVE",
        access_frequency="RECURRING",
        total_data_access_count=4,
    ),
    ConsentItem(
        consent_id="CNS-MSME-094182",
        utid="UTID-MH-2026-094182",
        department_code="MSME",
        department_name="Ministry of MSME (Udyam)",
        purpose="Enterprise Category Classification & Priority Subsidy Access",
        data_elements_shared=["PAN_NUMBER", "GSTIN_TOKEN", "BANK_ACCOUNT_IFSC"],
        legal_basis="MSMED Act 2006 & DPDP Act 2023",
        granted_at="2026-02-10T14:20:00Z",
        expiry_at="2027-02-10T14:20:00Z",
        status="ACTIVE",
        access_frequency="ON_DEMAND",
        total_data_access_count=2,
    ),
]


@router.get("/ledger", response_model=List[ConsentItem])
async def get_consent_ledger(utid: str = "UTID-MH-2026-094182") -> List[ConsentItem]:
    """Retrieves all active and historical departmental consent grants for the citizen."""
    return [c for c in CONSENT_LEDGER_DB if c.utid == utid or utid == "ALL"]


@router.post("/revoke", response_model=ConsentRevokeResponse)
async def revoke_consent(req: ConsentRevokeRequest) -> ConsentRevokeResponse:
    """Revokes a specific departmental consent under DPDP Act 2023 Section 6(4)."""
    for c in CONSENT_LEDGER_DB:
        if c.consent_id == req.consent_id:
            c.status = "REVOKED"
            import hashlib
            now_iso = datetime.now(timezone.utc).isoformat()
            hash_str = f"REVOKE|{c.consent_id}|{now_iso}|{req.reason}"
            sha_hash = hashlib.sha256(hash_str.encode()).hexdigest()
            return ConsentRevokeResponse(
                consent_id=c.consent_id,
                status="REVOKED",
                revoked_at=now_iso,
                message=f"Consent for {c.department_name} successfully revoked. Department data access has been halted.",
                sha256_revocation_hash=sha_hash,
            )
    raise HTTPException(status_code=404, detail="Consent ID not found in active ledger")

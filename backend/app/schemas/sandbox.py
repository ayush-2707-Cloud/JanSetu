"""
Pydantic Schemas for Mock DigiLocker & API Setu Sandbox Integration.
Simulates official National Data Governance / API Setu requester specifications.
"""

from enum import Enum
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class DocumentType(str, Enum):
    PAN_CARD = "PAN"
    AADHAAR = "AADHAAR"
    MARKSHEET_10 = "MARKSHEET_10"
    MARKSHEET_12 = "MARKSHEET_12"
    DEGREE_CERTIFICATE = "DEGREE_CERTIFICATE"
    INCOME_CERTIFICATE = "INCOME_CERTIFICATE"
    UDYAM_CERTIFICATE = "UDYAM_CERTIFICATE"
    POLICE_CLEARANCE = "POLICE_CLEARANCE"
    DPIIT_CERTIFICATE = "DPIIT_CERTIFICATE"


class TokenRequest(BaseModel):
    """Citizen OAuth2 authorization code / client token request."""
    client_id: str = Field(..., description="Registered API Setu requester client ID")
    client_secret: Optional[str] = Field("simulated-api-secret-key", description="Client secret key")
    consent_artifact_id: Optional[str] = Field(None, description="DPDP-compliant consent artifact reference")
    citizen_aadhaar_hash: Optional[str] = Field(None, description="SHA-256 hash of citizen identifier")


class TokenResponse(BaseModel):
    """API Setu OAuth2 Bearer Token response."""
    access_token: str
    token_type: str = "Bearer"
    expires_in: int = 3600
    scope: str = "read:verified_credentials"
    consent_timestamp: str


class DocumentFetchRequest(BaseModel):
    """Request payload for pulling a verified digital credential."""
    doc_type: DocumentType = Field(..., description="Document taxonomy type")
    doc_id: str = Field(..., description="Identity number (e.g. PAN, Roll No, Application Ref)")
    full_name: Optional[str] = Field(None, description="Citizen full name for match verification")
    dob: Optional[str] = Field(None, description="Date of birth (YYYY-MM-DD)")


class DigitalSignatureMetadata(BaseModel):
    """Simulated statutory digital signature metadata (CCA / IT Act 2000)."""
    algorithm: str = "SHA256withRSA"
    cert_serial_number: str
    issuer_ca: str
    signature_timestamp: str
    signature_digest: str
    is_revoked: bool = False
    validity_period: str


class VerifiedDocumentResponse(BaseModel):
    """API Setu verified document payload with simulated cryptographic signature."""
    status: str = "VERIFIED"
    doc_type: DocumentType
    doc_id: str
    digilocker_uri: str
    citizen_name: str
    issuing_authority: str
    issuance_date: str
    attributes: Dict[str, Any]
    digital_signature: DigitalSignatureMetadata
    verification_hash: str

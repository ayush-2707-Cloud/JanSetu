"""Pydantic schemas for Federated SSO (MeriPehchaan / Jan Parichay OIDC Gateway)."""

from typing import List, Optional
from pydantic import BaseModel, Field


class SSOClaims(BaseModel):
    sub: str = Field(..., description="Unique Subject Identifier (e.g. JP-2026-981245)")
    name: str = Field(..., description="Full Name of Authenticated Citizen")
    mobile_verified: bool = Field(default=True, description="Two-Factor Mobile OTP verification status")
    aadhaar_token: str = Field(..., description="Anonymized UIDAI Aadhaar Vault token")
    pan_linked: str = Field(..., description="Linked Permanent Account Number")
    email: str = Field(..., description="Verified citizen email address")
    roles: List[str] = Field(default_factory=lambda: ["CITIZEN"], description="RBAC Roles: CITIZEN, OFFICER, ADMIN")
    auth_level: str = Field(default="AAL3_BIOMETRIC_OTP", description="Authentication Assurance Level (AAL3)")
    auth_time: int = Field(..., description="Unix timestamp of authentication")
    iss: str = Field(default="https://meripehchaan.gov.in/openid/connect/v1", description="OIDC Issuer Authority")
    aud: str = Field(default="JANSETU_MIDDLEWARE_CLIENT_01", description="OAuth Client ID Audience")


class SSOLoginRequest(BaseModel):
    auth_code: Optional[str] = Field(default="MOCK_AUTH_CODE_JP_2026", description="OIDC Authorization Code")
    citizen_mobile: Optional[str] = Field(default="+91 98765-43210", description="Citizen Mobile for 2FA")
    login_type: str = Field(default="MERIPEHCHAAN_JANPARICHAY", description="SSO Provider")


class SSOLoginResponse(BaseModel):
    access_token: str
    id_token: str
    token_type: str = "Bearer"
    expires_in: int = 3600
    claims: SSOClaims
    message: str = "MeriPehchaan (Jan Parichay) Federated Authentication Successful"

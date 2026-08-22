"""FastAPI Router for MeriPehchaan / Jan Parichay Federated Single Sign-On (SSO)."""

import time
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Header
from typing import Optional
from app.schemas.sso import (
    SSOLoginRequest,
    SSOLoginResponse,
    SSOClaims,
)

router = APIRouter(
    prefix="/auth/sso",
    tags=["Federated SSO (MeriPehchaan / Jan Parichay OIDC)"]
)


@router.post(
    "/login",
    response_model=SSOLoginResponse,
    summary="Authenticate via MeriPehchaan (Jan Parichay) Federated Gateway",
    description="Simulates national SSO authentication, issuing signed OIDC JWT claims with linked Aadhaar/PAN tokens."
)
async def api_sso_login(payload: SSOLoginRequest) -> SSOLoginResponse:
    """Execute federated login returning authentic OIDC claims."""
    now_ts = int(time.time())
    
    claims = SSOClaims(
        sub="JP-2026-981245",
        name="Ayush Singh Chauhan",
        mobile_verified=True,
        aadhaar_token="TOK-UID-88219",
        pan_linked="BKZPC9912A",
        email="ayush.singh.chauhan@gov.in",
        roles=["CITIZEN"],
        auth_level="AAL3_BIOMETRIC_OTP",
        auth_time=now_ts,
        iss="https://meripehchaan.gov.in/openid/connect/v1",
        aud="JANSETU_MIDDLEWARE_CLIENT_01"
    )

    access_token = f"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.{uuid.uuid4().hex}.mock_access_signature"
    id_token = f"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.{uuid.uuid4().hex}.mock_id_signature"

    return SSOLoginResponse(
        access_token=access_token,
        id_token=id_token,
        token_type="Bearer",
        expires_in=3600,
        claims=claims,
        message="MeriPehchaan (Jan Parichay) Federated Authentication Successful"
    )


@router.get(
    "/userinfo",
    response_model=SSOClaims,
    summary="OIDC UserInfo Endpoint",
    description="Returns standard OpenID Connect citizen profile attributes for an authenticated Bearer token."
)
async def api_sso_userinfo(authorization: Optional[str] = Header(None)) -> SSOClaims:
    """Retrieve authenticated citizen profile via OIDC UserInfo endpoint."""
    return SSOClaims(
        sub="JP-2026-981245",
        name="Ayush Singh Chauhan",
        mobile_verified=True,
        aadhaar_token="TOK-UID-88219",
        pan_linked="BKZPC9912A",
        email="ayush.singh.chauhan@gov.in",
        roles=["CITIZEN"],
        auth_level="AAL3_BIOMETRIC_OTP",
        auth_time=int(time.time()),
        iss="https://meripehchaan.gov.in/openid/connect/v1",
        aud="JANSETU_MIDDLEWARE_CLIENT_01"
    )

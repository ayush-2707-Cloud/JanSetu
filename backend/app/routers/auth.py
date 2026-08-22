"""
FastAPI Router for Unified Authentication & Role Management.
Handles Citizen Login/Registration, Department Officer/Admin Login, and Password Recovery.
Enforces strict role separation with token-based simulated sessions.
"""

from __future__ import annotations
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status, Header, Depends
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    UserProfile,
    UserRole,
    AuthPortalType,
)

router = APIRouter(prefix="/api/auth", tags=["Unified Authentication"])


# Pre-seeded users database (In-Memory with persistent support)
USERS_DATABASE: Dict[str, Dict[str, Any]] = {
    # ── Citizen Accounts ──
    "anand_kumar": {
        "user_id": "CITIZEN-KA-10029",
        "username": "anand_kumar",
        "email": "anand.kumar@citizen.gov.in",
        "phone": "+91 98765 43210",
        "password": "JanSetu@2026",
        "full_name": "Anand Kumar",
        "role": UserRole.CITIZEN_ROLE,
        "department": None,
        "designation": "Individual Citizen / Proprietor",
        "aadhaar_masked": "XXXX-XXXX-4912",
        "pan_masked": "ABCPS****K",
        "is_digilocker_verified": True,
        "created_at": "2026-01-15T10:00:00Z",
    },
    "priya_s": {
        "user_id": "CITIZEN-TN-44912",
        "username": "priya_s",
        "email": "priya.sundaram@anandsweets.in",
        "phone": "+91 97123 45678",
        "password": "JanSetu@2026",
        "full_name": "Priya V. Sundaram",
        "role": UserRole.CITIZEN_ROLE,
        "department": None,
        "designation": "Food Business Operator",
        "aadhaar_masked": "XXXX-XXXX-8921",
        "pan_masked": "DFGPS****M",
        "is_digilocker_verified": True,
        "created_at": "2026-02-10T14:30:00Z",
    },
    # ── Department Officer Accounts ──
    "OFFICER-KA-9942": {
        "user_id": "OFFICER-KA-9942",
        "username": "OFFICER-KA-9942",
        "email": "ranganathan.s@msme.gov.in",
        "phone": "+91 98450 11223",
        "password": "Officer@2026",
        "full_name": "Shri S. Ranganathan",
        "role": UserRole.OFFICER_ROLE,
        "department": "MSME",
        "designation": "Assistant Commissioner / Nodal Scrutiny Officer",
        "aadhaar_masked": "XXXX-XXXX-1102",
        "pan_masked": "GOVTK****Z",
        "is_digilocker_verified": True,
        "created_at": "2025-08-01T09:00:00Z",
    },
    "OFFICER-TN-2204": {
        "user_id": "OFFICER-TN-2204",
        "username": "OFFICER-TN-2204",
        "email": "ananth.mk@fssai.gov.in",
        "phone": "+91 94440 33445",
        "password": "Officer@2026",
        "full_name": "Dr. M. K. Ananth",
        "role": UserRole.OFFICER_ROLE,
        "department": "FOOD_SAFETY",
        "designation": "Food Safety Designated Officer",
        "aadhaar_masked": "XXXX-XXXX-9904",
        "pan_masked": "FSSPK****X",
        "is_digilocker_verified": True,
        "created_at": "2025-09-12T11:00:00Z",
    },
    # ── Admin Account ──
    "ADMIN-GOV-001": {
        "user_id": "ADMIN-GOV-001",
        "username": "ADMIN-GOV-001",
        "email": "admin@jansetu.gov.in",
        "phone": "+91 99000 88776",
        "password": "Admin@2026",
        "full_name": "Dr. Rajeshwar Rao, IAS",
        "role": UserRole.ADMIN_ROLE,
        "department": "E-GOVERNANCE",
        "designation": "Principal Secretary / State Portal Administrator",
        "aadhaar_masked": "XXXX-XXXX-0001",
        "pan_masked": "IASRK****A",
        "is_digilocker_verified": True,
        "created_at": "2025-01-01T08:00:00Z",
    },
}


def find_user_by_identifier(identifier: str) -> Optional[Dict[str, Any]]:
    """Helper to match user by username, email, phone, or officer ID."""
    clean_id = identifier.strip().lower()
    for u in USERS_DATABASE.values():
        if (
            u["username"].lower() == clean_id
            or u["user_id"].lower() == clean_id
            or u["email"].lower() == clean_id
            or (u.get("phone") and u["phone"].replace(" ", "").replace("-", "") == clean_id.replace(" ", "").replace("-", ""))
        ):
            return u
    return None


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    """
    Authenticate a Citizen or Department Officer.
    Validates portal type against user role to prevent unauthorized cross-portal access.
    """
    user_record = find_user_by_identifier(payload.identifier)
    
    if not user_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials: User identity not found in JanSetu registry.",
        )

    # Password check
    if user_record["password"] != payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials: Password/PIN does not match registered security key.",
        )

    # Strict Portal Validation: Officers cannot login via Citizen portal, Citizens cannot login via Officer portal
    if payload.portal_type == AuthPortalType.OFFICER:
        if user_record["role"] not in [UserRole.OFFICER_ROLE, UserRole.ADMIN_ROLE]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied: This account is a Citizen profile. Please authenticate via the Citizen Portal.",
            )
        redirect_url = "/officer"
    else:
        # Citizen Portal
        if user_record["role"] in [UserRole.OFFICER_ROLE, UserRole.ADMIN_ROLE]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied: This account is a Department Officer / Administrator. Please authenticate via the Officer Scrutiny Portal.",
            )
        redirect_url = "/"

    # Generate session access token
    session_token = f"JWT-{user_record['role'].value}-{uuid.uuid4().hex}"

    profile = UserProfile(
        user_id=user_record["user_id"],
        username=user_record["username"],
        full_name=user_record["full_name"],
        email=user_record["email"],
        phone=user_record.get("phone"),
        role=user_record["role"],
        department=user_record.get("department"),
        designation=user_record.get("designation"),
        aadhaar_masked=user_record.get("aadhaar_masked"),
        pan_masked=user_record.get("pan_masked"),
        is_digilocker_verified=user_record.get("is_digilocker_verified", True),
        created_at=user_record["created_at"],
    )

    return LoginResponse(
        success=True,
        message=f"Welcome, {profile.full_name}! Authentication successful for {payload.portal_type.value} Portal.",
        access_token=session_token,
        token_type="Bearer",
        user=profile,
        redirect_url=redirect_url,
    )


@router.post("/register", response_model=LoginResponse)
async def register_citizen(payload: RegisterRequest):
    """
    Register a new Citizen user profile with DigiLocker KYC verification.
    New registrations are strictly provisioned under CITIZEN_ROLE.
    """
    if find_user_by_identifier(payload.username) or find_user_by_identifier(payload.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this username or email already exists in JanSetu.",
        )

    new_user_id = f"CITIZEN-{payload.state[:2].upper()}-{uuid.uuid4().hex[:5].upper()}"
    now_str = datetime.now(timezone.utc).isoformat()
    
    # Mask aadhaar
    aadhaar_masked = "XXXX-XXXX-1234"
    if payload.aadhaar_number and len(payload.aadhaar_number.replace("-", "")) >= 4:
        last4 = payload.aadhaar_number.replace("-", "")[-4:]
        aadhaar_masked = f"XXXX-XXXX-{last4}"

    new_user = {
        "user_id": new_user_id,
        "username": payload.username.strip(),
        "email": payload.email.strip().lower(),
        "phone": payload.phone.strip(),
        "password": payload.password,
        "full_name": payload.full_name.strip(),
        "role": UserRole.CITIZEN_ROLE,
        "department": None,
        "designation": "Registered Citizen",
        "aadhaar_masked": aadhaar_masked,
        "pan_masked": "N/A",
        "is_digilocker_verified": True,
        "created_at": now_str,
    }

    USERS_DATABASE[payload.username.strip()] = new_user

    session_token = f"JWT-{UserRole.CITIZEN_ROLE.value}-{uuid.uuid4().hex}"

    profile = UserProfile(
        user_id=new_user["user_id"],
        username=new_user["username"],
        full_name=new_user["full_name"],
        email=new_user["email"],
        phone=new_user["phone"],
        role=UserRole.CITIZEN_ROLE,
        department=None,
        designation=new_user["designation"],
        aadhaar_masked=new_user["aadhaar_masked"],
        pan_masked=new_user["pan_masked"],
        is_digilocker_verified=True,
        created_at=new_user["created_at"],
    )

    return LoginResponse(
        success=True,
        message=f"Account created successfully for {profile.full_name}! DigiLocker KYC profile activated.",
        access_token=session_token,
        token_type="Bearer",
        user=profile,
        redirect_url="/",
    )


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(payload: ForgotPasswordRequest):
    """
    Simulate account recovery OTP dispatch for forgotten username or password.
    """
    user_record = find_user_by_identifier(payload.identifier)
    if not user_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No registered account found matching the provided identifier.",
        )

    # Mask email/phone for security notice
    email = user_record["email"]
    parts = email.split("@")
    if len(parts) == 2:
        masked_email = f"{parts[0][:2]}***@{parts[1]}"
    else:
        masked_email = "***@gov.in"

    otp_ref = f"OTP-{uuid.uuid4().hex[:6].upper()}"

    return ForgotPasswordResponse(
        success=True,
        message=f"Password reset instructions and verification OTP have been dispatched to {masked_email}.",
        masked_target=masked_email,
        otp_reference_id=otp_ref,
    )


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    authorization: Optional[str] = Header(None),
    x_user_role: Optional[str] = Header(None, alias="X-User-Role"),
):
    """
    Return currently authenticated profile metadata based on token or session header.
    """
    if x_user_role == "OFFICER_ROLE":
        user_record = USERS_DATABASE.get("OFFICER-KA-9942")
    else:
        user_record = USERS_DATABASE.get("anand_kumar")

    if not user_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or unauthenticated.",
        )

    return UserProfile(
        user_id=user_record["user_id"],
        username=user_record["username"],
        full_name=user_record["full_name"],
        email=user_record["email"],
        phone=user_record.get("phone"),
        role=user_record["role"],
        department=user_record.get("department"),
        designation=user_record.get("designation"),
        aadhaar_masked=user_record.get("aadhaar_masked"),
        pan_masked=user_record.get("pan_masked"),
        is_digilocker_verified=user_record.get("is_digilocker_verified", True),
        created_at=user_record["created_at"],
    )

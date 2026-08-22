"""
Pydantic Schemas for Unified Authentication & Role-Based Access in JanSetu™.
Supports Citizen Login/Registration, Department Officer/Admin Login, and Password Recovery.
"""

from __future__ import annotations
from typing import Optional
from enum import Enum
from pydantic import BaseModel, Field


class AuthPortalType(str, Enum):
    CITIZEN = "CITIZEN"
    OFFICER = "OFFICER"


class UserRole(str, Enum):
    CITIZEN_ROLE = "CITIZEN_ROLE"
    OFFICER_ROLE = "OFFICER_ROLE"
    ADMIN_ROLE = "ADMIN_ROLE"


class UserProfile(BaseModel):
    user_id: str
    username: str
    full_name: str
    email: str
    phone: Optional[str] = None
    role: UserRole
    department: Optional[str] = None
    designation: Optional[str] = None
    aadhaar_masked: Optional[str] = None
    pan_masked: Optional[str] = None
    is_digilocker_verified: bool = True
    created_at: str


class LoginRequest(BaseModel):
    identifier: str = Field(..., description="Email, Username, Mobile Number, or Officer ID")
    password: str = Field(..., description="Account password or secure PIN")
    portal_type: AuthPortalType = Field(default=AuthPortalType.CITIZEN, description="Target portal: CITIZEN or OFFICER")


class LoginResponse(BaseModel):
    success: bool
    message: str
    access_token: str
    token_type: str = "Bearer"
    user: UserProfile
    redirect_url: str


class RegisterRequest(BaseModel):
    full_name: str
    username: str
    email: str
    phone: str
    password: str
    aadhaar_number: Optional[str] = None
    state: str = "Karnataka"
    district: str = "Bengaluru Urban"


class ForgotPasswordRequest(BaseModel):
    identifier: str = Field(..., description="Registered Email, Username, or Mobile Number")
    portal_type: AuthPortalType = Field(default=AuthPortalType.CITIZEN)


class ForgotPasswordResponse(BaseModel):
    success: bool
    message: str
    masked_target: str
    otp_reference_id: str

/**
 * Authentication and User Profile Types for JanSetu™ Unified Portal.
 */

export type UserRole = "CITIZEN_ROLE" | "OFFICER_ROLE" | "ADMIN_ROLE";

export type AuthPortalType = "CITIZEN" | "OFFICER";

export interface UserProfile {
  user_id: string;
  username: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department?: string;
  designation?: string;
  aadhaar_masked?: string;
  pan_masked?: string;
  is_digilocker_verified: boolean;
  created_at: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
  portal_type: AuthPortalType;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  token_type: string;
  user: UserProfile;
  redirect_url: string;
}

export interface RegisterPayload {
  full_name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  aadhaar_number?: string;
  state?: string;
  district?: string;
}

export interface ForgotPasswordPayload {
  identifier: string;
  portal_type: AuthPortalType;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  masked_target: string;
  otp_reference_id: string;
}

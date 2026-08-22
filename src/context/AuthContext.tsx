"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  UserProfile,
  UserRole,
  LoginCredentials,
  RegisterPayload,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
} from "@/types/auth";
import { authService } from "@/services/api";
import { useToast } from "@/context/ToastContext";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  requestPasswordReset: (payload: ForgotPasswordPayload) => Promise<ForgotPasswordResponse | null>;
  isAuthorizedForOfficerPortal: () => boolean;
}

const AUTH_STORAGE_KEY = "jansetu_auth_session_v3";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default initial state: Pre-seeded authenticated Citizen session for smooth demonstration
const DEFAULT_CITIZEN_SESSION: UserProfile = {
  user_id: "CITIZEN-KA-10029",
  username: "anand_kumar",
  full_name: "Anand Kumar",
  email: "anand.kumar@citizen.gov.in",
  phone: "+91 98765 43210",
  role: "CITIZEN_ROLE",
  designation: "Individual Citizen / Proprietor",
  aadhaar_masked: "XXXX-XXXX-4912",
  pan_masked: "ABCPS****K",
  is_digilocker_verified: true,
  created_at: "2026-01-15T10:00:00Z",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from localStorage or default demo
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } else {
        // By default on initial visit, start in citizen mode
        setUser(DEFAULT_CITIZEN_SESSION);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEFAULT_CITIZEN_SESSION));
      }
    } catch (err) {
      console.error("Failed to load auth session:", err);
      setUser(DEFAULT_CITIZEN_SESSION);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setIsLoading(true);
      try {
        const res = await authService.login(credentials);
        if (res && res.success && res.user) {
          setUser(res.user);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.user));
          showToast(res.message, "success");
          router.push(res.redirect_url || "/");
          return true;
        } else {
          showToast("Authentication failed. Please check your credentials.", "error");
          return false;
        }
      } catch (err: any) {
        showToast(err?.message || "Invalid credentials or access denied.", "error");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [router, showToast]
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<boolean> => {
      setIsLoading(true);
      try {
        const res = await authService.register(payload);
        if (res && res.success && res.user) {
          setUser(res.user);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.user));
          showToast(res.message, "success");
          router.push(res.redirect_url || "/");
          return true;
        }
        return false;
      } catch (err: any) {
        showToast(err?.message || "Registration failed.", "error");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [router, showToast]
  );

  const logout = useCallback(() => {
    const priorRole = user?.role;
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    showToast("You have been securely logged out of JanSetu™.", "info");

    // Redirect to login portal with target portal hint
    if (priorRole === "OFFICER_ROLE" || priorRole === "ADMIN_ROLE") {
      router.push("/login?portal=officer");
    } else {
      router.push("/login?portal=citizen");
    }
  }, [user, router, showToast]);

  const requestPasswordReset = useCallback(
    async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse | null> => {
      try {
        const res = await authService.forgotPassword(payload);
        if (res && res.success) {
          showToast(res.message, "success");
          return res;
        }
        return null;
      } catch (err: any) {
        showToast(err?.message || "Failed to process recovery request.", "error");
        return null;
      }
    },
    [showToast]
  );

  const isAuthorizedForOfficerPortal = useCallback((): boolean => {
    return user !== null && (user.role === "OFFICER_ROLE" || user.role === "ADMIN_ROLE");
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        requestPasswordReset,
        isAuthorizedForOfficerPortal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

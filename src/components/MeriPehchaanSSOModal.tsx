"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Fingerprint,
  Smartphone,
  Lock,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  RefreshCw,
  KeyRound,
  FileCheck2,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useAuth } from "@/context/AuthContext";
import {
  loginWithMeriPehchaanSSO,
  SSOLoginResponse,
} from "@/services/tier1MiddlewareService";

interface MeriPehchaanSSOModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MeriPehchaanSSOModal({
  isOpen,
  onClose,
  onSuccess,
}: MeriPehchaanSSOModalProps) {
  useBodyScrollLock(isOpen);
  const { login } = useAuth();

  const [mobileNumber, setMobileNumber] = useState<string>("+91 98765-43210");
  const [authMode, setAuthMode] = useState<"OTP" | "BIOMETRIC">("OTP");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [ssoResponse, setSsoResponse] = useState<SSOLoginResponse | null>(null);

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    try {
      const res = await loginWithMeriPehchaanSSO(mobileNumber);
      setSsoResponse(res);

      // Populate AuthContext via session storage
      const userProfile = {
        user_id: res.claims.sub,
        username: "ayush_chauhan",
        full_name: res.claims.name,
        email: res.claims.email,
        phone: mobileNumber,
        role: "CITIZEN_ROLE" as const,
        designation: "Citizen / Enterprise Founder",
        aadhaar_masked: "XXXX-XXXX-8219",
        pan_masked: "BKZPC****A",
        is_digilocker_verified: true,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("jansetu_auth_session_v3", JSON.stringify(userProfile));

      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      console.error("SSO authentication error:", e);
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 perf-gpu animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden will-change-transform">
        {/* Top National Colors Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-md shrink-0 font-bold text-sm">
              🇮🇳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  MeriPehchaan (मेरी पहचान)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 border border-blue-200">
                  Jan Parichay OIDC
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                National Single Sign-On Gateway (MeitY / NIC)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {!ssoResponse ? (
            <>
              {/* Info Note */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200 leading-relaxed">
                Log in once with your National Digital Identity (Jan Parichay) to access all state,
                municipal, and central government statutory portals without separate passwords.
              </div>

              {/* Mode Selection */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  Select 2FA Verification Mode:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode("OTP")}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      authMode === "OTP"
                        ? "bg-blue-50 dark:bg-blue-950/80 border-blue-600 text-blue-700 dark:text-blue-300 font-bold shadow-xs"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-blue-500" />
                    <span>Aadhaar OTP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode("BIOMETRIC")}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      authMode === "BIOMETRIC"
                        ? "bg-blue-50 dark:bg-blue-950/80 border-blue-600 text-blue-700 dark:text-blue-300 font-bold shadow-xs"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Fingerprint className="w-4 h-4 text-purple-500" />
                    <span>Biometric / Passkey</span>
                  </button>
                </div>
              </div>

              {/* Mobile Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  Registered Mobile / Aadhaar Virtual ID:
                </label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="+91 XXXXX-XXXXX"
                />
              </div>

              {/* Simulated Demo Identity Badge */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Pre-Configured Demo Profile:
                </span>
                <div>Name: <strong>Ayush Singh Chauhan</strong></div>
                <div>PAN Linked: <strong>BKZPC9912A</strong> • Aadhaar Token: <strong>TOK-UID-88219</strong></div>
              </div>
            </>
          ) : (
            /* Successful OIDC Response Summary */
            <div className="space-y-4 text-center py-2 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Federated SSO Login Verified
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Authenticated via MeriPehchaan (Jan Parichay) OpenID Connect
                </p>
              </div>

              {/* Verified Claims Token Box */}
              <div className="p-3.5 bg-slate-900 text-left text-white rounded-2xl font-mono text-[11px] space-y-1.5 overflow-x-auto">
                <div className="text-emerald-400 font-bold text-[10px] uppercase">
                  OIDC Authenticated Claims (JWT payload):
                </div>
                <div>sub: "{ssoResponse.claims.sub}"</div>
                <div>name: "{ssoResponse.claims.name}"</div>
                <div>pan_linked: "{ssoResponse.claims.pan_linked}"</div>
                <div>aadhaar_token: "{ssoResponse.claims.aadhaar_token}"</div>
                <div>auth_level: "{ssoResponse.claims.auth_level}"</div>
                <div className="text-slate-400 text-[10px] pt-1">
                  iss: {ssoResponse.claims.iss}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex items-center justify-end gap-2.5 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            {ssoResponse ? "Close" : "Cancel"}
          </button>

          {!ssoResponse ? (
            <button
              onClick={handleAuthenticate}
              disabled={isAuthenticating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isAuthenticating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
              <span>Authenticate with MeriPehchaan</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue to JanSetu Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

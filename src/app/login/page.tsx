"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Lock,
  User,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Building2,
  HelpCircle,
  X,
  FileCheck,
  Landmark,
  Layers,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useJourney } from "@/context/JourneyContext";
import { useToast } from "@/context/ToastContext";
import { AuthPortalType } from "@/types/auth";
import { Language } from "@/types/journey";
import { LOGIN_TRANSLATIONS } from "@/data/loginTranslations";
import MeriPehchaanSSOModal from "@/components/MeriPehchaanSSOModal";

const LANGUAGE_OPTIONS: { id: Language; label: string; native: string }[] = [
  { id: "EN", label: "English", native: "English" },
  { id: "HI", label: "Hindi", native: "हिन्दी" },
  { id: "KN", label: "Kannada", native: "ಕನ್ನಡ" },
  { id: "MR", label: "Marathi", native: "मराठी" },
  { id: "TA", label: "Tamil", native: "தமிழ்" },
  { id: "TE", label: "Telugu", native: "తెలుగు" },
  { id: "BN", label: "Bengali", native: "বাংলা" },
  { id: "GU", label: "Gujarati", native: "ગુજરાતી" },
  { id: "ML", label: "Malayalam", native: "മലയാളം" },
  { id: "PA", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { id: "OR", label: "Odia", native: "ଓଡ଼ିଆ" },
];

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, login, register, requestPasswordReset, logout, isAuthenticated } = useAuth();
  const { language, setLanguage } = useJourney();
  const { showToast } = useToast();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSSOModalOpen, setIsSSOModalOpen] = useState(false);
  const portalParam = searchParams.get("portal");
  const [activeTab, setActiveTab] = useState<"CITIZEN" | "OFFICER" | "REGISTER">(
    portalParam === "officer" || portalParam === "admin" ? "OFFICER" : "CITIZEN"
  );

  // Active translation dictionary
  const t = useMemo(() => {
    return LOGIN_TRANSLATIONS[language] || LOGIN_TRANSLATIONS.EN;
  }, [language]);

  const currentLangObj = useMemo(() => {
    return LANGUAGE_OPTIONS.find((l) => l.id === language) || LANGUAGE_OPTIONS[0];
  }, [language]);

  // Form States
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Registration Form States
  const [regFullName, setRegFullName] = useState<string>("");
  const [regUsername, setRegUsername] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regPhone, setRegPhone] = useState<string>("");
  const [regAadhaar, setRegAadhaar] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>("");
  const [regState, setRegState] = useState<string>("Karnataka");

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [forgotIdentifier, setForgotIdentifier] = useState<string>("");
  const [forgotRecoverySent, setForgotRecoverySent] = useState<boolean>(false);
  const [recoveryTarget, setRecoveryTarget] = useState<string>("");

  useEffect(() => {
    if (portalParam === "officer" || portalParam === "admin") {
      setActiveTab("OFFICER");
    } else if (portalParam === "register") {
      setActiveTab("REGISTER");
    }
  }, [portalParam]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      showToast("Please provide both your identification and password.", "error");
      return;
    }

    setIsSubmitting(true);
    const portalType: AuthPortalType = activeTab === "OFFICER" ? "OFFICER" : "CITIZEN";
    const success = await login({
      identifier: identifier.trim(),
      password: password.trim(),
      portal_type: portalType,
    });
    setIsSubmitting(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regUsername.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword) {
      showToast("Please fill in all mandatory registration fields.", "error");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast("Passwords do not match. Please re-enter.", "error");
      return;
    }

    setIsSubmitting(true);
    const success = await register({
      full_name: regFullName.trim(),
      username: regUsername.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
      aadhaar_number: regAadhaar.trim() || undefined,
      state: regState,
      district: "Bengaluru Urban",
    });
    setIsSubmitting(false);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      showToast("Please enter your registered username, email, or mobile.", "error");
      return;
    }

    const portalType: AuthPortalType = activeTab === "OFFICER" ? "OFFICER" : "CITIZEN";
    const res = await requestPasswordReset({
      identifier: forgotIdentifier.trim(),
      portal_type: portalType,
    });

    if (res && res.success) {
      setRecoveryTarget(res.masked_target);
      setForgotRecoverySent(true);
    }
  };

  // Quick Demo Auto-fills
  const quickFillCitizen = (username: string) => {
    setIdentifier(username);
    setPassword("JanSetu@2026");
    showToast(`Quick-fill loaded for Citizen: ${username}`, "info");
  };

  const quickFillOfficer = (officerId: string) => {
    setIdentifier(officerId);
    setPassword("Officer@2026");
    showToast(`Quick-fill loaded for Official Scrutiny ID: ${officerId}`, "info");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-blue-600 selection:text-white perf-gpu">
      {/* Background Decorative Glows - Hardware Accelerated & Containment Isolated */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 perf-gpu" 
        style={{
          background: "radial-gradient(circle at 10% 10%, rgba(37, 99, 235, 0.12) 0%, transparent 45%), radial-gradient(circle at 90% 50%, rgba(79, 70, 229, 0.10) 0%, transparent 40%), radial-gradient(circle at 50% 90%, rgba(5, 150, 105, 0.08) 0%, transparent 45%)",
          contain: "strict"
        }}
      />

      {/* Top GovTech National Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 p-0.5 shadow-lg shadow-blue-900/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Landmark className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white">{t.portalTitle}</span>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30 uppercase tracking-wider">
                National Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{t.portalSubtitle}</p>
          </div>
        </Link>

        {/* Right Header: Language Switcher and Auth Status */}
        <div className="flex items-center gap-3">
          
          {/* Multilingual Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 border border-slate-700/80 hover:border-blue-500/80 text-slate-200 hover:text-white transition-all shadow-xs cursor-pointer"
              title="Change Portal Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentLangObj.native}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 overflow-hidden animate-in fade-in">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider border-b border-slate-800/80 mb-1">
                  11 Official Languages
                </div>
                <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.id);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                        language === lang.id
                          ? "bg-blue-600 text-white font-bold"
                          : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[10px] opacity-70 font-mono">({lang.id})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/"
            className="text-xs font-bold text-slate-400 hover:text-white hidden sm:block"
          >
            {t.backToHome}
          </Link>

          {isAuthenticated && user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-200">{user.full_name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{user.role}</p>
              </div>
              <button
                onClick={logout}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 transition-colors cursor-pointer"
              >
                {t.signOutBtn}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Authentication Card Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 z-10">
        <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">
          
          {/* Card Header & Portal Switcher */}
          <div className="p-6 sm:p-8 bg-slate-900 border-b border-slate-800 space-y-4">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-400/20 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.ssoBadge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {activeTab === "CITIZEN"
                  ? t.citizenHeaderTitle
                  : activeTab === "OFFICER"
                  ? t.officerHeaderTitle
                  : t.registerHeaderTitle}
              </h1>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {activeTab === "CITIZEN"
                  ? t.citizenHeaderSubtitle
                  : activeTab === "OFFICER"
                  ? t.officerHeaderSubtitle
                  : t.registerHeaderSubtitle}
              </p>
            </div>

            {/* Portal Tab Switcher (3-way selector) */}
            <div className="grid grid-cols-3 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("CITIZEN");
                  setIdentifier("");
                  setPassword("");
                }}
                className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "CITIZEN"
                    ? "bg-blue-600 text-white shadow-md font-black"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="truncate">{t.tabCitizen}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("OFFICER");
                  setIdentifier("");
                  setPassword("");
                }}
                className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "OFFICER"
                    ? "bg-indigo-600 text-white shadow-md font-black"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="truncate">{t.tabOfficer}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("REGISTER");
                }}
                className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "REGISTER"
                    ? "bg-emerald-600 text-white shadow-md font-black"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span className="truncate">{t.tabRegister}</span>
              </button>
            </div>
          </div>

          {/* Form Body Area */}
          <div className="p-6 sm:p-8 space-y-6">

            {/* TAB 1: CITIZEN LOGIN */}
            {activeTab === "CITIZEN" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t.citizenIdentifierLabel}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={t.citizenIdentifierPlaceholder}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{t.citizenPasswordLabel}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotIdentifier(identifier);
                        setIsForgotModalOpen(true);
                        setForgotRecoverySent(false);
                      }}
                      className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      {t.forgotPasswordBtn}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.citizenPasswordPlaceholder}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-black text-xs bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Users className="w-4 h-4" />
                  <span>{isSubmitting ? t.citizenSubmittingBtn : t.citizenSubmitBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Federated SSO Divider & National Gateway Button */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-900 px-2 text-[10px] font-bold text-slate-500">
                      Or Authenticate via National ID
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSSOModalOpen(true)}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-orange-600/20 via-slate-800 to-emerald-600/20 hover:from-orange-600/30 hover:to-emerald-600/30 text-white border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
                >
                  <span className="text-base">🇮🇳</span>
                  <span>Sign in with MeriPehchaan (मेरी पहचान / Jan Parichay)</span>
                </button>

                {/* Evaluator Demo Quick Fills */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    ⚡ {t.evaluatorBoxTitle}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => quickFillCitizen("anand_kumar")}
                      className="text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-blue-300 block font-bold">Anand Kumar</strong>
                      <span className="text-[10px] text-slate-400">{t.citizenDemo1Label}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => quickFillCitizen("priya_s")}
                      className="text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-emerald-300 block font-bold">Priya Sundaram</strong>
                      <span className="text-[10px] text-slate-400">{t.citizenDemo2Label}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: DEPARTMENT OFFICER / ADMIN LOGIN */}
            {activeTab === "OFFICER" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in">
                {/* Statutory Warning Notice */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-[11px]">
                    <strong>{t.itActNotice}</strong>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t.officerIdentifierLabel}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={t.officerIdentifierPlaceholder}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{t.officerPasswordLabel}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotIdentifier(identifier);
                        setIsForgotModalOpen(true);
                        setForgotRecoverySent(false);
                      }}
                      className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      {t.forgotPasswordBtn}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.officerPasswordPlaceholder}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-black text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? t.officerSubmittingBtn : t.officerSubmitBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Evaluator Demo Quick Fills for Officer */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    ⚡ {t.evaluatorBoxTitle}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => quickFillOfficer("OFFICER-KA-9942")}
                      className="text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-indigo-300 block font-bold">Shri S. Ranganathan</strong>
                      <span className="text-[10px] text-slate-400">{t.officerDemo1Label}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => quickFillOfficer("OFFICER-TN-2204")}
                      className="text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-purple-300 block font-bold">Dr. M. K. Ananth</strong>
                      <span className="text-[10px] text-slate-400">{t.officerDemo2Label}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 3: CITIZEN REGISTRATION */}
            {activeTab === "REGISTER" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">{t.fullNameLabel}</label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder={t.fullNamePlaceholder}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">{t.usernameLabel}</label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder={t.usernamePlaceholder}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">{t.emailLabel}</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">{t.phoneLabel}</label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">{t.aadhaarLabel}</label>
                    <input
                      type="text"
                      value={regAadhaar}
                      onChange={(e) => setRegAadhaar(e.target.value)}
                      placeholder={t.aadhaarPlaceholder}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">{t.stateLabel}</label>
                    <select
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Delhi">Delhi NCT</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Odisha">Odisha</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">{t.passwordLabel}</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">{t.confirmPasswordLabel}</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder={t.confirmPasswordPlaceholder}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    {t.digilockerSafeNotice}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? t.registerSubmittingBtn : t.registerSubmitBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>

          {/* Card Footer */}
          <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-center text-xs text-slate-500">
            <span>Official Portal of India • Governed by MeitY & National Informatics Centre (NIC)</span>
          </div>

        </div>
      </main>

      {/* FORGOT USERNAME / PASSWORD MODAL */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <HelpCircle className="w-4 h-4" />
                <span>{t.forgotModalTitle}</span>
              </div>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!forgotRecoverySent ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                <p className="text-slate-400 leading-relaxed">
                  {t.forgotModalDesc}
                </p>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">{t.forgotInputLabel}</label>
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder={t.forgotInputPlaceholder}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                  >
                    {t.forgotCloseBtn}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                  >
                    {t.forgotSubmitBtn}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Recovery Instructions Dispatched</h3>
                  <p className="text-xs text-slate-400">
                    {t.forgotSentSuccess}
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-400">{recoveryTarget}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  {t.forgotCloseBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MeriPehchaan (Jan Parichay) Federated SSO Modal */}
      <MeriPehchaanSSOModal
        isOpen={isSSOModalOpen}
        onClose={() => setIsSSOModalOpen(false)}
        onSuccess={() => {
          setIsSSOModalOpen(false);
          showToast("✓ Authenticated via MeriPehchaan (Jan Parichay) National Gateway! 🎉", "success");
          router.push("/dashboard");
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 sm:px-8 py-3 text-center text-[11px] text-slate-500">
        <span>© 2026 JanSetu™ National GovTech Infrastructure. Built for Smart India Hackathon.</span>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading JanSetu Authentication Gateway...</div>}>
      <LoginContent />
    </Suspense>
  );
}

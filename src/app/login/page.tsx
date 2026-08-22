"use client";

import React, { useState, useEffect, Suspense } from "react";
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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { AuthPortalType } from "@/types/auth";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, login, register, requestPasswordReset, logout, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const portalParam = searchParams.get("portal");
  const [activeTab, setActiveTab] = useState<"CITIZEN" | "OFFICER" | "REGISTER">(
    portalParam === "officer" || portalParam === "admin" ? "OFFICER" : "CITIZEN"
  );

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Decorative Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

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
              <span className="text-base font-black tracking-tight text-white">JanSetu™</span>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30 uppercase tracking-wider">
                National Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Universal Digital Citizen & Officer Gateway</p>
          </div>
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
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Main Authentication Card Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 z-10">
        <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">
          
          {/* Card Header & Portal Switcher */}
          <div className="p-6 sm:p-8 bg-slate-900 border-b border-slate-800 space-y-4">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-400/20 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Single Sign-On (SSO) & DigiLocker Federated Auth</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {activeTab === "CITIZEN"
                  ? "Citizen Access Gateway"
                  : activeTab === "OFFICER"
                  ? "Department Officer & Admin Scrutiny Hub"
                  : "New Citizen User Registration"}
              </h1>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {activeTab === "CITIZEN"
                  ? "Track statutory roadmaps, verify legal documents, and submit municipal approvals."
                  : activeTab === "OFFICER"
                  ? "Restricted official portal for cross-departmental application review, DigiLocker verification, and SLA decisioning."
                  : "Create an official citizen identity linked with DigiLocker and API Setu."}
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
                <span className="truncate">Citizen Login</span>
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
                <span className="truncate">Officer / Admin</span>
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
                <span className="truncate">New Register</span>
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
                    <span>Email, Mobile Number, or Username</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. anand_kumar or anand.kumar@citizen.gov.in"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Password or DigiLocker PIN</span>
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
                      Forgot Username / Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
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
                  <span>{isSubmitting ? "Authenticating Citizen..." : "Sign In to Citizen Portal"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Evaluator Demo Quick Fills */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    ⚡ Evaluator Demo Citizen Profiles:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => quickFillCitizen("anand_kumar")}
                      className="text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-blue-300 block font-bold">Anand Kumar</strong>
                      <span className="text-[10px] text-slate-400">Proprietor • Udyam / MSME</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => quickFillCitizen("priya_s")}
                      className="text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-emerald-300 block font-bold">Priya Sundaram</strong>
                      <span className="text-[10px] text-slate-400">FBO Operator • FSSAI</span>
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
                    <strong>Official Back-Office Portal:</strong> Authorized government personnel only. All access is logged with immutable IP & UTID audit records under the Information Technology Act.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Officer Service ID or Official Email</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. OFFICER-KA-9942 or ranganathan.s@msme.gov.in"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Govt Security PIN / Access Key</span>
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
                      Forgot Officer Key?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
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
                  <span>{isSubmitting ? "Verifying Official Role..." : "Sign In to Officer Scrutiny Hub"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Evaluator Demo Quick Fills for Officer */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    ⚡ Evaluator Demo Officer Credentials:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => quickFillOfficer("OFFICER-KA-9942")}
                      className="text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-indigo-300 block font-bold">Shri S. Ranganathan</strong>
                      <span className="text-[10px] text-slate-400">MSME Assistant Commissioner</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => quickFillOfficer("OFFICER-TN-2204")}
                      className="text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-purple-300 block font-bold">Dr. M. K. Ananth</strong>
                      <span className="text-[10px] text-slate-400">FSSAI Designated Officer</span>
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
                    <label className="font-bold text-slate-300">Full Legal Name (as on Aadhaar)</label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar Verma"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Username</label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="e.g. ramesh_verma"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Email Address</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. ramesh@example.com"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Mobile Number (+91)</label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Aadhaar (Optional for DigiLocker)</label>
                    <input
                      type="text"
                      value={regAadhaar}
                      onChange={(e) => setRegAadhaar(e.target.value)}
                      placeholder="12-digit UIDAI Number"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Domicile State</label>
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
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Password</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    Registering provisions a secure DigiLocker token and DPDP Act 2023 compliant consent record.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? "Creating Account..." : "Create Verified Citizen Account"}</span>
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
                <span>Account Recovery Portal</span>
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
                  Enter your registered email address, mobile number, username, or Officer ID to receive a secure recovery OTP.
                </p>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Registered Identifier</label>
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="e.g. anand_kumar or +91 98765 43210"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                  >
                    Send Recovery OTP
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
                    A verification OTP and password reset link have been dispatched to:
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-400">{recoveryTarget}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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

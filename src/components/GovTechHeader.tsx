"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  Landmark, 
  Shield, 
  Bell, 
  UserCheck, 
  Globe, 
  Home, 
  Sun, 
  Moon, 
  Laptop, 
  ChevronDown,
  Sparkles,
  FolderTree,
  Building2,
  CheckSquare,
  Users,
  ShieldCheck,
} from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { useTheme, Theme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Language } from "@/types/journey";
import { translations } from "@/data/translations";
import { MunicipalComparisonModal } from "@/components/MunicipalComparisonModal";
import { QATestingModal } from "@/components/QATestingModal";
import PreFlightReviewModal from "@/components/PreFlightReviewModal";
import ConnectorHubModal from "@/components/ConnectorHubModal";
import MDMGoldenRecordModal from "@/components/MDMGoldenRecordModal";
import AuditTrailModal from "@/components/AuditTrailModal";
import DepartmentalSLAModal from "@/components/DepartmentalSLAModal";
import VisualDataHarmonizerModal from "@/components/VisualDataHarmonizerModal";
import MeriPehchaanSSOModal from "@/components/MeriPehchaanSSOModal";
import LiveEventStreamToast from "@/components/LiveEventStreamToast";
import EnterpriseStandardsModal from "@/components/EnterpriseStandardsModal";
import ChaosResilienceModal from "@/components/ChaosResilienceModal";
import CPGRAMSGrievanceModal from "@/components/CPGRAMSGrievanceModal";
import SystemTelemetryModal from "@/components/SystemTelemetryModal";

const LANGUAGE_OPTIONS: { id: Language; label: string; native: string }[] = [
  { id: "BN", label: "Bengali", native: "বাংলা" },
  { id: "EN", label: "English", native: "English" },
  { id: "GU", label: "Gujarati", native: "ગુજરાતી" },
  { id: "HI", label: "Hindi", native: "हिन्दी" },
  { id: "KN", label: "Kannada", native: "ಕನ್ನಡ" },
  { id: "ML", label: "Malayalam", native: "മലയാളം" },
  { id: "MR", label: "Marathi", native: "मराठी" },
  { id: "OR", label: "Odia", native: "ଓଡ଼ିଆ" },
  { id: "PA", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { id: "TA", label: "Tamil", native: "தமிழ்" },
  { id: "TE", label: "Telugu", native: "తెలుగు" },
];

export const GovTechHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const {
    language,
    setLanguage,
    activeScreen,
    setActiveScreen,
    navigateToHome,
    openLanguageModal,
    appMode,
    setAppMode,
  } = useJourney();
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMunicipalModalOpen, setIsMunicipalModalOpen] = useState(false);
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);
  const [isPreflightModalOpen, setIsPreflightModalOpen] = useState(false);
  const [isConnectorsModalOpen, setIsConnectorsModalOpen] = useState(false);
  const [isMDMModalOpen, setIsMDMModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isSLAModalOpen, setIsSLAModalOpen] = useState(false);
  const [isHarmonizerModalOpen, setIsHarmonizerModalOpen] = useState(false);
  const [isSSOModalOpen, setIsSSOModalOpen] = useState(false);
  const [isStandardsModalOpen, setIsStandardsModalOpen] = useState(false);
  const [isChaosModalOpen, setIsChaosModalOpen] = useState(false);
  const [isGrievanceModalOpen, setIsGrievanceModalOpen] = useState(false);
  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState(false);
  const [isInteropDropdownOpen, setIsInteropDropdownOpen] = useState(false);
  const t = useMemo(() => translations[language] || translations.EN, [language]);

  return (
    <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
      {/* Official Government Top Banner */}
      <div className="bg-slate-900 px-4 py-1.5 border-b border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">An Official Government Service Portal • Universal Journey Standard v2.4</span>
            <span className="sm:hidden">GovTech Universal Standard v2.4</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Indicator & Quick Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-850 px-2 py-0.5 rounded border border-slate-800 text-xs text-slate-300 transition-colors"
                title={`Current theme: ${theme} (${resolvedTheme})`}
              >
                {theme === "system" ? (
                  <Laptop className="w-3 h-3 text-blue-400" />
                ) : resolvedTheme === "dark" ? (
                  <Moon className="w-3 h-3 text-indigo-400" />
                ) : (
                  <Sun className="w-3 h-3 text-amber-400" />
                )}
                <span className="text-[10px] uppercase font-bold capitalize">
                  {theme === "system" ? `System (${resolvedTheme})` : theme}
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
              </button>

              {/* Theme Dropdown */}
              {isThemeDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsThemeDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-36 bg-slate-900 border border-slate-850 rounded-xl shadow-2xl py-1 z-50 text-xs space-y-0.5">
                    {[
                      { id: "system" as Theme, label: "System Auto", icon: Laptop },
                      { id: "dark" as Theme, label: "Dark Theme", icon: Moon },
                      { id: "light" as Theme, label: "Light Theme", icon: Sun },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = theme === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setTheme(item.id);
                            setIsThemeDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-1.5 flex items-center gap-2 text-left transition-colors ${
                            isSelected
                              ? "bg-blue-600/30 text-blue-400 font-bold"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-850 px-2.5 py-0.5 rounded border border-slate-800 text-xs text-slate-300 transition-colors font-medium"
                title="Select portal language"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] font-bold text-slate-200">
                  {LANGUAGE_OPTIONS.find((l) => l.id === language)?.native || "English"}
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
              </button>

              {isLangDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-52 max-h-80 overflow-y-auto bg-slate-900 border border-slate-850 rounded-xl shadow-2xl py-1 z-50 text-xs divide-y divide-slate-800/60">
                    <div className="p-1 space-y-0.5">
                      {LANGUAGE_OPTIONS.map((item) => {
                        const isSelected = language === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setLanguage(item.id);
                              setIsLangDropdownOpen(false);
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                              isSelected
                                ? "bg-blue-600 text-white font-bold"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`}
                          >
                            <span className="font-semibold">{item.native}</span>
                            <span className="text-[10px] opacity-75 font-mono">({item.label})</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => {
                          setIsLangDropdownOpen(false);
                          openLanguageModal();
                        }}
                        className="w-full px-2 py-1.5 text-[11px] text-center text-blue-400 hover:text-blue-300 font-bold hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        🌐 View All Languages Modal
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title (Acts as clean Home button) */}
        <Link 
          href="/"
          onClick={(e) => {
            navigateToHome();
          }}
          className="flex items-center gap-3 cursor-pointer group select-none text-left no-underline"
          title="Return to JanSetu™ Homepage"
        >
          <div className="p-2.5 bg-blue-600 group-hover:bg-blue-500 rounded-xl text-white shadow-md transition-colors">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-slate-100 group-hover:text-blue-300 transition-colors">
                JanSetu™ <span className="text-xs font-normal text-blue-300 ml-0.5">(जनसेतु)</span>
              </h1>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold px-2 py-0.5 rounded">
                GovTech India
              </span>
            </div>
            <p className="text-xs text-slate-400">
              National Citizen Bridge for Statutory Clearances & Public Delivery
            </p>
          </div>
        </Link>

        {/* Clean Center Navigation for Citizens & Evaluators */}
        <div className="flex items-center gap-2">
          <Link
            href="/explore"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all no-underline"
          >
            <span>Explore Clearances</span>
          </Link>

          <Link
            href="/officer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-300 hover:text-indigo-200 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/60 transition-all no-underline"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Officer Portal</span>
          </Link>

          {/* Unified Single Interoperability Suite Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsInteropDropdownOpen(!isInteropDropdownOpen)}
              className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-md transition-all cursor-pointer border border-indigo-400/30"
              title="Open SIH26129 Interoperability Middleware Lab & Evaluation Suite"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>⚡ Interoperability Lab</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isInteropDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isInteropDropdownOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-80 sm:w-96 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 space-y-3">
                <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-xs text-white block">
                      SIH26129 Interoperability Suite
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Tier-1 Enterprise Middleware Lab (Govt of Maharashtra)
                    </span>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Live Active
                  </span>
                </div>

                {/* Section 1: Ingestion & Identity */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 px-2 block">
                    1. Ingestion & Identity Middleware
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        setIsHarmonizerModalOpen(true);
                        setIsInteropDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-indigo-300 block font-bold">🔄 Harmonizer</strong>
                      <span className="text-[10px] text-slate-400 block leading-tight">IndEA 2.0 Schema MDM</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsConnectorsModalOpen(true);
                        setIsInteropDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-blue-300 block font-bold">🔌 Connectors Hub</strong>
                      <span className="text-[10px] text-slate-400 block leading-tight">SOAP/XML & REST</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMDMModalOpen(true);
                        setIsInteropDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-teal-300 block font-bold">👤 Golden Record</strong>
                      <span className="text-[10px] text-slate-400 block leading-tight">Once-Only Auto-Populate</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsSSOModalOpen(true);
                        setIsInteropDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-orange-300 block font-bold">🇮🇳 MeriPehchaan</strong>
                      <span className="text-[10px] text-slate-400 block leading-tight">Jan Parichay SSO</span>
                    </button>
                  </div>
                </div>

                {/* Section 2: Trust & Performance */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 px-2 block">
                    2. Trust, Governance & SLA
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        setIsPreflightModalOpen(true);
                        setIsInteropDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-emerald-300 block font-bold">🛡️ Pre-Flight Gate</strong>
                      <span className="text-[10px] text-slate-400 block leading-tight">Data Quality & OCR</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAuditModalOpen(true);
                        setIsInteropDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-purple-300 block font-bold">📜 Audit Ledger</strong>
                      <span className="text-[10px] text-slate-400 block leading-tight">SHA-256 Tamper-Proof</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsSLAModalOpen(true);
                        setIsInteropDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-amber-300 block font-bold">📊 SLA Monitor</strong>
                      <span className="text-[10px] text-slate-400 block leading-tight">RTSA Act 2015 Timers</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMunicipalModalOpen(true);
                        setIsInteropDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-slate-300 block font-bold">🏙️ Bylaws Diff</strong>
                      <span className="text-[10px] text-slate-400 block leading-tight">BBMP vs BMC Rules</span>
                    </button>
                  </div>
                </div>

                {/* Section 3: Tier-2 Enterprise Architecture & Resiliency */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 px-2 block">
                    3. Enterprise Resilience & Observability
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        setIsStandardsModalOpen(true);
                        setIsInteropDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-indigo-300 block font-bold">🏛️ IndEA 2.0 Standards</strong>
                      <span className="text-[10px] text-slate-400 block leading-tight">6-Pillar MeitY Audit</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsChaosModalOpen(true);
                        setIsInteropDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-rose-300 block font-bold">⚡ Chaos & DLQ Engine</strong>
                      <span className="text-[10px] text-slate-400 block leading-tight">Circuit Breaker & DLQ</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsGrievanceModalOpen(true);
                        setIsInteropDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-orange-300 block font-bold">⚖️ CPGRAMS Grievance</strong>
                      <span className="text-[10px] text-slate-400 block leading-tight">RTSA Sec 8/10 Drafter</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsTelemetryModalOpen(true);
                        setIsInteropDropdownOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <strong className="text-xs text-emerald-300 block font-bold">📈 APM Telemetry</strong>
                      <span className="text-[10px] text-slate-400 block leading-tight">Latency & Live Uptime</span>
                    </button>
                  </div>
                </div>

                {/* Section 4: QA Checklist */}
                <div className="pt-1 border-t border-slate-900">
                  <button
                    onClick={() => {
                      setIsQAModalOpen(true);
                      setIsInteropDropdownOpen(false);
                    }}
                    className="w-full p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/80 text-left flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-emerald-300">🧪 Interactive QA Testing Checklist</span>
                    <span className="text-[10px] text-emerald-400 font-mono">125/125 Tests</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls & Authenticated User Identity */}
        <div className="flex items-center gap-3">
          
          {activeScreen === "ROADMAP" && (
            <button
              onClick={() => {
                navigateToHome();
                router.push("/dashboard");
              }}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.backToSearch}</span>
            </button>
          )}

          {/* QA Test Hub Trigger Button */}
          <button
            type="button"
            onClick={() => setIsQAModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all text-xs cursor-pointer"
            title="Open Interactive QA Testing Checklist"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>🧪 QA Checklist</span>
          </button>

          <div className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 relative cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
          </div>

          {/* Authenticated User Session / Logout Control */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
                <div className={`w-7 h-7 rounded-full text-white font-black text-[11px] flex items-center justify-center shadow-md ${
                  user.role === "OFFICER_ROLE" || user.role === "ADMIN_ROLE"
                    ? "bg-gradient-to-tr from-indigo-600 to-purple-600"
                    : "bg-gradient-to-tr from-blue-600 to-emerald-500"
                }`}>
                  <span>{user.full_name.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="hidden sm:block text-left">
                  <span className="font-semibold block text-slate-200 leading-none truncate max-w-[120px]">
                    {user.full_name}
                  </span>
                  <span className={`text-[10px] flex items-center gap-1 ${
                    user.role === "OFFICER_ROLE" || user.role === "ADMIN_ROLE"
                      ? "text-indigo-400"
                      : "text-emerald-400"
                  }`}>
                    {user.role === "OFFICER_ROLE" || user.role === "ADMIN_ROLE" ? (
                      <>
                        <ShieldCheck className="w-2.5 h-2.5 inline" /> Official / Admin
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-2.5 h-2.5 inline" /> Citizen Verified
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={logout}
                className="px-2.5 py-1.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-red-950/80 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-800 transition-colors cursor-pointer"
                title="Secure Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl font-extrabold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all cursor-pointer no-underline"
            >
              Sign In / Portal
            </Link>
          )}

        </div>

      </div>

      {/* Municipal Corporation Compliance Diff Modal */}
      <MunicipalComparisonModal
        isOpen={isMunicipalModalOpen}
        onClose={() => setIsMunicipalModalOpen(false)}
      />

      {/* Interactive QA Testing Checklist Modal */}
      <QATestingModal
        isOpen={isQAModalOpen}
        onClose={() => setIsQAModalOpen(false)}
      />

      {/* Data-Quality Pre-Flight Validation Quality Gate Modal */}
      <PreFlightReviewModal
        isOpen={isPreflightModalOpen}
        onClose={() => setIsPreflightModalOpen(false)}
      />

      {/* Reusable Connectors Hub Modal */}
      <ConnectorHubModal
        isOpen={isConnectorsModalOpen}
        onClose={() => setIsConnectorsModalOpen(false)}
      />

      {/* Master Data Management (MDM) Golden Record Modal */}
      <MDMGoldenRecordModal
        isOpen={isMDMModalOpen}
        onClose={() => setIsMDMModalOpen(false)}
      />

      {/* Cryptographic SHA-256 Audit Trail Modal */}
      <AuditTrailModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* Departmental SLA Performance & Bottleneck Analytics Modal */}
      <DepartmentalSLAModal
        isOpen={isSLAModalOpen}
        onClose={() => setIsSLAModalOpen(false)}
      />

      {/* IndEA 2.0 Visual Data Harmonizer Modal */}
      <VisualDataHarmonizerModal
        isOpen={isHarmonizerModalOpen}
        onClose={() => setIsHarmonizerModalOpen(false)}
      />

      {/* MeriPehchaan (Jan Parichay) Federated SSO Modal */}
      <MeriPehchaanSSOModal
        isOpen={isSSOModalOpen}
        onClose={() => setIsSSOModalOpen(false)}
      />

      {/* IndEA 2.0 6-Pillar Standards Compliance Modal */}
      <EnterpriseStandardsModal
        isOpen={isStandardsModalOpen}
        onClose={() => setIsStandardsModalOpen(false)}
      />

      {/* Chaos Engineering & DLQ Resilience Controls Modal */}
      <ChaosResilienceModal
        isOpen={isChaosModalOpen}
        onClose={() => setIsChaosModalOpen(false)}
      />

      {/* CPGRAMS & Maharashtra RTSA Grievance Bridge Modal */}
      <CPGRAMSGrievanceModal
        isOpen={isGrievanceModalOpen}
        onClose={() => setIsGrievanceModalOpen(false)}
      />

      {/* Interoperability Observability & APM Telemetry Modal */}
      <SystemTelemetryModal
        isOpen={isTelemetryModalOpen}
        onClose={() => setIsTelemetryModalOpen(false)}
      />

      {/* Global Real-Time Server-Sent Events (SSE) Toast Listener */}
      <LiveEventStreamToast />
    </header>
  );
};

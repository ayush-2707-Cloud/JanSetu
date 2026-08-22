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

        {/* Center Quick Tools: Interoperability Hub, Pre-Flight Gate, MDM & SLA */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Pre-Flight Quality Gate Trigger */}
          <button
            type="button"
            onClick={() => setIsPreflightModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/80 hover:text-emerald-300 hover:bg-emerald-900/60 transition-all cursor-pointer shadow-xs"
            title="Run data-quality pre-checks & AI exception validation before filing"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pre-Flight Gate</span>
          </button>

          {/* Connectors Hub Trigger */}
          <button
            type="button"
            onClick={() => setIsConnectorsModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 text-xs text-blue-400 bg-blue-950/50 border border-blue-800/80 hover:text-blue-300 hover:bg-blue-900/60 transition-all cursor-pointer shadow-xs"
            title="Reusable Legacy SOAP/XML & Modern REST Connectors Hub"
          >
            <FolderTree className="w-3.5 h-3.5 text-blue-400" />
            <span>Connectors Hub</span>
          </button>

          {/* MDM Golden Citizen Record Trigger */}
          <button
            type="button"
            onClick={() => setIsMDMModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 text-xs text-teal-400 bg-teal-950/50 border border-teal-800/80 hover:text-teal-300 hover:bg-teal-900/60 transition-all cursor-pointer shadow-xs"
            title="Master Data Management Golden Citizen Record & Once-Only Auto-Populate"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Golden Record (MDM)</span>
          </button>

          {/* Cryptographic Audit Ledger Trigger */}
          <button
            type="button"
            onClick={() => setIsAuditModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 text-xs text-purple-400 bg-purple-950/50 border border-purple-800/80 hover:text-purple-300 hover:bg-purple-900/60 transition-all cursor-pointer shadow-xs"
            title="Immutable Cryptographic SHA-256 Audit Trail"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Audit Ledger</span>
          </button>

          {/* Departmental SLA Analytics Trigger */}
          <button
            type="button"
            onClick={() => setIsSLAModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 text-xs text-amber-400 bg-amber-950/50 border border-amber-800/80 hover:text-amber-300 hover:bg-amber-900/60 transition-all cursor-pointer shadow-xs"
            title="Right to Public Services SLA Analytics & Bottleneck Monitor"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>SLA Monitor</span>
          </button>

          {/* Municipal Comparison Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsMunicipalModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 text-xs text-slate-300 bg-slate-900/90 border border-slate-800 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="Compare municipal compliance rules (BBMP vs BMC vs MCD)"
          >
            <span>{t.cityBylawsDiff || "City Bylaws Diff"}</span>
          </button>
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
    </header>
  );
};

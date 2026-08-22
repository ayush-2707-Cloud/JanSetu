"use client";

import React, { useState } from "react";
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
import { Language } from "@/types/journey";
import { translations } from "@/data/translations";
import { MunicipalComparisonModal } from "@/components/MunicipalComparisonModal";
import { QATestingModal } from "@/components/QATestingModal";

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
  const t = translations[language] || translations.EN;

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

        {/* Top Navigation Mode / Role Controller */}
        <div className="hidden lg:flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-2xl shadow-inner text-xs">
          {/* Citizen Portal Tab */}
          <Link
            href="/"
            onClick={() => {
              if (pathname === "/officer") {
                navigateToHome();
              }
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer no-underline ${
              pathname !== "/officer"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Citizen Portal</span>
          </Link>

          {/* Officer / Admin Back-Office Tab */}
          <Link
            href="/officer"
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer no-underline ${
              pathname === "/officer"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Officer Scrutiny Hub</span>
            <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/40">
              Back-Office
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setIsMunicipalModalOpen(true)}
            className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer ml-1"
            title="Compare municipal compliance rules (BBMP vs BMC vs MCD)"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>City Bylaws Diff</span>
          </button>
        </div>

        {/* Action Controls & Active Profile Avatar */}
        <div className="flex items-center gap-3">
          
          {activeScreen === "ROADMAP" && (
            <button
              onClick={() => {
                navigateToHome();
                router.push("/");
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

          {/* Active Citizen Profile Avatar */}
          <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 text-white font-black text-xs flex items-center gap-0.5 justify-center shadow-md">
              <span>AK</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold block text-slate-200 leading-none">Anand Kumar</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <UserCheck className="w-2.5 h-2.5 inline" /> DigiLocker Verified
              </span>
            </div>
          </div>

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
    </header>
  );
};

"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Landmark,
  ShieldCheck,
  ArrowRight,
  Search,
  CheckCircle2,
  Sparkles,
  Bot,
  Layers,
  FileCheck,
  Lock,
  Clock,
  ExternalLink,
  ChevronDown,
  Star,
  Building2,
  FileText,
  Activity,
  Award,
  Zap,
  Globe2,
  TrendingUp,
  Cpu,
  UserCheck,
  X,
  Globe,
} from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { Language } from "@/types/journey";
import {
  LANDING_TRANSLATIONS,
  TRANSLATED_SERVICES,
  TRANSLATED_TESTIMONIALS,
} from "@/data/landingTranslations";

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

export default function LandingPage() {
  const router = useRouter();
  const { language, setLanguage } = useJourney();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [utidInput, setUtidInput] = useState<string>("");
  const [searchedUtid, setSearchedUtid] = useState<string | null>(null);
  const [isSearchingUtid, setIsSearchingUtid] = useState<boolean>(false);

  // Active translation dictionary
  const t = useMemo(() => {
    return LANDING_TRANSLATIONS[language] || LANDING_TRANSLATIONS.EN;
  }, [language]);

  const currentServices = useMemo(() => {
    return TRANSLATED_SERVICES[language] || TRANSLATED_SERVICES.EN;
  }, [language]);

  const currentTestimonials = useMemo(() => {
    return TRANSLATED_TESTIMONIALS[language] || TRANSLATED_TESTIMONIALS.EN;
  }, [language]);

  const currentLangObj = useMemo(() => {
    return LANGUAGE_OPTIONS.find((l) => l.id === language) || LANGUAGE_OPTIONS[0];
  }, [language]);

  const handleUtidSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utidInput.trim()) return;
    setIsSearchingUtid(true);
    setTimeout(() => {
      setSearchedUtid(utidInput.trim().toUpperCase());
      setIsSearchingUtid(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden transform-gpu">
      
      {/* BACKGROUND PARTICLES & STATIC AMBIENT GLOWS (Hardware Accelerated) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-600/12 via-indigo-600/6 to-transparent rounded-full blur-2xl transform-gpu" />
        <div className="absolute top-[40%] -left-[150px] w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-2xl transform-gpu" />
        <div className="absolute top-[65%] -right-[150px] w-[550px] h-[550px] bg-indigo-600/8 rounded-full blur-2xl transform-gpu" />
        {/* Subtle CSS-based grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "64px 64px"
          }}
        />
      </div>

      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group no-underline shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-[1.5px] shadow-lg shadow-blue-900/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Landmark className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-blue-300 transition-colors">
                  {t.brandName}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">{t.interoperabilityStatus}</span>
                  <span className="sm:hidden">Live</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-medium tracking-wide">
                {t.brandTagline}
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors cursor-pointer">{t.navHowItWorks}</a>
            <a href="#services" className="hover:text-white transition-colors cursor-pointer">{t.navServices}</a>
            <a href="#impact" className="hover:text-white transition-colors cursor-pointer">{t.navImpact}</a>
            <a href="#testimonials" className="hover:text-white transition-colors cursor-pointer">{t.navTestimonials}</a>
          </nav>

          {/* Right Action Controls: Language Switcher, Officer Portal, Launch Copilot */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Multilingual Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 border border-slate-700/80 hover:border-blue-500/80 text-slate-200 hover:text-white transition-all shadow-xs cursor-pointer"
                title="Change Platform Language"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentLangObj.native}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {isLangDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 overflow-hidden"
                  >
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider border-b border-slate-800/80 mb-1">
                      11 Official Indian Languages
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Officer Portal Link */}
            <Link
              href="/login?portal=officer"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors hidden sm:flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.officerPortalBtn}</span>
            </Link>

            {/* Launch Copilot / Dashboard CTA */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Bot className="w-4 h-4 text-blue-100" />
              <span>{t.launchCopilotBtn}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Mission, Typography, Actions, and UTID Single-Search Bar */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* SIH Hackathon & Department Identification Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-300 text-xs font-bold shadow-xs"
            >
              <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t.sihBadge}</span>
            </motion.div>

            {/* Main Punchline Hero Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]"
            >
              <span>{t.heroHeadlineMain} </span>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
                {t.heroHeadlineHighlight}
              </span>
              <br />
              <span className="text-slate-200">{t.heroHeadlineEnd}</span>
            </motion.h1>

            {/* Value Proposition Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"
            >
              {t.heroSubtitle}
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2"
            >
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-700/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{t.primaryCta}</span>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span>{t.signInBtn}</span>
              </Link>
            </motion.div>

            {/* Universal Tracking ID (UTID) Tracker Input */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="pt-4 max-w-xl mx-auto lg:mx-0"
            >
              <form onSubmit={handleUtidSearch} className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={utidInput}
                  onChange={(e) => setUtidInput(e.target.value)}
                  placeholder={t.trackPlaceholder}
                  className="w-full pl-11 pr-28 sm:pr-32 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSearchingUtid}
                  className="absolute right-2 px-3 sm:px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSearchingUtid ? t.trackSearching : t.trackButton}
                </button>
              </form>

              {/* Instant UTID Search Mock Result */}
              {searchedUtid && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3.5 rounded-2xl bg-blue-950/80 border border-blue-600/50 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">UTID: {searchedUtid}</p>
                      <p className="text-[11px] text-blue-200">Current Stage: Municipal Fire Safety NOC (Step 2/3) • SLA: 22h remaining</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="text-[11px] font-bold text-blue-300 hover:text-white underline"
                  >
                    View Roadmap →
                  </Link>
                </motion.div>
              )}
            </motion.div>

          </div>

          {/* Right Column: Live Orchestrator 3-Step Execution Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-blue-500/40 p-5 sm:p-6 shadow-2xl">
              
              {/* Card Header with Status Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-slate-200 tracking-wide">
                    {t.mockupHeader}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-700/60">
                  DAG-ORCH-2026
                </span>
              </div>

              {/* Active Step-by-Step Simulation Trail */}
              <div className="py-4 space-y-3.5">
                
                {/* Step 1: DigiLocker Verified */}
                <div className="p-3 rounded-2xl bg-slate-950/90 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{t.mockupStep1Title}</p>
                      <p className="text-[10px] text-slate-400">{t.mockupStep1Dept}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                    {t.mockupStep1Badge}
                  </span>
                </div>

                {/* Step 2: In-Progress Nodal Scrutiny */}
                <div className="p-3 rounded-2xl bg-slate-950/90 border border-blue-500/50 flex items-center justify-between gap-3 shadow-xs ring-1 ring-blue-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 animate-spin">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{t.mockupStep2Title}</p>
                      <p className="text-[10px] text-slate-400">{t.mockupStep2Dept}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-600/70">
                    {t.mockupStep2Badge}
                  </span>
                </div>

                {/* Step 3: Pending FSSAI Grant */}
                <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between gap-3 opacity-80">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-300">{t.mockupStep3Title}</p>
                      <p className="text-[10px] text-slate-500">{t.mockupStep3Dept}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {t.mockupStep3Badge}
                  </span>
                </div>

              </div>

              {/* Card Footer: SLA & Autonomous Execution Metric */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.mockupEngineStatus}: <strong className="text-emerald-300">{t.mockupNoDeadlock}</strong></span>
                </span>
                <span className="font-mono text-blue-300 font-semibold">
                  API Setu Federated
                </span>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. IMPACT & PERFORMANCE METRICS SECTION */}
      <section id="impact" className="relative z-10 border-y border-slate-800/80 bg-slate-900/50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-black tracking-widest text-blue-400 uppercase">
              {t.impactTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.impactTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              {t.impactSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Metric 1 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1 hover:border-slate-700 transition-colors">
              <p className="text-2xl sm:text-4xl font-black text-blue-400 tracking-tight">{t.stat1Value}</p>
              <p className="text-xs sm:text-sm font-bold text-white">{t.stat1Label}</p>
              <p className="text-[11px] text-slate-400">{t.stat1Sub}</p>
            </div>

            {/* Metric 2 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1 hover:border-slate-700 transition-colors">
              <p className="text-2xl sm:text-4xl font-black text-indigo-400 tracking-tight">{t.stat2Value}</p>
              <p className="text-xs sm:text-sm font-bold text-white">{t.stat2Label}</p>
              <p className="text-[11px] text-slate-400">{t.stat2Sub}</p>
            </div>

            {/* Metric 3 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1 hover:border-slate-700 transition-colors">
              <p className="text-2xl sm:text-4xl font-black text-sky-400 tracking-tight">{t.stat3Value}</p>
              <p className="text-xs sm:text-sm font-bold text-white">{t.stat3Label}</p>
              <p className="text-[11px] text-slate-400">{t.stat3Sub}</p>
            </div>

            {/* Metric 4 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1 hover:border-slate-700 transition-colors">
              <p className="text-2xl sm:text-4xl font-black text-emerald-400 tracking-tight">{t.stat4Value}</p>
              <p className="text-xs sm:text-sm font-bold text-white">{t.stat4Label}</p>
              <p className="text-[11px] text-slate-400">{t.stat4Sub}</p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (3-STEP PIPELINE) */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        <div className="text-center space-y-2 mb-12 sm:mb-16">
          <span className="text-xs font-black tracking-widest text-blue-400 uppercase">
            {t.howItWorksTag}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {t.howItWorksTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            {t.howItWorksSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Step 1 Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-blue-500/40 transition-colors relative">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-lg">
              01
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded">
                {t.step1Tag}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">{t.step1Title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {t.step1Desc}
              </p>
            </div>
          </div>

          {/* Step 2 Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-indigo-500/40 transition-colors relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-lg">
              02
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">
                {t.step2Tag}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">{t.step2Title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {t.step2Desc}
              </p>
            </div>
          </div>

          {/* Step 3 Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-colors relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg">
              03
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                {t.step3Tag}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">{t.step3Title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {t.step3Desc}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. PRE-ENGINEERED CITIZEN SERVICES (ALL 6 CARDS) */}
      <section id="services" className="relative z-10 border-t border-slate-800/80 bg-slate-950 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-black tracking-widest text-blue-400 uppercase">
                {t.servicesTag}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                {t.servicesTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1">
                {t.servicesSubtitle}
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 shrink-0"
            >
              <span>{t.viewAllJourneys}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentServices.map((srv) => (
              <div
                key={srv.id}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-700/60">
                      {srv.dept}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    UTID: {srv.utidSample}
                  </span>
                  <Link
                    href="/dashboard"
                    className="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1"
                  >
                    <span>Execute</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CITIZEN REVIEWS & TESTIMONIALS */}
      <section id="testimonials" className="relative z-10 border-t border-slate-800/80 bg-slate-900/30 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-12 sm:mb-16">
            <span className="text-xs font-black tracking-widest text-blue-400 uppercase">
              {t.testimonialsTag}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {t.testimonialsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              {t.testimonialsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {currentTestimonials.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {item.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed italic font-normal">
                    "{item.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white font-black text-xs shadow-md`}>
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-blue-500/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {t.ctaBannerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-blue-200">
              {t.ctaBannerDesc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 text-sm font-black transition-all hover:scale-[1.02] shadow-lg cursor-pointer"
            >
              {t.ctaBannerBtn}
            </Link>
            <Link
              href="/login?portal=officer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-950/80 hover:bg-blue-900 border border-blue-500/50 text-white text-sm font-bold transition-all cursor-pointer"
            >
              {t.officerPortalBtn}
            </Link>
          </div>

        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          <div className="flex items-center gap-2.5">
            <Landmark className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white">{t.brandName}</span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px]">{t.footerTagline}</span>
          </div>

          <p className="text-[11px]">
            {t.footerGovNotice}
          </p>

        </div>
      </footer>

    </div>
  );
}

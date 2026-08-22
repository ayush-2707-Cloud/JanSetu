"use client";

import React, { useState } from "react";
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
  ChevronRight,
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
} from "lucide-react";

// Testimonials modular dataset specified in requirements
const testimonials = [
  {
    name: "Vikram R.",
    role: "Cloud Kitchen Founder, Bengaluru",
    comment:
      "Cut through 4 different departmental portals for my FSSAI and trade license in under 20 minutes without paying touts.",
    rating: 5,
    tag: "MSME Food Business",
    initials: "VR",
    color: "from-blue-600 to-cyan-500",
  },
  {
    name: "Pooja Sharma",
    role: "CSC Center Operator, Pune",
    comment:
      "The UTID single-tracking feature saves me hours when answering citizen status queries across multiple departments.",
    rating: 5,
    tag: "VLE Operations",
    initials: "PS",
    color: "from-purple-600 to-pink-500",
  },
  {
    name: "Ankit Verma",
    role: "Overseas Postgrad Student",
    comment:
      "Guided me through MEA Apostille, Forex declarations, and verification step-by-step with exact document checklists.",
    rating: 5,
    tag: "Higher Education",
    initials: "AV",
    color: "from-emerald-600 to-teal-500",
  },
];

const STATS_DATA = [
  {
    value: "18,500+",
    label: "Applications Orchestrated",
    sublabel: "Cross-departmental citizen journeys completed",
    icon: Activity,
  },
  {
    value: "72%",
    label: "Reduction in Processing Delays",
    sublabel: "Deterministic prerequisite validation",
    icon: TrendingUp,
  },
  {
    value: "14+",
    label: "State & Central Portals Connected",
    sublabel: "DigiLocker, API Setu, FSSAI, MSME & Revenue",
    icon: Globe2,
  },
  {
    value: "100%",
    label: "DPDP 2025 Privacy Compliant",
    sublabel: "Zero non-consensual data retention",
    icon: Lock,
  },
];

const SERVICES_DATA = [
  {
    id: "msme",
    title: "MSME & Udyam Enterprise Setup",
    description: "PAN + Aadhaar biometric verification with automatic NIC-2008 code validation & priority bank credit.",
    dept: "Ministry of MSME",
    badge: "Fast Track (48h)",
    utidSample: "APP-2026-MSME-0841",
  },
  {
    id: "fssai",
    title: "FSSAI State & Central Food License",
    description: "Nominated FoSTaC supervisor check, water potability IS 10500 reports & commercial kitchen sanctions.",
    dept: "Food Safety & Standards (FSSAI)",
    badge: "Statutory SLA",
    utidSample: "APP-2026-FSSAI-1904",
  },
  {
    id: "land",
    title: "Agricultural Land Conversion & 7/12",
    description: "Cadastral survey verification, town planning zoning approvals & Tahsildar mutation extracts.",
    dept: "Revenue & Land Records",
    badge: "Multi-Agency",
    utidSample: "APP-2026-REV-3301",
  },
  {
    id: "education",
    title: "PM Vidyalaxmi Interest Subsidy",
    description: "Aadhaar + APAAR student ID validation with national credit portal & university admission sync.",
    dept: "Ministry of Education",
    badge: "Direct Benefit",
    utidSample: "APP-2026-EDU-6102",
  },
  {
    id: "municipal",
    title: "Municipal Trade License (BBMP / BMC / MCD)",
    description: "Property tax PID SAS receipt matching, fire NOC classification & zonal establishment sanctions.",
    dept: "Urban Local Bodies",
    badge: "Zonal Rules",
    utidSample: "APP-2026-MUNI-5590",
  },
  {
    id: "transport",
    title: "Commercial Goods Carrier & Fitness",
    description: "VAHAN chassis matching, automated emission verification & Parivahan speed governor clearances.",
    dept: "MoRTH / Parivahan",
    badge: "Instant API",
    utidSample: "APP-2026-RTO-7102",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Natural Voice / Text Intent",
    description: "Describe your real-life goal in natural English, Hindi, or Kannada. Our GovTech Copilot parses statutory dependencies into actionable steps.",
    tag: "Multilingual GenAI",
    icon: Bot,
  },
  {
    number: "02",
    title: "Deterministic Dependency Resolution",
    description: "Our statutory knowledge graph sequences all inter-department prerequisites, eliminating endless portal hopping and repeated document re-uploads.",
    tag: "DAG Engine",
    icon: Layers,
  },
  {
    number: "03",
    title: "Consent-Backed Execution & UTID Tracking",
    description: "Fetch digitally signed credentials through DigiLocker with DPDP 2025 consent, generating a Universal Tracking Identifier (UTID) for live tracking.",
    tag: "API Setu & DigiLocker",
    icon: FileCheck,
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [utidInput, setUtidInput] = useState<string>("");
  const [searchedUtid, setSearchedUtid] = useState<string | null>(null);
  const [isSearchingUtid, setIsSearchingUtid] = useState<boolean>(false);

  const handleUtidSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utidInput.trim()) return;
    setIsSearchingUtid(true);
    setTimeout(() => {
      setSearchedUtid(utidInput.trim().toUpperCase());
      setIsSearchingUtid(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Background Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[1600px] -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── 1. Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Logo & Live Status Dot */}
          <Link href="/" className="flex items-center gap-3 no-underline group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-lg shadow-blue-900/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Landmark className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">SetuJourney AI</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Interoperability Active
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">National Middleware for Statutory Approvals</p>
            </div>
          </Link>

          {/* Middle: Anchor Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors no-underline">
              How It Works
            </a>
            <a href="#services" className="hover:text-blue-400 transition-colors no-underline">
              Services
            </a>
            <a href="#impact" className="hover:text-blue-400 transition-colors no-underline">
              Impact
            </a>
            <a href="#testimonials" className="hover:text-blue-400 transition-colors no-underline">
              Testimonials
            </a>
          </nav>

          {/* Right: Officer Portal & Launch Copilot CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/login?portal=officer"
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all no-underline"
            >
              Officer Portal
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-extrabold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-102 no-underline cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Launch Copilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* ── 2. Hero Section ── */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Dual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* SIH PS Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-sm text-[11px] font-bold text-slate-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 font-extrabold">SIH 2026</span>
              <span className="text-slate-600">•</span>
              <span>Government of Maharashtra</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-blue-400">PS ID: SIH26129</span>
            </div>

            {/* Bold Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              One Platform.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                Every Government Approval.
              </span>{" "}
              Zero Bureaucracy.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              The intelligent middleware layer that connects fragmented state and central portals. Say what you want to achieve, and let our AI engine orchestrate the entire legal and approval roadmap.
            </p>

            {/* Dual CTAs */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Primary CTA */}
                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 rounded-xl font-black text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102 no-underline cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>Start Citizen Journey Roadmap</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/login"
                  className="px-5 py-3.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors flex items-center justify-center gap-2 no-underline"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Sign In / Register</span>
                </Link>
              </div>

              {/* Secondary CTA: Quick UTID Tracker */}
              <form onSubmit={handleUtidSearch} className="max-w-md">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={utidInput}
                    onChange={(e) => setUtidInput(e.target.value)}
                    placeholder="Track application by UTID (e.g. APP-2026-MSME-0841)"
                    className="w-full pl-10 pr-28 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSearchingUtid}
                    className="absolute right-1.5 px-3 py-1.5 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    {isSearchingUtid ? "Searching..." : "Track Status"}
                  </button>
                </div>
              </form>
            </div>

            {/* Quick UTID Modal / Card */}
            <AnimatePresence>
              {searchedUtid && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-slate-900 border border-blue-500/40 rounded-2xl shadow-xl relative space-y-2 max-w-md"
                >
                  <button
                    onClick={() => setSearchedUtid(null)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-400/20">
                      {searchedUtid}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      In Scrutiny Queue
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white">
                    Udyam Enterprise & Priority Credit Verification
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Stage: <strong className="text-slate-200">NIC Code & Enterprise Scrutiny</strong> • SLA Remaining: <strong className="text-emerald-400">31.5 hrs</strong>
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/dashboard"
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 no-underline"
                    >
                      <span>Open full visual journey in Dashboard</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

          {/* Right Column: Interactive Visual Mockup (3-Step Progress Bar) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="relative">
              {/* Outer Glow Ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-md opacity-30 animate-pulse" />

              {/* Floating Glassmorphic Card */}
              <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
                
                {/* Header Mockup */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] font-mono font-bold text-slate-400 ml-2">
                      Live Roadmap Orchestrator
                    </span>
                  </div>
                  <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    UTID: APP-2026-MSME
                  </span>
                </div>

                {/* 3-Step Live Progress Visualization */}
                <div className="space-y-4">
                  
                  {/* Step 1: Income Tax / PAN (Completed) */}
                  <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/40">
                          ✓
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">Step 1: Income Tax & PAN Match</h4>
                          <span className="text-[10px] text-slate-400">UIDAI / Income Tax Dept</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        DigiLocker Verified
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-full rounded-full" />
                    </div>
                  </div>

                  {/* Step 2: MSME Enterprise Classification (In Progress) */}
                  <div className="p-3.5 bg-blue-950/30 border border-blue-500/40 rounded-2xl space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-400/40 animate-spin">
                          ⚙
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">Step 2: MSME Classification</h4>
                          <span className="text-[10px] text-slate-400">Ministry of MSME • Nodal Scrutiny</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 animate-pulse">
                        Officer Scrutiny Active
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full w-2/3 rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* Step 3: FSSAI State Food License (Unlocked Next) */}
                  <div className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-2xl space-y-2 opacity-80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold border border-slate-700">
                          3
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-300">Step 3: FSSAI License Sanction</h4>
                          <span className="text-[10px] text-slate-500">Food Safety Authority (FSSAI)</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        Prerequisites Ready
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-700 h-full w-0 rounded-full" />
                    </div>
                  </div>

                </div>

                {/* Micro Footer Notice */}
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Deterministic Engine Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 inline" /> Zero Circular Deadlocks
                  </span>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 3. Live Stats & Impact Counter ("Helps We Did") ── */}
      <section id="impact" className="py-16 bg-slate-900/60 border-y border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-400/20 text-xs font-bold uppercase tracking-wider">
              Measurable Public Value Delivery
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Transforming Citizen-to-Government Engagement
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Live quantitative performance metrics across connected state and central ministries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS_DATA.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl relative overflow-hidden group hover:border-blue-500/40 transition-colors"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/15 transition-all pointer-events-none" />
                  
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-400/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <p className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
                    {stat.value}
                  </p>
                  <h3 className="text-sm font-bold text-slate-200 mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {stat.sublabel}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 4. "How It Works" (3-Step Visual Breakdown) ── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 text-xs font-bold uppercase tracking-wider">
              Architecture Workflow
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              How SetuJourney AI Orchestrates Approvals
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Three-step frictionless pipeline turning natural intent into statutory compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS_STEPS.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between space-y-6 group hover:border-indigo-500/40 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-slate-700 group-hover:text-indigo-400 transition-colors font-mono">
                        {step.number}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {step.tag}
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-400/20 flex items-center justify-center">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {step.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80">
                    <Link
                      href="/dashboard"
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 no-underline group-hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      <span>Explore this stage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 5. Connected Citizen Services Grid ── */}
      <section id="services" className="py-20 bg-slate-900/40 border-y border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-400/20 text-xs font-bold uppercase tracking-wider">
                Full Statutory Coverage
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Pre-Engineered Citizen Journeys
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Out-of-the-box workflows for life events, business incorporation, municipal permissions, and educational grants.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors flex items-center gap-2 shrink-0 self-start md:self-auto no-underline cursor-pointer"
            >
              <span>View All 14+ Journeys</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_DATA.map((svc) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-400/20">
                      {svc.dept}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {svc.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    {svc.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500">
                    UTID: {svc.utidSample}
                  </span>
                  <Link
                    href="/dashboard"
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 no-underline"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 6. Testimonials / Feedback Grid ── */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              Citizen & Operator Feedback
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Trusted by Citizens, VLEs & Business Owners
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Real-world stories from citizens accelerating clearances and avoiding bureaucratic hurdles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 hover:border-emerald-500/40 transition-colors"
              >
                <div className="space-y-4">
                  {/* Rating Stars & Department Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {test.tag}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "{test.comment}"
                  </p>
                </div>

                {/* Author Avatar & Details */}
                <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${test.color} text-white font-black text-xs flex items-center justify-center shadow-md`}>
                    {test.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{test.name}</h4>
                    <p className="text-[11px] text-slate-400">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 7. Call To Action (CTA) Banner ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-blue-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Accelerate Your Government Approvals?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Launch the citizen copilot to discover step-by-step statutory roadmaps, draft legal templates, and verify DigiLocker documents in minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-xl font-black text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105 no-underline cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Launch Dashboard & Copilot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="px-6 py-3.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors no-underline"
            >
              Sign In with DigiLocker
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. Modern Footer ── */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 sm:px-6 lg:px-8 py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Gov Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-white tracking-tight">SetuJourney AI</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Universal Citizen Middleware for cross-departmental clearances, deterministic legal dependencies, and automated officer scrutiny.
            </p>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              Smart India Hackathon 2026 • PS ID: SIH26129
            </span>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform Links</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition-colors no-underline">
                  Citizen Milestone Dashboard
                </Link>
              </li>
              <li>
                <Link href="/officer" className="hover:text-blue-400 transition-colors no-underline">
                  Officer Scrutiny Hub (Back-Office)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors no-underline">
                  Unified Authentication Portal
                </Link>
              </li>
              <li>
                <Link href="/qa" className="hover:text-blue-400 transition-colors no-underline">
                  QA Testing Checklist & Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Standards */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Statutory Standards</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="text-slate-400">Digital Personal Data Protection (DPDP) Act 2023</li>
              <li className="text-slate-400">Information Technology (IT) Act 2000 Section 43</li>
              <li className="text-slate-400">DigiLocker Consent & API Setu Interoperability</li>
              <li className="text-slate-400">WCAG 2.1 Level AA Accessibility Standards</li>
            </ul>
          </div>

          {/* Col 4: Problem Statement & Nodal Ministry */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Nodal Organization</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Developed for the Government of Maharashtra under the Smart India Hackathon initiative. Built to eliminate inter-agency silos across MSME, Food Safety, Land Revenue, and Transport.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 SetuJourney AI / JanSetu™. Powered by Next.js 14 App Router & FastAPI.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> DPDP 2025 Compliant
            </span>
            <span>•</span>
            <span>Zero Non-Consensual Data Retention</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

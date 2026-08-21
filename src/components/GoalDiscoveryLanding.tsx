"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Utensils, 
  GraduationCap, 
  Building2, 
  Landmark,
  Globe2,
  Rocket,
  BookOpen,
  Plane,
  Briefcase,
  Compass,
  MapPin,
  Filter,
  Layers,
  LayoutGrid,
  Network,
  History,
  CheckCircle2,
  Clock,
  FolderTree,
  Radar,
  Smartphone,
  MessageSquare,
} from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { translations } from "@/data/translations";
import { CascadingCategoryNav } from "@/components/CascadingCategoryNav";
import { AICopilotBar } from "@/components/AICopilotBar";
import { ManualDirectoryExplorer } from "@/components/ManualDirectoryExplorer";
import { UniversalJourney } from "@/types/journey";
import { legalDomains } from "@/data/domains";
import { aiService, GoalClassificationResult } from "@/services/api";
import { JourneyComparisonModal } from "@/components/JourneyComparisonModal";
import { EligibilityDiagnosticRadar } from "@/components/EligibilityDiagnosticRadar";
import { SMSWhatsAppDispatchModal } from "@/components/SMSWhatsAppDispatchModal";

export const GoalDiscoveryLanding: React.FC = () => {
  const {
    language,
    searchQuery,
    setSearchQuery,
    allJourneys,
    selectJourneyById,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubcategoryId,
    setSelectedSubcategoryId,
    appMode,
    setAppMode,
  } = useJourney();

  const [aiClassification, setAiClassification] = useState<GoalClassificationResult | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<"CASCADING" | "GRID">("CASCADING");
  const [recentJourneys, setRecentJourneys] = useState<UniversalJourney[]>([]);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
  const [radarJourney, setRadarJourney] = useState<UniversalJourney | null>(null);

  const toggleCompare = (journeyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForCompare((prev) => {
      if (prev.includes(journeyId)) {
        return prev.filter((id) => id !== journeyId);
      }
      if (prev.length >= 2) {
        return [prev[1], journeyId];
      }
      return [...prev, journeyId];
    });
  };

  const selectedDomainId = selectedCategoryId;
  const selectedSubcatId = selectedSubcategoryId;

  // Auto-classify natural language goals with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 6) {
      setAiClassification(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsClassifying(true);
      try {
        const res = await aiService.classifyGoal(searchQuery, language.toLowerCase());
        if (res) {
          setAiClassification(res);
        }
      } catch {
        // Fallback silently
      } finally {
        setIsClassifying(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery, language]);

  const t = (translations as Record<string, typeof translations.EN>)[language] || translations.EN;

  // Hydrate recently viewed journeys from localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("legalpath_recent_journeys");
        if (raw) {
          const ids: string[] = JSON.parse(raw);
          const matched = ids
            .map((id) => allJourneys.find((j) => j.journeyId === id))
            .filter(Boolean) as UniversalJourney[];
          setRecentJourneys(matched);
        }
      }
    } catch {
      // Ignore
    }
  }, [allJourneys]);

  // Helper icon mapper
  const getGoalIcon = (id: string) => {
    const cls = "w-5 h-5 text-white";
    switch (id) {
      case "cloud-kitchen-blr":
        return <Utensils className={cls} />;
      case "edu-loan-india":
        return <GraduationCap className={cls} />;
      case "study-abroad":
        return <Globe2 className={cls} />;
      case "startup-idea":
        return <Rocket className={cls} />;
      case "prepare-exams":
        return <BookOpen className={cls} />;
      case "open-bank-account":
        return <Landmark className={cls} />;
      case "world-tour":
        return <Plane className={cls} />;
      case "job-abroad":
        return <Briefcase className={cls} />;
      case "tourist-travel":
        return <Compass className={cls} />;
      case "tour-guide":
        return <MapPin className={cls} />;
      default:
        return <Building2 className={cls} />;
    }
  };

  // Helper aesthetic pebble gradient calculator
  const getGoalPebbleGradient = (journey: UniversalJourney) => {
    const cat = (journey.category || "").toLowerCase();
    const id = journey.journeyId.toLowerCase();
    if (cat.includes("travel") || cat.includes("tour") || id.includes("world") || id.includes("travel") || id.includes("passport")) {
      return "from-sky-400 via-cyan-500 to-blue-600 shadow-sky-500/25";
    }
    if (cat.includes("civic") || cat.includes("identity") || id.includes("aadhaar") || id.includes("voter") || id.includes("caste")) {
      return "from-teal-500 via-emerald-500 to-cyan-600 shadow-teal-500/25";
    }
    if (cat.includes("property") || cat.includes("real estate") || id.includes("flat") || id.includes("rera") || id.includes("mutation")) {
      return "from-amber-500 via-orange-500 to-rose-500 shadow-amber-500/25";
    }
    if (cat.includes("finance") || cat.includes("bank") || id.includes("bank") || id.includes("pan") || id.includes("itr") || id.includes("nps")) {
      return "from-violet-500 via-purple-500 to-fuchsia-600 shadow-violet-500/25";
    }
    if (cat.includes("education") || cat.includes("loan") || id.includes("edu") || id.includes("study") || id.includes("exam")) {
      return "from-blue-500 via-indigo-500 to-violet-600 shadow-blue-500/25";
    }
    return "from-emerald-500 via-teal-500 to-cyan-600 shadow-emerald-500/25";
  };

  // Helper difficulty calculator
  const getJourneyDifficulty = (journey: UniversalJourney) => {
    const hasPhysical = journey.steps.some(
      (s) => !s.instructions?.actionUrl || s.category?.toLowerCase().includes("physical")
    );
    if (journey.steps.length <= 3 && !hasPhysical) {
      return {
        label: "Easy",
        dot: "bg-emerald-500",
        pill: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
      };
    } else if (journey.steps.length <= 5) {
      return {
        label: "Moderate",
        dot: "bg-amber-500",
        pill: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      };
    } else {
      return {
        label: "Complex",
        dot: "bg-rose-500",
        pill: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
      };
    }
  };

  const activeDomainObj = legalDomains.find((d) => d.id === selectedDomainId);
  const availableSubcats = activeDomainObj ? activeDomainObj.subcategories : [];

  const handleSelectDomain = (domainId: string) => {
    setSelectedCategoryId(domainId);
    setSelectedSubcategoryId("ALL");
  };

  const handleSelectSubcat = (subcatId: string) => {
    setSelectedSubcategoryId(subcatId);
  };

  // Filter journeys dynamically based on parent domain, sub-division, and search query
  const filteredJourneys = allJourneys.filter((j) => {
    const matchesDomain = selectedDomainId === "ALL" || j.domainId === selectedDomainId;
    const matchesSubcat = selectedSubcatId === "ALL" || j.subcategoryId === selectedSubcatId;

    if (!searchQuery.trim()) return matchesDomain && matchesSubcat;

    const q = searchQuery.toLowerCase();
    const matchesQuery =
      j.title.toLowerCase().includes(q) ||
      (j.titleHi && j.titleHi.toLowerCase().includes(q)) ||
      (j.titleKn && j.titleKn.toLowerCase().includes(q)) ||
      j.description.toLowerCase().includes(q) ||
      (j.descriptionHi && j.descriptionHi.toLowerCase().includes(q)) ||
      (j.descriptionKn && j.descriptionKn.toLowerCase().includes(q)) ||
      j.department.toLowerCase().includes(q) ||
      j.category.toLowerCase().includes(q);

    return matchesDomain && matchesSubcat && matchesQuery;
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      
      {/* Centered Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
          <span>GovTech AI Universal Journey Engine v2.5</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {t.heroTitle}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {t.heroSub}
        </p>

        {/* Dual-Mode In-Page Switcher */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl shadow-inner text-xs">
            <button
              type="button"
              onClick={() => setAppMode("AI_COPILOT")}
              className={`px-4 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                appMode === "AI_COPILOT"
                  ? "bg-blue-600 text-white shadow-md scale-102"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span>AI Autonomous Copilot</span>
            </button>

            <button
              type="button"
              onClick={() => setAppMode("MANUAL_DIRECTORY")}
              className={`px-4 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                appMode === "MANUAL_DIRECTORY"
                  ? "bg-blue-600 text-white shadow-md scale-102"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FolderTree className="w-4 h-4 text-blue-300" />
              <span>Manual Directory Explorer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 2: Manual Directory Mode Explorer */}
      {appMode === "MANUAL_DIRECTORY" ? (
        <ManualDirectoryExplorer />
      ) : (
        /* Mode 1: AI Copilot & Interactive Roadmaps */
        <div className="space-y-8">
          {/* Hero Copilot Bar */}
          <AICopilotBar />

          {/* Quick-Start Goal Chips */}
          <div className="pt-3 flex flex-col items-center space-y-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.quickStartLabel}
            </span>

            <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
              {[
                { id: "startup-idea", label: "Startup Launch", icon: Rocket, color: "bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800" },
                { id: "cloud-kitchen-blr", label: "Cloud Kitchen", icon: Utensils, color: "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800" },
                { id: "study-abroad", label: "Study Abroad", icon: Globe2, color: "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800" },
                { id: "edu-loan-india", label: "PM-Vidyalaxmi Loan", icon: GraduationCap, color: "bg-blue-50 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-800" },
                { id: "prepare-exams", label: "Exam Prep", icon: BookOpen, color: "bg-purple-50 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-800" },
                { id: "open-bank-account", label: "Bank Account", icon: Landmark, color: "bg-violet-50 dark:bg-violet-950/80 text-violet-900 dark:text-violet-200 border-violet-300 dark:border-violet-800" },
                { id: "world-tour", label: "World Tour", icon: Plane, color: "bg-sky-50 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-800" },
                { id: "job-abroad", label: "Job Overseas", icon: Briefcase, color: "bg-teal-50 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-800" },
              ].map((chip) => {
                const Icon = chip.icon;
                return (
                  <button
                    key={chip.id}
                    onClick={() => selectJourneyById(chip.id)}
                    className={`inline-flex items-center gap-1.5 border font-bold text-xs py-2 px-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xs ${chip.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick GovTech Sandbox Dispatch Tool Pill */}
            <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsSMSModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold transition-all shadow-xs hover:scale-102 cursor-pointer"
                title="Simulate official C-DAC e-Pramaan SMS and Meta WhatsApp Business statutory alerts"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>📲 SMS & WhatsApp Dispatch Sandbox</span>
              </button>
            </div>
          </div>

          {/* Recently Viewed Journeys Section */}
          {recentJourneys.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Continue Where You Left Off ({recentJourneys.length})
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Recently active roadmaps</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentJourneys.slice(0, 3).map((rj) => {
                  const completedCount = rj.steps.filter((s) => s.status === "COMPLETED").length;
                  const pct = Math.round((completedCount / rj.steps.length) * 100);

                  return (
                    <div
                      key={rj.journeyId}
                      onClick={() => selectJourneyById(rj.journeyId)}
                      className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/70 dark:bg-slate-950/60 cursor-pointer transition-all hover:shadow-xs"
                    >
                      <div className="space-y-1 min-w-0 pr-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {rj.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {completedCount}/{rj.steps.length} Steps
                          </span>
                          <span>•</span>
                          <span>{pct}% Completed</span>
                        </div>
                      </div>
                      <button className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

      {/* Explorer Mode Toggle */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-3 pt-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Explore Statutory Goal Roadmaps
          </h2>
        </div>

        {/* View Switcher Pill */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveViewMode("CASCADING")}
            className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-bold text-xs transition-all ${
              activeViewMode === "CASCADING"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Cascading Tree Explorer</span>
          </button>

          <button
            onClick={() => setActiveViewMode("GRID")}
            className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-bold text-xs transition-all ${
              activeViewMode === "GRID"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Roadmaps Grid ({allJourneys.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area Based on Mode */}
      {activeViewMode === "CASCADING" ? (
        <CascadingCategoryNav onSelectJourney={(id) => selectJourneyById(id)} />
      ) : (
        <div className="space-y-4 pt-2">
          {/* 1. Parent Category Selector Tabs */}
          <div className="flex items-center justify-between pb-1 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                1. Category:
              </span>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 max-w-full">
              <button
                onClick={() => handleSelectDomain("ALL")}
                className={`py-1.5 px-3 rounded-lg font-bold text-xs whitespace-nowrap transition-all ${
                  selectedDomainId === "ALL"
                    ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                All Categories ({allJourneys.length})
              </button>
              {legalDomains.map((domain) => {
                const count = allJourneys.filter((j) => j.domainId === domain.id).length;
                const isSelected = selectedDomainId === domain.id;
                return (
                  <button
                    key={domain.id}
                    onClick={() => handleSelectDomain(domain.id)}
                    className={`py-1.5 px-3 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <span>{domain.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Dependent Sub-Category Filter Pills (shown when a Category is selected) */}
          {selectedDomainId !== "ALL" && availableSubcats.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 p-2.5 rounded-2xl animate-in fade-in duration-200">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-800 dark:text-blue-300 pl-1 shrink-0">
                2. Sub-Category:
              </span>
              <button
                onClick={() => handleSelectSubcat("ALL")}
                className={`py-1 px-3 rounded-xl font-bold text-xs transition-all ${
                  selectedSubcatId === "ALL"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400"
                }`}
              >
                All Sub-Categories ({allJourneys.filter((j) => j.domainId === selectedDomainId).length})
              </button>
              {availableSubcats.map((subcat) => {
                const isSubSelected = selectedSubcatId === subcat.id;
                const subCount = allJourneys.filter((j) => j.domainId === selectedDomainId && j.subcategoryId === subcat.id).length;
                return (
                  <button
                    key={subcat.id}
                    onClick={() => handleSelectSubcat(subcat.id)}
                    className={`py-1 px-3 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                      isSubSelected
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400"
                    }`}
                  >
                    <span>{subcat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSubSelected ? "bg-blue-700 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                      {subCount}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Filter Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {filteredJourneys.length} {filteredJourneys.length === 1 ? "Roadmap" : "Roadmaps"} Available
              </span>
              {selectedDomainId !== "ALL" && (
                <span className="text-blue-600 dark:text-blue-400">
                  in {activeDomainObj?.name} {selectedSubcatId !== "ALL" ? `→ ${availableSubcats.find(s => s.id === selectedSubcatId)?.name}` : ""}
                </span>
              )}
            </div>
            {(selectedDomainId !== "ALL" || selectedSubcatId !== "ALL") && (
              <button
                onClick={() => {
                  setSelectedCategoryId("ALL");
                  setSelectedSubcategoryId("ALL");
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Goal Cards Grid with Skeleton Loading State */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {isClassifying ? (
              // Skeleton Loading Cards
              [1, 2, 3, 4, 5, 6].map((sk) => (
                <div
                  key={`skeleton-${sk}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs animate-pulse flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                      <div className="w-20 h-5 rounded-full bg-slate-200 dark:bg-slate-800" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="w-16 h-3 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="w-3/4 h-5 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                    <div className="w-full h-8 rounded bg-slate-100 dark:bg-slate-850" />
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="w-24 h-4 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              ))
            ) : filteredJourneys.length === 0 ? (
              <div className="col-span-full py-12 text-center space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No statutory roadmaps found matching your current filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId("ALL");
                    setSelectedSubcategoryId("ALL");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredJourneys.map((journey) => {
                const localizedTitle =
                  language === "HI" && journey.titleHi
                    ? journey.titleHi
                    : language === "KN" && journey.titleKn
                    ? journey.titleKn
                    : journey.title;

                const localizedDesc =
                  language === "HI" && journey.descriptionHi
                    ? journey.descriptionHi
                    : language === "KN" && journey.descriptionKn
                    ? journey.descriptionKn
                    : journey.description;

                const diff = getJourneyDifficulty(journey);

                return (
                  <div
                    key={journey.journeyId}
                    onClick={() => selectJourneyById(journey.journeyId)}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-5 shadow-gov-card hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${getGoalPebbleGradient(journey)} text-white shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-200 shrink-0`}>
                          {getGoalIcon(journey.journeyId)}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={(e) => toggleCompare(journey.journeyId, e)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                              selectedForCompare.includes(journey.journeyId)
                                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                            }`}
                            title="Select to compare side-by-side"
                          >
                            {selectedForCompare.includes(journey.journeyId) ? "✓ Compared" : "+ Compare"}
                          </button>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${diff.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                            {diff.label}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full">
                            {journey.agencyCode}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                          {journey.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-0.5">
                          {localizedTitle}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {localizedDesc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{journey.steps.length} Steps</span>
                        <span>•</span>
                        <span>{journey.estimatedDuration}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRadarJourney(journey);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 font-bold text-[11px] transition-all cursor-pointer"
                          title="Run 30-second prerequisite diagnostic audit"
                        >
                          <Radar className="w-3 h-3 text-indigo-500" />
                          <span>Audit</span>
                        </button>

                        <button className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 font-bold group-hover:translate-x-1 transition-all text-xs cursor-pointer">
                          <span>View Roadmap</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
        </div>
      )}

      {/* Floating Comparison Bar (when journeys are selected for comparison) */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span className="font-bold">
              {selectedForCompare.length === 1 ? "1 Roadmap Selected" : "2 Roadmaps Selected"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedForCompare.length === 2 ? (
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Compare Side-by-Side</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-[11px] text-slate-400">
                Select 1 more roadmap to compare
              </span>
            )}

            <button
              type="button"
              onClick={() => setSelectedForCompare([])}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      <JourneyComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        journeyA={allJourneys.find((j) => j.journeyId === selectedForCompare[0]) || null}
        journeyB={allJourneys.find((j) => j.journeyId === selectedForCompare[1]) || null}
        onSelectJourney={selectJourneyById}
        language={language}
      />

      {/* Eligibility Diagnostic Radar Modal */}
      <EligibilityDiagnosticRadar
        isOpen={radarJourney !== null}
        onClose={() => setRadarJourney(null)}
        journey={radarJourney}
        onStartJourney={() => {
          if (radarJourney) {
            selectJourneyById(radarJourney.journeyId);
          }
        }}
        language={language}
      />

      {/* SMS & WhatsApp Dispatch Sandbox Modal */}
      <SMSWhatsAppDispatchModal
        isOpen={isSMSModalOpen}
        onClose={() => setIsSMSModalOpen(false)}
      />

    </div>
  );
};

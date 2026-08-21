"use client";

import React, { useState, useMemo } from "react";
import {
  FolderTree,
  Search,
  Building2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  FileText,
  Clock,
  ShieldCheck,
  Tag,
  Filter,
  Layers,
  ArrowRight,
  Download,
  CheckCircle2,
  Landmark,
  GraduationCap,
  Briefcase,
  Utensils,
  Globe2,
} from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { UniversalJourney } from "@/types/journey";
import { legalDomains } from "@/data/domains";

interface ManualDirectoryProps {
  className?: string;
}

export const ManualDirectoryExplorer: React.FC<ManualDirectoryProps> = ({ className = "" }) => {
  const {
    allJourneys,
    selectJourneyById,
    language,
    selectedCategoryId,
    setSelectedCategoryId,
  } = useJourney();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<"ALL" | "CENTRAL" | "STATE">("ALL");
  const [selectedTag, setSelectedTag] = useState<"ALL" | "MSME" | "STUDENT" | "WELFARE" | "LEGAL">("ALL");
  const [expandedJourneyId, setExpandedJourneyId] = useState<string | null>(null);

  // Filtered journeys based on category, subcategory, jurisdiction, tag, and search query
  const [selectedSubcat, setSelectedSubcat] = useState<string>("ALL");

  // Get subcategories for current domain
  const activeDomain = useMemo(() => {
    return legalDomains.find((d) => d.id === selectedCategoryId) || null;
  }, [selectedCategoryId]);

  const filteredJourneys = useMemo(() => {
    return allJourneys.filter((journey) => {
      // 1. Level 1: Domain Category filter
      if (selectedCategoryId !== "ALL" && journey.domainId !== selectedCategoryId) {
        return false;
      }

      // 2. Level 2: Sub-Category filter
      if (selectedSubcat !== "ALL" && journey.subcategoryId !== selectedSubcat) {
        return false;
      }

      // 3. Level 3: Jurisdiction filter (Central vs State)
      if (selectedJurisdiction === "CENTRAL") {
        if (journey.jurisdiction && journey.jurisdiction.toLowerCase().includes("state")) return false;
      } else if (selectedJurisdiction === "STATE") {
        if (journey.jurisdiction && !journey.jurisdiction.toLowerCase().includes("state") && !journey.jurisdiction.toLowerCase().includes("karnataka")) {
          return false;
        }
      }

      // 4. User Group Tag filter
      if (selectedTag === "MSME") {
        if (!journey.category.toLowerCase().includes("business") && !journey.category.toLowerCase().includes("msme")) return false;
      } else if (selectedTag === "STUDENT") {
        if (!journey.category.toLowerCase().includes("education") && !journey.category.toLowerCase().includes("student")) return false;
      } else if (selectedTag === "WELFARE") {
        if (!journey.category.toLowerCase().includes("welfare") && !journey.category.toLowerCase().includes("citizen")) return false;
      } else if (selectedTag === "LEGAL") {
        if (!journey.category.toLowerCase().includes("legal") && !journey.category.toLowerCase().includes("passport") && !journey.category.toLowerCase().includes("property")) return false;
      }

      // 5. Text search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = journey.title.toLowerCase().includes(q);
        const matchesDesc = journey.description.toLowerCase().includes(q);
        const matchesDept = journey.department.toLowerCase().includes(q);
        const matchesSteps = journey.steps.some(
          (s) => s.title.toLowerCase().includes(q) || s.instructions?.summary?.toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesDesc && !matchesDept && !matchesSteps) return false;
      }

      return true;
    });
  }, [allJourneys, selectedCategoryId, selectedSubcat, selectedJurisdiction, selectedTag, searchQuery]);

  const toggleExpand = (journeyId: string) => {
    setExpandedJourneyId((prev) => (prev === journeyId ? null : journeyId));
  };

  return (
    <div className={`w-full max-w-5xl mx-auto space-y-6 ${className}`}>
      {/* Top Banner: Directory Overview & 3-Tier Hierarchy Explorer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-xl">
                <FolderTree className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Hierarchical Statutory Directory Explorer
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Multi-tiered taxonomy: <span className="font-semibold text-blue-600 dark:text-blue-400">Level 1: Domain</span> → <span className="font-semibold text-indigo-600 dark:text-indigo-400">Level 2: Sub-Category</span> → <span className="font-semibold text-emerald-600 dark:text-emerald-400">Level 3: Jurisdiction</span>
            </p>
          </div>

          {/* Direct Search Filter Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes, acts, and ministries..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 3-Tier Multi-Level Filtering Ribbon */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
          {/* Level 1: Domain Category Ribbon */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>Level 1: Domain</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => {
                  setSelectedCategoryId("ALL");
                  setSelectedSubcat("ALL");
                }}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  selectedCategoryId === "ALL"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                All Domains ({allJourneys.length})
              </button>
              {legalDomains.map((domain) => {
                const count = allJourneys.filter((j) => j.domainId === domain.id).length;
                return (
                  <button
                    key={domain.id}
                    onClick={() => {
                      setSelectedCategoryId(domain.id);
                      setSelectedSubcat("ALL");
                    }}
                    className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                      selectedCategoryId === domain.id
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    <span>{domain.name}</span>
                    {count > 0 && <span className="ml-1 opacity-75">({count})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level 2: Sub-Category Filter (When Domain is selected) */}
          {activeDomain && activeDomain.subcategories && activeDomain.subcategories.length > 0 && (
            <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                <Tag className="w-3 h-3 text-indigo-500" />
                <span>Level 2: Sub-Category ({activeDomain.name})</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => setSelectedSubcat("ALL")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedSubcat === "ALL"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white"
                  }`}
                >
                  All Sub-Categories
                </button>
                {activeDomain.subcategories.map((subcat) => (
                  <button
                    key={subcat.id}
                    onClick={() => setSelectedSubcat(subcat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedSubcat === subcat.id
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white"
                    }`}
                  >
                    {subcat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Level 3: Jurisdiction Ribbon */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/60 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                <Landmark className="w-3 h-3" />
                Level 3: Jurisdiction:
              </span>
              <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg flex items-center text-[11px] font-bold">
                {[
                  { id: "ALL", label: "All Jurisdictions" },
                  { id: "CENTRAL", label: "Central / Union" },
                  { id: "STATE", label: "State (e.g. Karnataka)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedJurisdiction(item.id as any)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      selectedJurisdiction === item.id
                        ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs font-extrabold"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Persona / Citizen Group Tag */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Target Persona:
              </span>
              <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg flex items-center text-[11px] font-bold">
                {[
                  { id: "ALL", label: "All" },
                  { id: "MSME", label: "MSME / Founder" },
                  { id: "STUDENT", label: "Student" },
                  { id: "WELFARE", label: "Citizen" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTag(item.id as any)}
                    className={`px-2 py-1 rounded-md transition-all ${
                      selectedTag === item.id
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-extrabold"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Results List */}
      <div className="space-y-3">
        {filteredJourneys.length > 0 ? (
          filteredJourneys.map((journey) => {
            const isExpanded = expandedJourneyId === journey.journeyId;
            return (
              <div
                key={journey.journeyId}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:border-blue-300 dark:hover:border-slate-700 transition-all"
              >
                {/* Accordion Row Header */}
                <div
                  onClick={() => toggleExpand(journey.journeyId)}
                  className="p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                          {journey.agencyCode}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                          {journey.category}
                        </span>
                        {journey.jurisdiction && (
                          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            {journey.jurisdiction}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                        {journey.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {journey.department} • {journey.description}
                      </p>

                      {/* Milestone Procedural Pipeline Flow */}
                      {journey.steps && journey.steps.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Pipeline Flow:
                          </span>
                          {journey.steps.slice(0, 4).map((s, idx) => (
                            <React.Fragment key={s.id}>
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 truncate max-w-[160px]">
                                {s.title}
                              </span>
                              {idx < Math.min(journey.steps.length, 4) - 1 && (
                                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        {journey.steps.length} Milestones
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {journey.estimatedDuration || "Statutory Roadmap"}
                      </span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Accordion Milestone Checklist & Official Links */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-4 animate-in fade-in duration-150">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <span>Step-by-Step Procedural Breakdown:</span>
                      </h4>

                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                        {journey.steps.map((step, sIdx) => (
                          <div
                            key={step.id}
                            className="p-3 flex items-start justify-between gap-3 text-xs"
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                                  {step.title}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                                  {step.instructions?.summary || "Statutory procedural stage"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {step.instructions?.fee && (
                                <span className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                                  Fee: {step.instructions.fee}
                                </span>
                              )}
                              {step.instructions?.actionUrl && (
                                <a
                                  href={step.instructions.actionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span>Official Portal</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Launch Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Grounded on verified .gov.in gazette mandates
                      </span>

                      <button
                        onClick={() => selectJourneyById(journey.journeyId)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                      >
                        <span>Open Interactive Roadmap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
            <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No statutory roadmaps found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your category or jurisdiction filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

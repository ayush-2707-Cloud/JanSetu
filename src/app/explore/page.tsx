"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  ArrowRight,
  FolderTree,
  Scale,
  Building2,
  GraduationCap,
  Landmark,
  Shield,
  BookOpen,
  ArrowLeft,
  Layers,
  Sparkles,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { GovTechHeader } from "@/components/GovTechHeader";
import { legalDomains } from "@/data/domains";
import { useJourney } from "@/context/JourneyContext";

const SECTOR_CATEGORIES = [
  { id: "ALL", label: "All Sectors" },
  { id: "business", label: "🏢 Business & MSME" },
  { id: "property", label: "🏠 Property & Municipal" },
  { id: "identity", label: "🛡️ Legal & Identity" },
  { id: "agriculture", label: "🌾 Agriculture & Agritech" },
  { id: "education", label: "🎓 Education & Scholarships" },
  { id: "healthcare", label: "🏥 Healthcare & Clinical" },
];

export default function ExplorePage() {
  const { allJourneys, selectJourneyById, language } = useJourney();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);

  // Filtered Domains based on category and search query
  const filteredDomains = useMemo(() => {
    return legalDomains.filter((d) => {
      // Sector filter
      const matchesCategory =
        selectedCategory === "ALL" ||
        d.id.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        d.name.toLowerCase().includes(selectedCategory.toLowerCase());

      // Search term filter
      const query = searchTerm.toLowerCase().trim();
      const matchesQuery =
        !query ||
        d.name.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.subcategories.some(
          (sub) =>
            sub.name.toLowerCase().includes(query) ||
            (sub.activities || []).some((act) => act.name.toLowerCase().includes(query) || act.description?.toLowerCase().includes(query))
        );

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchTerm]);

  const activeDomain = legalDomains.find((d) => d.id === selectedDomainId) || null;

  // Compute total accessible activities
  const totalActivitiesCount = useMemo(() => {
    return legalDomains.reduce(
      (acc, d) => acc + d.subcategories.reduce((sAcc, sub) => sAcc + (sub.activities || []).length, 0),
      0
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <GovTechHeader />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Page Hero Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span>Domain Explorer</span>
          </div>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                <Compass className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                <span>Statutory Compliance & Domain Directory</span>
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
                Explore all foundational Indian regulatory domains, statutory subcategories, and step-by-step procedural blueprints codified under central and state legislation.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 text-xs shadow-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Domains:</span>
                <span className="font-bold text-slate-900 dark:text-white">{legalDomains.length} Active</span>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px]">Workflows:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{totalActivitiesCount} Blueprints</span>
              </div>
            </div>
          </div>

          {/* Controls: Search Bar & Sector Filter Pills */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search domains, licenses, acts (e.g., 'FSSAI', 'RTI', 'Lease', 'GST')..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden shadow-xs"
              />
            </div>

            {/* Quick Domain Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedDomainId || ""}
                onChange={(e) => setSelectedDomainId(e.target.value || null)}
                className="px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden shadow-xs cursor-pointer"
              >
                <option value="">Jump to Domain Workflows...</option>
                {legalDomains.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.subcategories.length} subcategories)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sector Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {SECTOR_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Domain Grid Cards */}
        {filteredDomains.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Compass className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Domains Match Your Filter</h3>
            <p className="text-xs text-slate-500">Try adjusting your keyword search or sector category filter.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("ALL");
              }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDomains.map((domain) => {
              const isSelected = selectedDomainId === domain.id;
              const subCount = domain.subcategories.length;
              const actCount = domain.subcategories.reduce((acc, sub) => acc + (sub.activities || []).length, 0);

              return (
                <div
                  key={domain.id}
                  onClick={() => setSelectedDomainId(isSelected ? null : domain.id)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? "bg-blue-50/50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-xl"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 shadow-gov-card hover:shadow-lg"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md">
                        <Scale className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {subCount} Subcategories
                        </span>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {actCount} Workflows
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {domain.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {domain.description}
                      </p>
                    </div>
                  </div>

                  {/* Subcategory List Preview */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
                    {domain.subcategories.slice(0, 3).map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-0.5">
                        <span className="truncate max-w-[200px] font-medium">• {sub.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{(sub.activities || []).length} steps</span>
                      </div>
                    ))}
                    {domain.subcategories.length > 3 && (
                      <span className="text-[10px] text-slate-400 italic block">
                        +{domain.subcategories.length - 3} more subcategories
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {isSelected ? "Hide Activities ▲" : "Explore Workflows ▼"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Domain Expanded Activity Drawer / Matrix */}
        {activeDomain && (
          <div className="p-6 bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 rounded-3xl shadow-xl space-y-6 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  Active Domain Matrix
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {activeDomain.name} — Statutory Procedural Workflows
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDomainId(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Close Matrix
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeDomain.subcategories.flatMap((sub) =>
                (sub.activities || []).map((activity) => {
                  const targetJourney = allJourneys.find(
                    (j) => j.journeyId === activity.journeyId || j.category.includes(sub.id)
                  ) || allJourneys[0];

                  return (
                    <div
                      key={activity.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 flex flex-col justify-between hover:border-blue-400 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                            {sub.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {activity.estimatedDuration || "3–7 Days"}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs mt-1">
                          {activity.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Govt Verified</span>
                        </span>
                        <Link
                          href={`/journey/${targetJourney.journeyId}`}
                          onClick={() => selectJourneyById(targetJourney.journeyId)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800"
                        >
                          <span>Launch Roadmap</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}


"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  Building2,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Shield,
  FileText,
} from "lucide-react";
import { GovTechHeader } from "@/components/GovTechHeader";
import { useJourney } from "@/context/JourneyContext";
import { UniversalJourney } from "@/types/journey";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const { allJourneys, selectJourneyById, language } = useJourney();
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedAgency, setSelectedAgency] = useState<string>("ALL");

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const categories = Array.from(new Set(allJourneys.map((j) => j.category)));
  const agencies = Array.from(new Set(allJourneys.map((j) => j.agencyCode)));

  const filteredResults = allJourneys.filter((journey) => {
    const matchesQuery =
      query.trim() === "" ||
      journey.title.toLowerCase().includes(query.toLowerCase()) ||
      journey.description.toLowerCase().includes(query.toLowerCase()) ||
      journey.agencyCode.toLowerCase().includes(query.toLowerCase()) ||
      journey.steps.some(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.description.toLowerCase().includes(query.toLowerCase())
      );

    const matchesCat = selectedCategory === "ALL" || journey.category === selectedCategory;
    const matchesAgency = selectedAgency === "ALL" || journey.agencyCode === selectedAgency;

    return matchesQuery && matchesCat && matchesAgency;
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
          <Link href="/" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span>Search Roadmaps</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Search className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>Statutory Search & Compliance Directory</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          Search across 100+ government procedural steps, mandatory affidavits, official .gov.in portals, and nodal authority deadlines.
        </p>
      </div>

      {/* Search Inputs & Filter Chips */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, forms, acts, or departments (e.g. 'FSSAI License', 'Form B', 'RTI', 'LLP')..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500">Authority / Agency:</span>
            <select
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs"
            >
              <option value="ALL">All Authorities</option>
              {agencies.map((agency) => (
                <option key={agency} value={agency}>
                  {agency}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-400 font-mono text-[11px] ml-auto">
            {filteredResults.length} roadmaps found
          </span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 w-12 h-12 mx-auto flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No statutory roadmaps match &quot;{query}&quot;
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try searching with broader terms like &quot;Food&quot;, &quot;Loan&quot;, &quot;Startup&quot;, &quot;Lease&quot;, or browse the Domain Explorer.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Go to Domain Explorer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResults.map((journey) => (
              <div
                key={journey.journeyId}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border border-blue-200 px-2 py-0.5 rounded-full">
                      {journey.agencyCode}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {journey.steps.length} Steps • {journey.estimatedDuration}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {journey.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {journey.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Category: {journey.category}
                  </span>

                  <Link
                    href={`/journey/${journey.journeyId}`}
                    onClick={() => selectJourneyById(journey.journeyId)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <span>View Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <GovTechHeader />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="text-center py-16">Loading Search Engine...</div>}>
          <SearchContent />
        </Suspense>
      </main>
    </div>
  );
}

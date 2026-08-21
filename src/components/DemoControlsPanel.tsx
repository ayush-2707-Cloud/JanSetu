"use client";

import React from "react";
import { Sliders, RefreshCw, Layers, Filter } from "lucide-react";
import { StepStatus } from "@/types/journey";
import { useJourney } from "@/context/JourneyContext";

import { legalDomains } from "@/data/domains";

interface DemoControlsPanelProps {
  currentDatasetKey: string;
  onSelectDataset: (key: string) => void;
  filterStatus: StepStatus | "ALL";
  onSetFilter: (status: StepStatus | "ALL") => void;
  onToggleStepStatus?: (stepId: string, newStatus: StepStatus) => void;
  onReset: () => void;
  stepList: { id: string; title: string; status: StepStatus }[];
}

export const DemoControlsPanel: React.FC<DemoControlsPanelProps> = ({
  currentDatasetKey,
  onSelectDataset,
  filterStatus,
  onSetFilter,
  onToggleStepStatus,
  onReset,
  stepList,
}) => {
  const { 
    allJourneys, 
    selectedCategoryId, 
    setSelectedCategoryId, 
    selectedSubcategoryId, 
    setSelectedSubcategoryId 
  } = useJourney();

  const selectedDomainId = selectedCategoryId;
  const selectedSubcatId = selectedSubcategoryId;

  const currentJourney = allJourneys.find((j) => j.journeyId === currentDatasetKey);

  const activeDomainObj = legalDomains.find((d) => d.id === selectedDomainId);
  const availableSubcats = activeDomainObj ? activeDomainObj.subcategories : [];

  const availableJourneys = allJourneys.filter((j) => {
    const matchesDomain = selectedDomainId === "ALL" || j.domainId === selectedDomainId;
    const matchesSubcat = selectedSubcatId === "ALL" || j.subcategoryId === selectedSubcatId;
    return matchesDomain && matchesSubcat;
  });

  const handleDomainChange = (domainId: string) => {
    setSelectedCategoryId(domainId);
    setSelectedSubcategoryId("ALL");
    const matching = allJourneys.filter((j) => domainId === "ALL" || j.domainId === domainId);
    if (matching.length > 0 && !matching.some((m) => m.journeyId === currentDatasetKey)) {
      onSelectDataset(matching[0].journeyId);
    }
  };

  const handleSubcatChange = (subcatId: string) => {
    setSelectedSubcategoryId(subcatId);
    const matching = allJourneys.filter(
      (j) =>
        (selectedDomainId === "ALL" || j.domainId === selectedDomainId) &&
        (subcatId === "ALL" || j.subcategoryId === subcatId)
    );
    if (matching.length > 0 && !matching.some((m) => m.journeyId === currentDatasetKey)) {
      onSelectDataset(matching[0].journeyId);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-gov-card space-y-5 transition-colors">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Interactive Component Sandbox</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Test dataset schemas, step status transitions, and dynamic filters live</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Demo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        
        {/* Category Selector */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>1. Category</span>
          </label>
          <select
            value={selectedDomainId}
            onChange={(e) => handleDomainChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories ({legalDomains.length})</option>
            {legalDomains.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub-Category Selector */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>2. Sub-Category</span>
          </label>
          <select
            value={selectedSubcatId}
            onChange={(e) => handleSubcatChange(e.target.value)}
            disabled={selectedDomainId === "ALL" || availableSubcats.length === 0}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="ALL">
              {selectedDomainId === "ALL" ? "Select a category first" : `All Sub-Categories (${availableSubcats.length})`}
            </option>
            {availableSubcats.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dependent Universal Journey Goal Dataset Selector */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>3. Roadmap Dataset</span>
          </label>
          <select
            value={currentDatasetKey}
            onChange={(e) => onSelectDataset(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            {availableJourneys.length === 0 ? (
              <option value="">No roadmaps under this selection</option>
            ) : (
              availableJourneys.map((j) => (
                <option key={j.journeyId} value={j.journeyId}>
                  {j.title} ({j.steps.length} Steps)
                </option>
              ))
            )}
          </select>
        </div>

      </div>

      {/* Filter by Status & Quick Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
        {/* Filter by Status */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Filter Roadmap Step View</span>
          </label>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {(["ALL", "COMPLETED", "IN_PROGRESS", "LOCKED"] as const).map((st) => (
              <button
                key={st}
                onClick={() => onSetFilter(st)}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all ${
                  filterStatus === st
                    ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {st === "ALL" ? "All" : st === "IN_PROGRESS" ? "Active" : st}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Live Step Status Toggle Simulator */}
      {onToggleStepStatus && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Live Step State Manipulator (Simulate Portal Progression)
          </span>
          <div className="flex flex-wrap gap-2">
            {stepList.map((st) => (
              <div key={st.id} className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 max-w-[120px] truncate">{st.title}</span>
                <select
                  value={st.status}
                  onChange={(e) => onToggleStepStatus(st.id, e.target.value as StepStatus)}
                  className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-[10px] font-bold rounded px-1.5 py-0.5 outline-none cursor-pointer"
                >
                  <option value="LOCKED">LOCKED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

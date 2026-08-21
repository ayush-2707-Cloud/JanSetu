"use client";

import React from "react";
import {
  X,
  Scale,
  ArrowRight,
  Clock,
  DollarSign,
  CheckCircle2,
  FileText,
  Building2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { UniversalJourney, Language } from "@/types/journey";
import { Badge } from "@/components/ui/badge";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface JourneyComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  journeyA: UniversalJourney | null;
  journeyB: UniversalJourney | null;
  onSelectJourney: (journeyId: string) => void;
  language: Language;
}

export const JourneyComparisonModal: React.FC<JourneyComparisonModalProps> = ({
  isOpen,
  onClose,
  journeyA,
  journeyB,
  onSelectJourney,
  language,
}) => {
  // Universal background scroll lock
  useBodyScrollLock(isOpen);

  if (!isOpen || !journeyA || !journeyB) return null;

  const getDocCount = (j: UniversalJourney) => {
    return j.steps.reduce((acc, step) => {
      const docs = step.documentRequirements?.length || step.instructions?.documentsRequired?.length || 0;
      return acc + docs;
    }, 0);
  };

  const getOnlineOnlyRatio = (j: UniversalJourney) => {
    const onlineSteps = j.steps.filter((s) => s.instructions?.actionUrl || s.officialLinks?.length).length;
    return `${onlineSteps}/${j.steps.length} Steps Online`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
          
          {/* Modal Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-600/30 border border-blue-400/30 text-blue-300">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Process Comparison Matrix</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Side-by-Side Analysis
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Compare requirements, procedural complexity, duration, and legal fees.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close comparison modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Side-by-Side Table */}
          <div className="p-6 overflow-x-auto space-y-6">
            <div className="grid grid-cols-3 gap-4 min-w-[650px] border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 self-end">
                Feature / Metric
              </div>
              
              {/* Journey A Header */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Option A • {journeyA.agencyCode}
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                  {journeyA.title}
                </h4>
                <button
                  onClick={() => {
                    onSelectJourney(journeyA.journeyId);
                    onClose();
                  }}
                  className="w-full py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Select Roadmap A</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Journey B Header */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Option B • {journeyB.agencyCode}
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                  {journeyB.title}
                </h4>
                <button
                  onClick={() => {
                    onSelectJourney(journeyB.journeyId);
                    onClose();
                  }}
                  className="w-full py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Select Roadmap B</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Comparison Rows */}
            <div className="space-y-3 min-w-[650px] text-xs">
              
              {/* Row: Category / Domain */}
              <div className="grid grid-cols-3 gap-4 py-2 border-b border-slate-100 dark:border-slate-800/60 items-center">
                <span className="font-bold text-slate-500 dark:text-slate-400">Governing Category</span>
                <span className="font-bold text-slate-900 dark:text-white">{journeyA.category}</span>
                <span className="font-bold text-slate-900 dark:text-white">{journeyB.category}</span>
              </div>

              {/* Row: Procedural Steps Count */}
              <div className="grid grid-cols-3 gap-4 py-2 border-b border-slate-100 dark:border-slate-800/60 items-center">
                <span className="font-bold text-slate-500 dark:text-slate-400">Total Milestones</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400">{journeyA.steps.length} Steps</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{journeyB.steps.length} Steps</span>
              </div>

              {/* Row: Estimated Time & SLA */}
              <div className="grid grid-cols-3 gap-4 py-2 border-b border-slate-100 dark:border-slate-800/60 items-center">
                <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  Estimated Duration
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{journeyA.estimatedDuration}</span>
                <span className="font-bold text-slate-900 dark:text-white">{journeyB.estimatedDuration}</span>
              </div>

              {/* Row: Required Documents */}
              <div className="grid grid-cols-3 gap-4 py-2 border-b border-slate-100 dark:border-slate-800/60 items-center">
                <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  Required Documents
                </span>
                <span className="font-bold text-slate-900 dark:text-white">~{getDocCount(journeyA)} Documents</span>
                <span className="font-bold text-slate-900 dark:text-white">~{getDocCount(journeyB)} Documents</span>
              </div>

              {/* Row: Online Clearance Ratio */}
              <div className="grid grid-cols-3 gap-4 py-2 border-b border-slate-100 dark:border-slate-800/60 items-center">
                <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  Online Portal Availability
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{getOnlineOnlyRatio(journeyA)}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{getOnlineOnlyRatio(journeyB)}</span>
              </div>

              {/* Row: Primary Department */}
              <div className="grid grid-cols-3 gap-4 py-2 items-center">
                <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-purple-500" />
                  Primary Nodal Authority
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">{journeyA.department}</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">{journeyB.department}</span>
              </div>

            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              * Official fee schedules and SLAs are subject to annual state gazette amendments.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
            >
              Close Comparison
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

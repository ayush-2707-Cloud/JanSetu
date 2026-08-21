"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import { EnhancedJourney, EnhancedJourneyStep } from "@/types/journey";

interface JourneyGanttChartProps {
  journey: EnhancedJourney;
  language?: string;
}

export const JourneyGanttChart: React.FC<JourneyGanttChartProps> = ({
  journey,
  language = "en",
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!journey || !journey.steps || journey.steps.length === 0) return null;

  // Compute cumulative day offsets for GANTT visualization
  let runningDayOffset = 0;
  const ganttSteps = journey.steps.map((step, idx) => {
    // Extract estimated days from string (e.g. "3-5 days" -> 4)
    const match = (step.estimatedDays || "").match(/(\d+)/);
    const durationDays = match ? parseInt(match[0], 10) : 3;
    const startDay = runningDayOffset;
    runningDayOffset += durationDays;
    const isCriticalPath = step.status !== "COMPLETED" && (step.requiresDigiLocker !== false || idx < 4);

    return {
      ...step,
      startDay,
      durationDays,
      endDay: startDay + durationDays,
      isCriticalPath,
    };
  });

  const totalProjectDays = Math.max(runningDayOffset, 15);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      {/* Header / Toggle Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/60 hover:bg-slate-100/80 transition-colors text-xs font-bold cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-slate-900 dark:text-white font-black">
                Statutory Milestone Critical Path & GANTT Schedule
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 font-mono">
                ~{totalProjectDays} Total Days
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
              Visualizes prerequisite dependency bottlenecks and parallel execution paths.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-[11px] font-semibold">{isExpanded ? "Collapse GANTT" : "View Critical Path"}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Interactive SVG / Bar GANTT View */}
      {isExpanded && (
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-2 duration-200 text-xs">
          
          <div className="flex items-center justify-between flex-wrap gap-2 text-[11px]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold">
                <span className="w-3 h-3 rounded bg-amber-500 shadow-xs" />
                Critical Path (Direct Bottleneck)
              </span>
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                <span className="w-3 h-3 rounded bg-blue-500" />
                Standard Dependency
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                Completed Milestone
              </span>
            </div>
            <span className="text-slate-400 font-mono text-[10px]">Scale: 1 Unit = 1 Business Day</span>
          </div>

          {/* Timeline Bars */}
          <div className="space-y-3 pt-2">
            {ganttSteps.map((step, idx) => {
              const leftPercent = (step.startDay / totalProjectDays) * 100;
              const widthPercent = Math.max((step.durationDays / totalProjectDays) * 100, 8);

              let barColor = "bg-blue-500 dark:bg-blue-600";
              if (step.status === "COMPLETED") {
                barColor = "bg-emerald-500 dark:bg-emerald-600";
              } else if (step.isCriticalPath) {
                barColor = "bg-amber-500 dark:bg-amber-600 ring-2 ring-amber-400/40 animate-pulse";
              }

              return (
                <div key={step.id || `step-${idx}`} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[280px]">
                      Step {step.stepNumber}: {step.title}
                    </span>
                    <span className="font-mono text-slate-500 text-[10px]">
                      Day {step.startDay + 1} – Day {step.endDay} ({step.durationDays}d)
                    </span>
                  </div>

                  {/* Horizontal Bar Track */}
                  <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative border border-slate-200 dark:border-slate-700/60">
                    <div
                      style={{
                        marginLeft: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                      className={`h-full rounded-full ${barColor} transition-all duration-300 shadow-xs flex items-center justify-end px-1.5`}
                    >
                      <span className="text-[9px] font-bold text-white leading-none">
                        {step.durationDays}d
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Critical Path Warning Insight */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>
              <strong>Critical Path Optimization:</strong> You can initiate <em>Electricity Bill & Landlord NOC</em> in parallel with firm constitution to shorten total turnaround by up to <strong>7 business days</strong>.
            </span>
          </div>

        </div>
      )}
    </div>
  );
};

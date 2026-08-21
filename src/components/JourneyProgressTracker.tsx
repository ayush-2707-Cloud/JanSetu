"use client";

import React, { useMemo } from "react";
import {
  Trophy,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  Target,
  Zap,
} from "lucide-react";
import { UniversalJourney, Language, StepStatus } from "@/types/journey";

interface JourneyProgressTrackerProps {
  journey: UniversalJourney;
  language: Language;
  /** When true, renders a compact horizontal bar (for sticky header use) */
  compact?: boolean;
  /** Callback to scroll/navigate to the current active step */
  onGoToActiveStep?: () => void;
  className?: string;
}

const i18n = {
  EN: {
    heading: "Journey Progress",
    completed: "Completed",
    inProgress: "In Progress",
    remaining: "Remaining",
    stepsCompleted: "steps completed",
    estimatedTimeLeft: "Est. time remaining",
    goToCurrentStep: "Go to Current Step",
    journeyComplete: "Journey Complete! 🎉",
    overallProgress: "Overall Progress",
    of: "of",
  },
  HI: {
    heading: "यात्रा प्रगति",
    completed: "पूर्ण",
    inProgress: "प्रगति में",
    remaining: "शेष",
    stepsCompleted: "चरण पूर्ण",
    estimatedTimeLeft: "अनु. शेष समय",
    goToCurrentStep: "वर्तमान चरण पर जाएं",
    journeyComplete: "यात्रा पूर्ण! 🎉",
    overallProgress: "समग्र प्रगति",
    of: "का",
  },
  KN: {
    heading: "ಪ್ರಯಾಣ ಪ್ರಗತಿ",
    completed: "ಪೂರ್ಣ",
    inProgress: "ಪ್ರಗತಿಯಲ್ಲಿ",
    remaining: "ಉಳಿದಿದೆ",
    stepsCompleted: "ಹಂತಗಳು ಪೂರ್ಣ",
    estimatedTimeLeft: "ಅಂದಾಜು ಉಳಿದ ಸಮಯ",
    goToCurrentStep: "ಪ್ರಸ್ತುತ ಹಂತಕ್ಕೆ ಹೋಗಿ",
    journeyComplete: "ಪ್ರಯಾಣ ಪೂರ್ಣ! 🎉",
    overallProgress: "ಒಟ್ಟಾರೆ ಪ್ರಗತಿ",
    of: "ಅಲ್ಲಿ",
  },
};

/**
 * Persistent progress tracker for the current journey.
 * Shows overall percentage, completed / in-progress / remaining stats,
 * estimated time left, and a "Go to current step" button.
 */
export const JourneyProgressTracker: React.FC<JourneyProgressTrackerProps> = ({
  journey,
  language,
  compact = false,
  onGoToActiveStep,
  className,
}) => {
  const t = (i18n as Record<string, typeof i18n.EN>)[language] || i18n.EN;

  const stats = useMemo(() => {
    const completed = journey.steps.filter((s) => s.status === "COMPLETED").length;
    const inProgress = journey.steps.filter((s) => s.status === "IN_PROGRESS").length;
    const locked = journey.steps.filter((s) => s.status === "LOCKED").length;
    const total = journey.steps.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const isComplete = completed === total;

    // Estimate remaining time from incomplete steps
    const remainingSteps = journey.steps.filter((s) => s.status !== "COMPLETED");
    let estimatedDaysRemaining = 0;
    for (const step of remainingSteps) {
      if (step.estimatedDays) {
        // Parse "1-2 Days" → average
        const match = step.estimatedDays.match(/(\d+)(?:\s*-\s*(\d+))?/);
        if (match) {
          const lo = parseInt(match[1], 10);
          const hi = match[2] ? parseInt(match[2], 10) : lo;
          estimatedDaysRemaining += (lo + hi) / 2;
        }
      }
    }

    // Format remaining time & target date
    let timeRemaining = "";
    let targetDateString = "";
    if (estimatedDaysRemaining <= 0) {
      timeRemaining = "—";
    } else if (estimatedDaysRemaining < 1) {
      timeRemaining = "< 1 day";
      const d = new Date(Date.now() + 86400000);
      targetDateString = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } else if (estimatedDaysRemaining <= 7) {
      timeRemaining = `${Math.ceil(estimatedDaysRemaining)} days`;
      const d = new Date(Date.now() + Math.ceil(estimatedDaysRemaining) * 86400000);
      targetDateString = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } else {
      const weeks = Math.ceil(estimatedDaysRemaining / 7);
      timeRemaining = `${weeks} week${weeks > 1 ? "s" : ""}`;
      const d = new Date(Date.now() + Math.ceil(estimatedDaysRemaining) * 86400000);
      targetDateString = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    }

    return {
      completed,
      inProgress,
      locked,
      total,
      percentage,
      isComplete,
      timeRemaining,
      targetDateString,
    };
  }, [journey.steps]);

  // ── Progress bar colour based on completion ──
  const progressGradient = stats.isComplete
    ? "from-emerald-400 to-green-500"
    : stats.percentage >= 50
    ? "from-blue-500 to-indigo-500"
    : "from-amber-400 to-orange-500";

  // ── Compact variant (horizontal bar for sticky header) ─────────────
  if (compact) {
    return (
      <div
        className={`flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-xs ${className || ""}`}
      >
        {/* Mini ring indicator */}
        <div className="relative w-8 h-8 shrink-0">
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-slate-200 dark:text-slate-700"
            />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="url(#progressGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${stats.percentage * 0.88} 100`}
            />
            <defs>
              <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={stats.isComplete ? "#34d399" : stats.percentage >= 50 ? "#3b82f6" : "#f59e0b"} />
                <stop offset="100%" stopColor={stats.isComplete ? "#22c55e" : stats.percentage >= 50 ? "#6366f1" : "#f97316"} />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-700 dark:text-slate-200">
            {stats.percentage}%
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 text-[10px] font-semibold">
          <span className="text-emerald-600 dark:text-emerald-400">
            {stats.completed}/{stats.total} ✓
          </span>
          {stats.inProgress > 0 && (
            <span className="text-blue-500">
              {stats.inProgress} <Loader2 className="w-2.5 h-2.5 inline animate-spin" />
            </span>
          )}
          {!stats.isComplete && (
            <span className="text-slate-400 dark:text-slate-500">
              ~{stats.timeRemaining}
            </span>
          )}
        </div>

        {/* Go to active step */}
        {onGoToActiveStep && !stats.isComplete && (
          <button
            onClick={onGoToActiveStep}
            className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors whitespace-nowrap"
          >
            <ArrowRight className="w-3 h-3 inline mr-0.5" />
            {t.goToCurrentStep}
          </button>
        )}
      </div>
    );
  }

  // ── Full variant ───────────────────────────────────────────────────
  return (
    <div className={`space-y-3 ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t.heading}
        </h4>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        {/* Progress header with percentage */}
        <div
          className={`p-4 ${
            stats.isComplete
              ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/60 dark:to-green-950/60"
              : "bg-slate-50 dark:bg-slate-950"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {t.overallProgress}
            </span>
            <span
              className={`text-lg font-black ${
                stats.isComplete
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {stats.percentage}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${progressGradient} transition-all duration-700 ease-out`}
              style={{ width: `${stats.percentage}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">
            {stats.completed} {t.of} {stats.total} {t.stepsCompleted}
          </p>
        </div>

        {/* Journey Complete Banner */}
        {stats.isComplete && (
          <div className="px-4 py-3 bg-emerald-50 dark:bg-emerald-950/40 border-y border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              {t.journeyComplete}
            </span>
          </div>
        )}

        {/* Step status breakdown */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800">
          {/* Completed */}
          <div className="px-3 py-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {stats.completed}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {t.completed}
            </p>
          </div>

          {/* In Progress */}
          <div className="px-3 py-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Zap className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <p className="text-lg font-black text-blue-600 dark:text-blue-400">
              {stats.inProgress}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {t.inProgress}
            </p>
          </div>

          {/* Remaining */}
          <div className="px-3 py-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-lg font-black text-slate-500 dark:text-slate-400">
              {stats.locked}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {t.remaining}
            </p>
          </div>
        </div>

        {/* Estimated time remaining & Target Date */}
        {!stats.isComplete && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              {t.estimatedTimeLeft}
            </span>
            <div className="text-right">
              <span className="font-bold text-slate-900 dark:text-white block">
                ~{stats.timeRemaining}
              </span>
              {stats.targetDateString && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                  Target: {stats.targetDateString}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Go to current step CTA */}
        {onGoToActiveStep && !stats.isComplete && (
          <button
            onClick={onGoToActiveStep}
            className="w-full px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            {t.goToCurrentStep}
          </button>
        )}
      </div>
    </div>
  );
};

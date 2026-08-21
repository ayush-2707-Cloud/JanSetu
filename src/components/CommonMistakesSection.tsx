"use client";

import React from "react";
import { XCircle, AlertTriangle } from "lucide-react";
import { Language } from "@/types/journey";

interface CommonMistakesSectionProps {
  mistakes: string[];
  mistakesHi?: string[];
  mistakesKn?: string[];
  language: Language;
}

/**
 * Collapsible section listing common mistakes people make for a given step.
 * Uses red ❌ markers to draw attention to anti-patterns.
 */
export const CommonMistakesSection: React.FC<CommonMistakesSectionProps> = ({
  mistakes,
  mistakesHi,
  mistakesKn,
  language,
}) => {
  if (!mistakes || mistakes.length === 0) return null;

  const localizedMistakes =
    language === "HI" && mistakesHi && mistakesHi.length > 0
      ? mistakesHi
      : language === "KN" && mistakesKn && mistakesKn.length > 0
      ? mistakesKn
      : mistakes;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {language === "HI"
            ? "सामान्य गलतियां जिनसे बचें"
            : language === "KN"
            ? "ತಪ್ಪಿಸಬೇಕಾದ ಸಾಮಾನ್ಯ ತಪ್ಪುಗಳು"
            : "Common Mistakes to Avoid"}
        </h4>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        {localizedMistakes.map((mistake, idx) => (
          <div
            key={idx}
            className={`p-3.5 flex items-start gap-3 text-xs ${
              idx !== localizedMistakes.length - 1
                ? "border-b border-slate-100 dark:border-slate-800"
                : ""
            }`}
          >
            <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{mistake}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

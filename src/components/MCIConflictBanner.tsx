"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, ArrowRight, UserCheck } from "lucide-react";
import { MCIAuditResponse } from "@/services/tier2MiddlewareService";

interface MCIConflictBannerProps {
  conflictData: MCIAuditResponse | null;
  onResolve?: () => void;
  className?: string;
}

export default function MCIConflictBanner({
  conflictData,
  onResolve,
  className = "",
}: MCIConflictBannerProps) {
  if (!conflictData || !conflictData.has_conflict) return null;

  return (
    <div
      className={`p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 shadow-sm animate-in fade-in space-y-2 text-xs ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>MCI Identity Conflict Detected ({conflictData.conflict_type})</span>
        </div>
        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200">
          {conflictData.confidence_score}% Match Confidence
        </span>
      </div>

      <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
        {conflictData.reason}
      </p>

      {conflictData.conflicting_utid && (
        <div className="p-2 bg-amber-100/60 dark:bg-amber-900/40 rounded-xl font-mono text-[10px] flex items-center justify-between">
          <span>Conflicting Master Record:</span>
          <strong>{conflictData.conflicting_utid}</strong>
        </div>
      )}

      <div className="flex items-center justify-between pt-1 text-[11px]">
        <span className="text-slate-600 dark:text-slate-400">
          Action: {conflictData.recommended_action}
        </span>
        {onResolve && (
          <button
            type="button"
            onClick={onResolve}
            className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] transition-colors cursor-pointer"
          >
            Review Conflict
          </button>
        )}
      </div>
    </div>
  );
}

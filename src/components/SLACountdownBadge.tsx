"use client";

import React from "react";
import { Clock, AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";

interface SLACountdownBadgeProps {
  slaStatus: "HEALTHY" | "WARNING" | "BREACHED" | "ESCALATED";
  hoursRemaining: number;
  statutoryHours?: number;
  className?: string;
}

export default function SLACountdownBadge({
  slaStatus,
  hoursRemaining,
  statutoryHours = 48,
  className = "",
}: SLACountdownBadgeProps) {
  if (slaStatus === "ESCALATED" || slaStatus === "BREACHED" || hoursRemaining <= 0) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse ${className}`}
        title="Statutory SLA Breached: Escalated to District Collector / Appellate Officer under Maharashtra RTSA 2015"
      >
        <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
        <span>SLA BREACHED: ESCALATED ({Math.abs(Math.round(hoursRemaining))}h Overdue)</span>
      </span>
    );
  }

  if (slaStatus === "WARNING" || hoursRemaining <= 12) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 ${className}`}
        title="Approaching Statutory RTSA Deadline (< 12 hours remaining)"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>SLA Warning: {hoursRemaining.toFixed(1)}h Remaining</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 ${className}`}
      title={`Within Maharashtra RTSA Statutory Window (${statutoryHours}h SLA)`}
    >
      <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
      <span>SLA Healthy: {hoursRemaining.toFixed(1)}h Left</span>
    </span>
  );
}

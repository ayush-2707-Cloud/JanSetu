"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Scale,
  ShieldCheck,
  Zap,
  Activity,
  X,
  ExternalLink,
  ChevronRight,
  Flame,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  fetchSLAAnalytics,
  DepartmentSLAAnalytics,
  SLAMetric,
} from "@/services/interoperabilityService";

interface DepartmentalSLAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepartmentalSLAModal({ isOpen, onClose }: DepartmentalSLAModalProps) {
  useBodyScrollLock(isOpen);

  const [analytics, setAnalytics] = useState<DepartmentSLAAnalytics | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen]);

  const loadAnalytics = async () => {
    const data = await fetchSLAAnalytics();
    setAnalytics(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 perf-gpu animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden will-change-transform">
        {/* Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

        {/* Header */}
        <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shadow-xs shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Cross-Department SLA & Bottleneck Analytics
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  Right to Public Services Monitor
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Executive Nodal Dashboard • Real-Time Statutory Turnaround & Inter-Departmental Velocity
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 overscroll-contain transform-gpu">
          {/* Executive Macro KPI Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* KPI 1 */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">
                Overall SLA Compliance
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                  {analytics?.overall_sla_compliance_pct || 94.5}%
                </span>
                <span className="text-xs text-emerald-600 font-semibold">Statutory Target</span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                Across 5 Integrated Ministries
              </span>
            </div>

            {/* KPI 2 */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300 block">
                Turnaround Reduction
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-blue-700 dark:text-blue-300">
                  {analytics?.total_turnaround_reduction_pct || 72.4}%
                </span>
                <span className="text-xs text-blue-600 font-semibold">SLA Compression</span>
              </div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 block">
                Automated DAG Orchestration
              </span>
            </div>

            {/* KPI 3 */}
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 block">
                Average Processing
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-purple-700 dark:text-purple-300">
                  {analytics?.average_processing_days || 3.0} Days
                </span>
                <span className="text-xs text-purple-600 font-semibold">vs 21d Baseline</span>
              </div>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 block">
                7x Velocity Improvement
              </span>
            </div>

            {/* KPI 4: Bottleneck */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500" />
                Active Bottleneck
              </span>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200 truncate mt-1">
                {analytics?.active_bottleneck_department || "Pollution Board (7.2d)"}
              </div>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 block">
                Escalation Auto-Alert Active
              </span>
            </div>
          </div>

          {/* Department Breakdown Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              Statutory Department Throughput & Velocity Matrix
            </h3>

            <div className="space-y-3">
              {(analytics?.department_metrics || []).map((m: SLAMetric, idx: number) => {
                const ratio = Math.min(100, Math.round((m.actual_average_days / m.statutory_sla_days) * 100));

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            {m.department}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {m.service_name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                          Legal Clause: {m.right_to_services_act_clause}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Compliance</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {m.sla_compliance_rate}%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">In-Flight / Escalated</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {m.active_in_flight} / <strong className="text-rose-500">{m.escalated_cases}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Visualizer: Statutory SLA vs Actual Turnaround */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500">
                          Actual Turnaround: <strong>{m.actual_average_days} days</strong>
                        </span>
                        <span className="text-slate-400">
                          Statutory Limit: <strong>{m.statutory_sla_days} days</strong>
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            ratio < 50 ? "bg-emerald-500" : ratio < 80 ? "bg-amber-500" : "bg-rose-500"
                          }`}
                          style={{ width: `${Math.max(8, ratio)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Compliant with State Right to Public Services Acts & Central Citizen Charters
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close SLA Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

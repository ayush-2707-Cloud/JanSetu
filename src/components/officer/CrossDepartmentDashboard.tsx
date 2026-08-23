"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  RefreshCw,
  Layers,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { fetchCrossDepartmentSummary, CrossDepartmentSummaryResponse } from "@/services/tier4Service";

interface CrossDepartmentDashboardProps {
  onSelectDepartment?: (deptCode: string) => void;
}

export default function CrossDepartmentDashboard({ onSelectDepartment }: CrossDepartmentDashboardProps) {
  const [data, setData] = useState<CrossDepartmentSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    setIsLoading(true);
    try {
      const res = await fetchCrossDepartmentSummary();
      setData(res);
    } catch (e) {
      console.warn("Failed to load cross department summary:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
        <span className="text-xs font-semibold">Aggregating statewide cross-department intelligence...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Top Aggregate Overview Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-bold">
              🏛️
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Statewide Consolidated Coordination Radar (Maharashtra)
              </h3>
              <p className="text-[11px] text-slate-400">
                Consolidated View of Beneficiaries, Approvals, Handoffs & CPGRAMS Grievances
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">
              Overall SLA: {data.overall_sla_compliance_rate}%
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono">
              Avg: {data.statewide_avg_days} Days
            </span>
          </div>
        </div>

        {/* 5 Department Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {data.department_breakdown.map((dept) => (
            <div
              key={dept.department_code}
              onClick={() => onSelectDepartment && onSelectDepartment(dept.department_code)}
              className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{dept.icon}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {dept.sla_compliance_rate}% SLA
                </span>
              </div>

              <div className="space-y-0.5">
                <strong className="text-xs text-white block group-hover:text-blue-300 transition-colors truncate">
                  {dept.department_name.split("(")[0].trim()}
                </strong>
                <span className="text-[10px] text-slate-400 font-mono">
                  {dept.total_received.toLocaleString()} received
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-700 text-[10px] font-mono">
                <span className="text-amber-400">Pending: {dept.pending_scrutiny}</span>
                <span className="text-emerald-400 text-right">Apprv: {dept.approved_count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inter-Agency Handoff Pipeline Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Cross-Department Workflow Transitions & In-Flight Handoffs
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">EventBus Automated Sync</span>
        </div>

        <div className="space-y-2.5">
          {data.inter_department_handoffs.map((handoff) => (
            <div
              key={handoff.handoff_id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="text-slate-900 dark:text-white font-bold">{handoff.source_department}</strong>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <strong className="text-slate-900 dark:text-white font-bold">{handoff.target_department}</strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                    {handoff.active_in_flight_count} In-Flight
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{handoff.service_transition}</p>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 max-w-sm">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">Optimization: </span>
                {handoff.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

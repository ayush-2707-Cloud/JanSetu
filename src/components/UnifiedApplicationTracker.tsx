"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Building2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { fetchMyUnifiedApplications, ApplicationTrackItem, UnifiedTrackerResponse } from "@/services/tier4Service";

interface UnifiedApplicationTrackerProps {
  onSelectJourney?: (journeyId: string) => void;
}

export default function UnifiedApplicationTracker({ onSelectJourney }: UnifiedApplicationTrackerProps) {
  const { selectJourneyById } = useJourney();
  const [data, setData] = useState<UnifiedTrackerResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchMyUnifiedApplications(statusFilter === "ALL" ? undefined : statusFilter);
      setData(res);
    } catch (e) {
      console.warn("Tracker fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApps = (data?.applications || []).filter((app) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.application_id.toLowerCase().includes(q) ||
      app.department_name.toLowerCase().includes(q) ||
      app.journey_title.toLowerCase().includes(q) ||
      app.portal_origin.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
      case "DEFECT_FLAGGED":
        return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800";
      case "SCRUTINY_STAGE_1":
      case "SUBMITTED":
        return "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300";
    }
  };

  const getSLABadge = (slaStatus: string, daysRemaining: number) => {
    switch (slaStatus) {
      case "COMPLETED":
        return <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Closed within SLA</span>;
      case "WARNING":
        return <span className="text-amber-600 dark:text-amber-400 font-bold">⚠️ {daysRemaining}d left (Action Due)</span>;
      case "ESCALATED":
        return <span className="text-rose-600 dark:text-rose-400 font-bold">🚨 Escalated to Collector</span>;
      default:
        return <span className="text-blue-600 dark:text-blue-400 font-medium">{daysRemaining} days remaining</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-gov-card space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center shadow-xs shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Unified Cross-Portal Application Tracker
              </h2>
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Central • State • Municipal
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Consolidated real-time status across FoSCoS (FSSAI), Aaple Sarkar (BMC), Mahabhulekh & Udyam
            </p>
          </div>
        </div>

        {/* Quick Aggregate Stats */}
        {data && (
          <div className="flex items-center gap-2 text-xs font-bold shrink-0 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Active: <strong className="font-mono">{data.total_active_applications}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Completed: <strong className="font-mono">{data.completed_applications}</strong>
            </div>
            {data.pending_actions_count > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse">
                Action Due: <strong className="font-mono">{data.pending_actions_count}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Department or Portal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "ALL", label: "All Portals" },
            { id: "SCRUTINY_STAGE_1", label: "In Scrutiny" },
            { id: "DEFECT_FLAGGED", label: "Action Required" },
            { id: "APPROVED", label: "Approved" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                statusFilter === f.id
                  ? "bg-blue-600 border-blue-500 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Cards Grid */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500" />
            <p className="text-xs">Synchronizing cross-department registries...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No matching applications found.
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.application_id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-600 transition-all space-y-3"
            >
              {/* Row 1: Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {app.application_id}
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {app.department_name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    {app.portal_origin}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                    {app.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Row 2: Milestone & SLA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Milestone:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{app.current_milestone}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Scrutiny Officer:</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{app.assigned_officer}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">RTSA Statutory SLA:</span>
                  <p className="text-xs">{getSLABadge(app.sla_status, app.sla_days_remaining)}</p>
                </div>
              </div>

              {/* Row 3: Action Required Alert (if any) */}
              {app.action_required_by_citizen && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 flex-1">
                    <strong className="font-bold block">Citizen Action Required:</strong>
                    <p className="text-[11px] leading-relaxed">{app.action_notes}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      selectJourneyById(app.journey_id);
                      if (onSelectJourney) onSelectJourney(app.journey_id);
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 cursor-pointer transition-colors"
                  >
                    Resolve Now →
                  </button>
                </div>
              )}

              {/* Row 4: View Journey Link */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>Submitted: {new Date(app.submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                <button
                  type="button"
                  onClick={() => {
                    selectJourneyById(app.journey_id);
                    if (onSelectJourney) onSelectJourney(app.journey_id);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Milestone Roadmap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

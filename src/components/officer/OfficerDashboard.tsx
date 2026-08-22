"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Shield,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  FileText,
  UserCheck,
  ChevronRight,
  ArrowUpDown,
  RefreshCw,
  Sparkles,
  Inbox,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Flame,
} from "lucide-react";
import {
  OfficerApplication,
  DepartmentCode,
  ApplicationStatus,
} from "@/types/officer";
import { officerService } from "@/services/api";
import { ApplicationReviewDrawer } from "@/components/officer/ApplicationReviewDrawer";
import { useToast } from "@/context/ToastContext";

const DEPARTMENT_TABS: { id: DepartmentCode | "ALL"; label: string; icon: string }[] = [
  { id: "ALL", label: "All Departments", icon: "🏛️" },
  { id: "MSME", label: "MSME / Udyam", icon: "🏢" },
  { id: "FOOD_SAFETY", label: "Food Safety (FSSAI)", icon: "🍲" },
  { id: "REVENUE", label: "Revenue & Land", icon: "📜" },
  { id: "MUNICIPAL", label: "Municipal Corp", icon: "🏙️" },
  { id: "TRANSPORT", label: "Transport & RTO", icon: "🚛" },
];

const STATUS_FILTERS: { id: ApplicationStatus | "ALL"; label: string }[] = [
  { id: "ALL", label: "All Queue" },
  { id: "PENDING_REVIEW", label: "Pending Review" },
  { id: "APPROVED", label: "Approved" },
  { id: "DEFECT_FLAGGED", label: "Defect Flagged" },
  { id: "REJECTED", label: "Rejected" },
];

export const OfficerDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [applications, setApplications] = useState<OfficerApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDept, setSelectedDept] = useState<DepartmentCode | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Selected Application for Drawer Review
  const [selectedApp, setSelectedApp] = useState<OfficerApplication | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const deptParam = selectedDept === "ALL" ? undefined : selectedDept;
      const statusParam = selectedStatus === "ALL" ? undefined : selectedStatus;
      const data = await officerService.getApplications(deptParam, statusParam, searchQuery);
      setApplications(data);
    } catch (err) {
      console.warn("Failed to fetch applications:", err);
      showToast("Error loading officer queue.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedDept, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleRowClick = (app: OfficerApplication) => {
    setSelectedApp(app);
    setIsDrawerOpen(true);
  };

  const handleDecisionSubmitted = (applicationId: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.application_id === applicationId ? { ...a, status: newStatus } : a))
    );
  };

  // Queue Analytics
  const metrics = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === "PENDING_REVIEW").length;
    const breached = applications.filter((a) => a.is_sla_breached || a.sla_hours_remaining <= 12).length;
    const approved = applications.filter((a) => a.status === "APPROVED").length;
    const defects = applications.filter((a) => a.status === "DEFECT_FLAGGED").length;
    return { total, pending, breached, approved, defects };
  }, [applications]);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case "DEFECT_FLAGGED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" /> Defect Flagged
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Clock className="w-3.5 h-3.5" /> Pending Scrutiny
          </span>
        );
    }
  };

  const getSlaBadge = (app: OfficerApplication) => {
    if (app.status === "APPROVED") {
      return (
        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          ✓ Resolved in SLA
        </span>
      );
    }
    if (app.is_sla_breached || app.sla_hours_remaining < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 animate-pulse">
          <Flame className="w-3.5 h-3.5 text-red-600" />
          Red: Breached ({Math.abs(app.sla_hours_remaining).toFixed(1)}h overdue)
        </span>
      );
    }
    if (app.sla_hours_remaining <= 24) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Amber: &lt;24h ({app.sla_hours_remaining.toFixed(1)}h left)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
        <Clock className="w-3.5 h-3.5 text-emerald-600" />
        Green: &gt;24h ({app.sla_hours_remaining.toFixed(1)}h remaining)
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Officer Header & Scrutiny Portal Notice */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                Nodal Scrutiny Cell • DPDP Act 2023 Compliant
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Officer ID: OFFICER-KA-9942
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Official Cross-Departmental Review Dashboard
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              Consolidated statutory back-office scrutiny for MSME, FSSAI, Revenue & Municipal applications. Inspect beneficiary dossiers, verify DigiLocker KYC, and dispatch official decisions with SLA audit tracking.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={fetchApplications}
              className="px-4 py-2.5 rounded-xl font-extrabold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Analytics Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total in Queue</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.total}</p>
          <span className="text-[10px] text-slate-400 block">Cross-department</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-2xl shadow-2xs space-y-1 bg-blue-50/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Pending Scrutiny</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{metrics.pending}</p>
          <span className="text-[10px] text-slate-400 block">Awaiting decision</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 rounded-2xl shadow-2xs space-y-1 bg-red-50/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">SLA Critical / Overdue</span>
          <p className="text-2xl font-black text-red-600 dark:text-red-400">{metrics.breached}</p>
          <span className="text-[10px] text-slate-400 block">Requires instant action</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl shadow-2xs space-y-1 bg-emerald-50/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Approved</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{metrics.approved}</p>
          <span className="text-[10px] text-slate-400 block">Passed verification</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-2xl shadow-2xs space-y-1 bg-amber-50/20 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Defect Flagged</span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{metrics.defects}</p>
          <span className="text-[10px] text-slate-400 block">Returned to citizen</span>
        </div>
      </div>

      {/* Filter Bar: Department Tabs & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        
        {/* Department Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {DEPARTMENT_TABS.map((tab) => {
            const isSelected = selectedDept === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedDept(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Pill Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            {STATUS_FILTERS.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStatus(st.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                  selectedStatus === st.id
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, citizen, or enterprise..."
              className="w-full text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  fetchApplications();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-gov-card overflow-hidden">
        
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Loading official application queue...
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No applications found matching your criteria
            </h3>
            <p className="text-xs text-slate-500">
              Try adjusting your department filter, status, or search query.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedDept("ALL");
                setSelectedStatus("ALL");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">UTID</th>
                  <th className="py-3.5 px-4">Applicant Name</th>
                  <th className="py-3.5 px-4">Target Goal</th>
                  <th className="py-3.5 px-4">Current Department Stage</th>
                  <th className="py-3.5 px-4">SLA Remaining</th>
                  <th className="py-3.5 px-4">Status Badge</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {applications.map((app) => (
                  <tr
                    key={app.utid || app.application_id}
                    onClick={() => handleRowClick(app)}
                    className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer group"
                  >
                    {/* UTID */}
                    <td className="py-4 px-4 font-mono font-black text-blue-600 dark:text-blue-400">
                      {app.utid || app.application_id}
                    </td>

                    {/* Applicant Name */}
                    <td className="py-4 px-4 space-y-0.5">
                      <strong className="text-slate-900 dark:text-white block font-bold">
                        {app.applicant_name || app.citizen_name}
                      </strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate max-w-[180px]">
                        {app.enterprise_name || "Individual Citizen"}
                      </span>
                    </td>

                    {/* Target Goal */}
                    <td className="py-4 px-4 space-y-0.5">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {app.department}
                      </span>
                      <p className="text-[11px] text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[200px]" title={app.target_goal || app.service_title}>
                        {app.target_goal || app.service_title}
                      </p>
                    </td>

                    {/* Current Department Stage */}
                    <td className="py-4 px-4">
                      <span className="text-slate-700 dark:text-slate-300 font-medium line-clamp-2 max-w-[180px]" title={app.current_department_stage || app.current_step_title}>
                        {app.current_department_stage || app.current_step_title}
                      </span>
                    </td>

                    {/* SLA Remaining */}
                    <td className="py-4 px-4">
                      {getSlaBadge(app)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      {getStatusBadge(app.status)}
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(app);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all shadow-2xs group-hover:scale-102 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Slide-Over Application Review Drawer */}
      <ApplicationReviewDrawer
        application={selectedApp}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onDecisionSubmitted={handleDecisionSubmitted}
      />

    </div>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Building2,
  MapPin,
  FileCheck,
  Sparkles,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
  Layers,
  Database,
  X,
  ExternalLink,
  ChevronRight,
  Award,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  fetchMDMGoldenRecord,
  executeOnceOnlyAutoPopulate,
  MDMGoldenRecord,
  AutoPopulateResponse,
} from "@/services/interoperabilityService";

interface MDMGoldenRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MDMGoldenRecordModal({ isOpen, onClose }: MDMGoldenRecordModalProps) {
  useBodyScrollLock(isOpen);

  const [goldenRecord, setGoldenRecord] = useState<MDMGoldenRecord | null>(null);
  const [autoFillResult, setAutoFillResult] = useState<AutoPopulateResponse | null>(null);
  const [isAutoFilling, setIsAutoFilling] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"profile" | "once_only">("profile");

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    const record = await fetchMDMGoldenRecord();
    setGoldenRecord(record);
  };

  const handleTriggerAutoFill = async () => {
    setIsAutoFilling(true);
    try {
      const res = await executeOnceOnlyAutoPopulate();
      setAutoFillResult(res);
      setActiveTab("once_only");
    } catch (e) {
      console.error("Auto fill error:", e);
    } finally {
      setIsAutoFilling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 perf-gpu animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden will-change-transform">
        {/* Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500" />

        {/* Header */}
        <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shadow-xs shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Master Data Management (MDM) Golden Citizen Record
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Once-Only Principle (OOP)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Consolidated Single Source of Truth • Multi-Department Data Deduplication & Auto-Population
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

        {/* Tabs Bar */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              1. Golden Record & Provenance Ledger
            </button>
            <button
              onClick={() => setActiveTab("once_only")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "once_only"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              2. "Once-Only" 4-Department Auto-Fill Simulator
            </button>
          </div>

          <button
            onClick={handleTriggerAutoFill}
            disabled={isAutoFilling}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-xs hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Once-Only Auto-Populate</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 overscroll-contain transform-gpu">
          {activeTab === "profile" && goldenRecord && (
            <>
              {/* Executive Citizen Summary Card */}
              <div className="p-4.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/40 dark:from-emerald-950/30 dark:to-slate-800/60 border border-emerald-200 dark:border-emerald-900/60 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Citizen Entity</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{goldenRecord.full_name}</h3>
                  <span className="font-mono text-slate-500">{goldenRecord.citizen_id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified National IDs</span>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    PAN: {goldenRecord.pan_number}
                  </div>
                  <span className="font-mono text-slate-500">Aadhaar: {goldenRecord.aadhaar_masked}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Authoritative Address</span>
                  <p className="text-slate-700 dark:text-slate-300 line-clamp-2 mt-0.5">
                    {goldenRecord.primary_address.line1}, {goldenRecord.primary_address.locality},{" "}
                    {goldenRecord.primary_address.city} - {goldenRecord.primary_address.pin_code}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Deduplication Score</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      {Math.round(goldenRecord.deduplication_confidence * 100)}% Match
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Zero Identity Drift</span>
                </div>
              </div>

              {/* Provenance & Authoritative Sources Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-500" />
                    Identity Provenance & Registry Source Verification
                  </h4>
                  <span className="text-xs text-slate-500">MeitY Master Data Standards Compliant</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {goldenRecord.identity_attributes.map((attr, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 shadow-xs space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{attr.label}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Authoritative
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {attr.value}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60">
                        <span>Registry: <strong>{attr.provenance.registry_name}</strong></span>
                        <span className="font-mono text-[10px]">{attr.provenance.verification_method}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Enterprises & Land Parcels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Enterprise */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-slate-900 dark:text-white">Authoritative Enterprise Registry</span>
                  </div>
                  {goldenRecord.registered_enterprises.map((ent, i) => (
                    <div key={i} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{ent.enterprise_name}</div>
                      <div className="font-mono text-[11px] text-slate-500">CIN: {ent.cin} • Udyam: {ent.udyam_number}</div>
                    </div>
                  ))}
                </div>

                {/* Land Parcel */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-900 dark:text-white">Authoritative Land Parcel Registry</span>
                  </div>
                  {goldenRecord.land_parcels.map((parcel, i) => (
                    <div key={i} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200">Survey No. {parcel.survey_number} ({parcel.extent})</div>
                      <div className="font-mono text-[11px] text-slate-500">{parcel.parcel_id} • {parcel.zoning}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "once_only" && (
            <div className="space-y-4">
              {/* Once-Only Principle Impact Metric Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg">
                    34
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Eliminated Fields</span>
                    <span className="text-[11px] text-emerald-100">Zero duplicate data entry</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg">
                    85m
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Citizen Time Saved</span>
                    <span className="text-[11px] text-emerald-100">Across 4 departments</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg">
                    100%
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Once-Only Compliance</span>
                    <span className="text-[11px] text-emerald-100">EU & MeitY GovTech Norm</span>
                  </div>
                </div>
              </div>

              {/* 4 Auto-Filled Department Forms Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {(autoFillResult?.department_forms || []).map((form, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                          {form.department_code.replace(/_/g, " ")}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white mt-0.5">{form.form_title}</h4>
                        <span className="text-[10px] font-mono text-slate-400">{form.statutory_portal}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px] border border-emerald-200 shrink-0">
                        {form.eliminated_manual_keystrokes} Fields Auto-Filled
                      </span>
                    </div>

                    {/* Pre-Filled Parameters Key-Value */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1.5 font-mono text-[11px]">
                      {Object.entries(form.pre_filled_fields).slice(0, 4).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                          <span className="text-slate-400">{k}:</span>
                          <span className="font-semibold truncate max-w-[180px]">{String(v)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Auto-Attached Verified Credentials */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400">Attached:</span>
                      {form.auto_validated_docs.map((doc, dIdx) => (
                        <span
                          key={dIdx}
                          className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px] font-semibold"
                        >
                          ✓ {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Adheres to DPDP Act 2023 Purpose-Bound Consent & MeitY Data Exchange Framework
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            Close MDM Explorer
          </button>
        </div>
      </div>
    </div>
  );
}

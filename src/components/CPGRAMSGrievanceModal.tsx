"use client";

import React, { useState, useEffect } from "react";
import {
  Scale,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Send,
  X,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  draftGrievancePetition,
  fileGrievancePetition,
  GrievanceDraftResponse,
  GrievanceRecord,
} from "@/services/tier2MiddlewareService";

interface CPGRAMSGrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  utid?: string;
  department?: string;
  citizenName?: string;
}

export default function CPGRAMSGrievanceModal({
  isOpen,
  onClose,
  utid = "UTID-MH-2026-094182",
  department = "Food Safety Authority of India (FSSAI)",
  citizenName = "Ayush Singh Chauhan",
}: CPGRAMSGrievanceModalProps) {
  useBodyScrollLock(isOpen);

  const [draft, setDraft] = useState<GrievanceDraftResponse | null>(null);
  const [petitionText, setPetitionText] = useState<string>("");
  const [reliefText, setReliefText] = useState<string>("");
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const [isFiling, setIsFiling] = useState<boolean>(false);
  const [filedRecord, setFiledRecord] = useState<GrievanceRecord | null>(null);

  useEffect(() => {
    if (isOpen) {
      generateDraft();
    }
  }, [isOpen, utid, department]);

  const generateDraft = async () => {
    setIsDrafting(true);
    try {
      const res = await draftGrievancePetition(utid, department, citizenName, 10);
      setDraft(res);
      setPetitionText(res.drafted_petition);
      setReliefText(res.relief_requested);
      setFiledRecord(null);
    } catch (e) {
      console.error("Grievance draft error:", e);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleFileGrievance = async () => {
    setIsFiling(true);
    try {
      const record = await fileGrievancePetition(
        utid,
        department,
        citizenName,
        petitionText,
        "+91 98765-43210"
      );
      setFiledRecord(record);
    } catch (e) {
      console.error("File grievance error:", e);
    } finally {
      setIsFiling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 perf-gpu animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden will-change-transform">
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-red-600 to-indigo-600" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 flex items-center justify-center shadow-xs shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  CPGRAMS & Maharashtra RTSA Grievance Bridge
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                  Section 8 & 10 Statutory Escalation
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automated Legal Petition Drafter • Direct First Appeal to District Collector
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 overscroll-contain transform-gpu text-xs">
          {!filedRecord ? (
            <>
              {/* Statutory Notice */}
              <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60 space-y-1 text-orange-900 dark:text-orange-200">
                <div className="font-bold flex items-center gap-1.5 text-xs">
                  <ShieldAlert className="w-4 h-4 text-orange-500" />
                  Statutory Citizen Charter Breach Detected:
                </div>
                <p className="text-[11px] leading-relaxed">
                  Application <strong>{utid}</strong> with <strong>{department}</strong> has exceeded
                  the statutory Right to Public Services Act delivery window. You are legally entitled
                  to file an immediate statutory appeal to the First Appellate Authority (District Collector).
                </p>
              </div>

              {/* Editable Petition Text Area */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    AI-Drafted Statutory Grievance Petition (Maharashtra RTSA 2015):
                  </label>
                  <button
                    onClick={generateDraft}
                    disabled={isDrafting}
                    className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isDrafting ? "animate-spin" : ""}`} />
                    <span>Regenerate Legal Draft</span>
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white p-3.5 font-mono text-[11px] shadow-xs">
                  <textarea
                    value={petitionText}
                    onChange={(e) => setPetitionText(e.target.value)}
                    className="w-full h-64 bg-transparent outline-none resize-none font-mono text-[11px] text-orange-200 leading-relaxed"
                    spellCheck={false}
                  />
                </div>
              </div>
            </>
          ) : (
            /* Successful Filing Record */
            <div className="space-y-5 text-center py-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Statutory Grievance Successfully Dispatched
                </h3>
                <p className="text-xs text-slate-500">
                  Escalated directly to Appellate Authority under Section 10 of Maharashtra RTSA 2015
                </p>
              </div>

              {/* Reference Box */}
              <div className="p-4 bg-slate-900 text-left text-white rounded-2xl font-mono text-xs space-y-2 max-w-lg mx-auto shadow-md">
                <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-2">
                  <span className="text-slate-400">National Tracking ID:</span>
                  <span className="text-amber-400 font-bold text-sm">{filedRecord.grievance_id}</span>
                </div>
                <div>Status: <span className="text-emerald-400 font-bold">{filedRecord.status}</span></div>
                <div>Assigned To: <span className="text-indigo-300">{filedRecord.assigned_appellate_officer}</span></div>
                <div className="text-slate-400 text-[10px] pt-1 flex items-center gap-1">
                  <span>Portal: CPGRAMS & Aaple Sarkar Maharashtra RTSA Portal</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Section 8 & 10 Maharashtra Right to Public Services Act 2015
          </span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {filedRecord ? "Close" : "Cancel"}
            </button>

            {!filedRecord ? (
              <button
                onClick={handleFileGrievance}
                disabled={isFiling}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                {isFiling ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Submit to CPGRAMS / RTSA Gateway</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

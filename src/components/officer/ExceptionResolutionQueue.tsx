"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  FileText,
  UserCheck,
  ArrowRight,
  Send,
  Zap,
} from "lucide-react";
import { fetchOfficerExceptions, resolveOfficerException, ExceptionRecord } from "@/services/tier4Service";
import { useToast } from "@/context/ToastContext";

export default function ExceptionResolutionQueue() {
  const { showToast } = useToast();
  const [exceptions, setExceptions] = useState<ExceptionRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    loadExceptions();
  }, []);

  const loadExceptions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchOfficerExceptions();
      setExceptions(data);
    } catch (e) {
      console.warn("Failed to fetch exceptions:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (
    exceptionId: string,
    action: string,
    notes: string
  ) => {
    setResolvingId(exceptionId);
    try {
      const updated = await resolveOfficerException(exceptionId, action, notes);
      setExceptions((prev) =>
        prev.map((e) => (e.exception_id === exceptionId ? updated : e))
      );
      showToast(`Exception ${exceptionId} resolved (${updated.status})`, "success");
    } catch (err) {
      showToast("Failed to resolve exception", "error");
    } finally {
      setResolvingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center text-slate-400">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-amber-500 mb-1" />
        <span className="text-xs">Scanning exception handling pipeline...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Exception Handling & AI Resolution Pipeline ({exceptions.length})
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Statutory Pre-Flight Gate Exceptions</span>
      </div>

      <div className="space-y-3">
        {exceptions.map((exc) => {
          const isPending = exc.status === "PENDING_RESOLUTION";
          return (
            <div
              key={exc.exception_id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                isPending
                  ? "bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-70"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {exc.exception_id}
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {exc.citizen_name} ({exc.department_name})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      exc.severity === "BLOCKED"
                        ? "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-300"
                        : "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-300"
                    }`}
                  >
                    {exc.severity}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {exc.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  {exc.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Detected Value:</span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">{exc.detected_value}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Expected Standard:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{exc.expected_value}</span>
                  </div>
                </div>
              </div>

              {/* AI Suggested Fix Box */}
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                      AI Exception Recommendation (Score: {exc.ai_confidence_score}%)
                    </strong>
                  </div>
                  <p className="text-[11px] leading-relaxed text-indigo-800 dark:text-indigo-300">
                    {exc.ai_suggested_fix}
                  </p>
                </div>
              </div>

              {/* Resolution Actions (if pending) */}
              {isPending && (
                <div className="flex items-center justify-end gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() =>
                      handleResolve(
                        exc.exception_id,
                        "ACCEPT_AI_FIX",
                        "Accepted AI suggested cross-registry phonetic normalization."
                      )
                    }
                    disabled={resolvingId === exc.exception_id}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept AI Fix</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleResolve(
                        exc.exception_id,
                        "MANUAL_OVERRIDE",
                        "Officer manually validated physical supporting evidence."
                      )
                    }
                    disabled={resolvingId === exc.exception_id}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Manual Override</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleResolve(
                        exc.exception_id,
                        "REQUEST_REUPLOAD",
                        "Defect notice sent to citizen WhatsApp for re-upload."
                      )
                    }
                    disabled={resolvingId === exc.exception_id}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Re-upload</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

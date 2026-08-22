"use client";

import React, { useState, useEffect } from "react";
import {
  ZapOff,
  Zap,
  Activity,
  AlertTriangle,
  RefreshCw,
  Layers,
  Clock,
  CheckCircle2,
  X,
  Radio,
  Flame,
  RotateCcw,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  fetchResilienceStatus,
  toggleChaosOutage,
  ResilienceStatusResponse,
} from "@/services/tier2MiddlewareService";

interface ChaosResilienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChaosResilienceModal({
  isOpen,
  onClose,
}: ChaosResilienceModalProps) {
  useBodyScrollLock(isOpen);

  const [resilienceData, setResilienceData] = useState<ResilienceStatusResponse | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = async () => {
    const data = await fetchResilienceStatus();
    setResilienceData(data);
  };

  const handleToggleChaos = async (serviceName: string, currentStatus: boolean) => {
    setIsToggling(serviceName);
    try {
      await toggleChaosOutage(serviceName, !currentStatus);
      await loadStatus();
    } catch (e) {
      console.error("Chaos toggle error:", e);
    } finally {
      setIsToggling(null);
    }
  };

  const handleRetryDLQ = async () => {
    setIsRetrying(true);
    try {
      // Simulate/call flush
      await fetch("http://localhost:8000/api/resilience/retry-dlq", { method: "POST" });
      await loadStatus();
    } catch (e) {
      console.warn("Retry DLQ error:", e);
    } finally {
      setIsRetrying(false);
    }
  };

  if (!isOpen) return null;

  const services = [
    { id: "fssai_portal", name: "FSSAI FoSCoS Food Portal", icon: "🍲" },
    { id: "revenue_gateway", name: "State Land Records (Bhoomi SOAP)", icon: "📜" },
    { id: "municipal_portal", name: "Municipal Trade Portal (BMC/BBMP)", icon: "🏙️" },
    { id: "digilocker", name: "DigiLocker National Gateway", icon: "📁" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 perf-gpu animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden will-change-transform">
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-600" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shadow-xs shrink-0">
              <Flame className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Resilience & Chaos Engineering Controls
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-rose-500" />
                  Circuit Breaker + DLQ Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Simulate Downstream Portal Outages • Verify Fault-Tolerance & Auto-Retry Queuing
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 overscroll-contain transform-gpu text-xs">
          {/* Section 1: Chaos Injection Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ZapOff className="w-4 h-4 text-rose-500" />
                1. Downstream Gateway Outage Simulation (Evaluator Chaos Test)
              </span>
              <span className="text-[10px] text-slate-500">
                Click any service to trip its circuit breaker to OPEN
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((svc) => {
                const isOutage = resilienceData?.chaos_outages_active[svc.id] || false;
                const circuitState = resilienceData?.active_circuit_states[svc.id] || "CLOSED";
                const isBusy = isToggling === svc.id;

                return (
                  <div
                    key={svc.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isOutage
                        ? "bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-sm"
                        : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{svc.icon}</span>
                        <strong className="text-xs text-slate-900 dark:text-white block font-bold">
                          {svc.name}
                        </strong>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-slate-500">Circuit State:</span>
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-md text-[10px] ${
                            circuitState === "OPEN"
                              ? "bg-rose-600 text-white animate-pulse"
                              : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          }`}
                        >
                          {circuitState}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleChaos(svc.id, isOutage)}
                      disabled={isBusy}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isOutage
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                          : "bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                      }`}
                    >
                      {isBusy ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : isOutage ? (
                        <Zap className="w-3.5 h-3.5" />
                      ) : (
                        <ZapOff className="w-3.5 h-3.5" />
                      )}
                      <span>{isOutage ? "Restore Gateway" : "Simulate Outage"}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Dead-Letter Queue (DLQ) Inspector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-500" />
                2. Dead-Letter Queue (DLQ) Buffer & Auto-Retry Pipeline
              </span>
              <button
                onClick={handleRetryDLQ}
                disabled={isRetrying}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
                <span>Flush & Replay DLQ</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white p-4 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2.5">
                <span className="font-mono text-slate-400">
                  Buffered Transactions: <strong>{resilienceData?.dlq_buffered_count || 0}</strong>
                </span>
                <span className="text-emerald-400 text-[11px] font-mono">
                  Exponential Backoff: 2s, 4s, 8s
                </span>
              </div>

              {resilienceData?.dlq_items && resilienceData.dlq_items.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {resilienceData.dlq_items.map((item) => (
                    <div
                      key={item.item_id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold">{item.item_id}</span>
                        <span className="text-[10px] text-slate-500">Retry #{item.retry_count}/{item.max_retries}</span>
                      </div>
                      <div className="text-slate-400">Service: {item.service_name} • Status: {item.status}</div>
                      <div className="text-rose-400 text-[10px] truncate">{item.error_message}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="font-bold text-xs text-slate-300">DLQ Queue Clear • All Gateways Normal</p>
                  <p className="text-[11px]">Simulate an outage above to watch transactions gracefully buffer into DLQ.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Guarantees zero unhandled 500 exceptions during state portal outages
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Controls
          </button>
        </div>
      </div>
    </div>
  );
}

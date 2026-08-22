"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  GitBranch,
  X,
  Radio,
} from "lucide-react";
import { GovTechEvent } from "@/services/tier1MiddlewareService";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function LiveEventStreamToast() {
  const [activeToast, setActiveToast] = useState<GovTechEvent | null>(null);
  const [toastHistory, setToastHistory] = useState<GovTechEvent[]>([]);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(`${API_BASE}/events/stream`);

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === "CONNECTED") return;

          const govEvent: GovTechEvent = parsed;
          setActiveToast(govEvent);
          setToastHistory((prev) => [govEvent, ...prev.slice(0, 9)]);

          // Auto-hide toast after 6 seconds
          setTimeout(() => {
            setActiveToast((curr) => (curr?.event_id === govEvent.event_id ? null : curr));
          }, 6000);
        } catch (err) {
          // Heartbeat or unparseable event
        }
      };

      eventSource.onerror = () => {
        // SSE reconnection handles itself natively
      };
    } catch (e) {
      console.warn("SSE Connection error in LiveEventStreamToast:", e);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  if (!activeToast) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "STEP_APPROVED":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "SLA_BREACHED":
        return <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />;
      case "SLA_WARNING":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "WORKFLOW_UPDATED":
        return <GitBranch className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "STEP_APPROVED":
        return "border-emerald-500 bg-slate-900/95";
      case "SLA_BREACHED":
        return "border-rose-500 bg-rose-950/90";
      case "SLA_WARNING":
        return "border-amber-500 bg-amber-950/90";
      case "WORKFLOW_UPDATED":
        return "border-purple-500 bg-purple-950/90";
      default:
        return "border-blue-500 bg-slate-900/95";
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-4 duration-200">
      <div
        className={`p-4 rounded-2xl border text-white shadow-2xl backdrop-blur-md flex items-start gap-3 ${getBorderColor(
          activeToast.event_type
        )}`}
      >
        <div className="shrink-0 mt-0.5">{getIcon(activeToast.event_type)}</div>
        <div className="flex-1 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[10px] uppercase tracking-wider text-slate-300 flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
              EventStream: {activeToast.event_type}
            </span>
            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="font-medium text-slate-100 leading-snug">{activeToast.message}</p>
          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
            <span>{activeToast.department}</span>
            <span className="font-mono">{activeToast.utid}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to diagnostic telemetry service
    console.error("JanSetu Statutory Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
        
        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/80 flex items-center justify-center mx-auto shadow-md">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2.5 py-1 rounded-full border border-red-200 dark:border-red-900">
            System Diagnostic Notice
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Unexpected Statutory Session Interruption
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The requested government roadmap or state machine node encountered a temporary synchronization error. No citizen session data was lost.
          </p>
        </div>

        {error.digest && (
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-500 break-all">
            Digest Ref: {error.digest}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Operation</span>
          </button>

          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

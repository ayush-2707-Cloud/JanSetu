import React from "react";
import { Landmark, RefreshCw } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center space-y-4">
        
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900 animate-ping opacity-30" />
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/20">
            <Landmark className="w-7 h-7 animate-pulse" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            JanSetu™ (जनसेतु) Statutory Engine
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Resolving milestone DAG dependencies & verifying regulatory rules...
          </p>
        </div>

        <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-progress" />
        </div>

      </div>
    </div>
  );
}

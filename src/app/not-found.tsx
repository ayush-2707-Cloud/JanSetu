import React from "react";
import Link from "next/link";
import { Compass, Home, Search, ShieldAlert, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
        
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/80 flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-900">
            Error 404 • Resource Not Found
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Statutory Journey Not Located
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The requested procedural roadmap URL does not exist in the National Digital Governance registry or has been updated under new gazetted guidelines.
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
          <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px]">
            Suggested Official Roadmaps:
          </span>
          <ul className="space-y-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
            <li>
              <Link href="/journey/karnataka_cloud_kitchen_setup" className="hover:underline flex items-center justify-between">
                <span>• Karnataka Cloud Kitchen & MSME Setup</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </li>
            <li>
              <Link href="/journey/dpiit_startup_ip_trademark" className="hover:underline flex items-center justify-between">
                <span>• DPIIT Startup & Trademark Fast-Track</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </li>
            <li>
              <Link href="/explore" className="hover:underline flex items-center justify-between">
                <span>• Browse Legal Domain Explorer</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-center gap-3 pt-1">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

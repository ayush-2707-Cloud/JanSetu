"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, ArrowRight, Home, Users, RefreshCw } from "lucide-react";
import { OfficerDashboard } from "@/components/officer/OfficerDashboard";
import { useAuth } from "@/context/AuthContext";
import { GovTechHeader } from "@/components/GovTechHeader";

export default function OfficerPage() {
  const router = useRouter();
  const { user, isAuthorizedForOfficerPortal, isLoading } = useAuth();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasChecked(true);
    }
  }, [isLoading]);

  if (isLoading || !hasChecked) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs font-bold text-slate-400">Verifying Officer Security Credentials & RBAC...</p>
      </div>
    );
  }

  // Access Restricted Guard Screen
  if (!isAuthorizedForOfficerPortal()) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <GovTechHeader />
        
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-400/30 uppercase tracking-wider">
                Restricted Access • Officer Role Required
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Department Officer Authentication Required
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                You are currently {user ? `signed in as a Citizen (${user.full_name})` : "not signed in"}. The Officer Scrutiny Hub is restricted strictly to authorized government personnel.
              </p>
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-left text-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Statutory Security Policy:
              </span>
              <p className="text-slate-300 text-[11px]">
                To switch between portals, you must sign out of your Citizen account and log in with your official Government Service ID / Key.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/login?portal=officer"
                className="flex-1 py-3 px-4 rounded-xl font-extrabold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer no-underline"
              >
                <Lock className="w-4 h-4" />
                <span>Sign In as Officer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/"
                className="py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer no-underline"
              >
                <Home className="w-4 h-4" />
                <span>Return to Citizen Portal</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Authorized Officer Dashboard View
  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <GovTechHeader />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <OfficerDashboard />
        </div>
      </main>
    </div>
  );
}

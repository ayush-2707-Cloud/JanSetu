import React from "react";
import { Metadata } from "next";
import { OfficerDashboard } from "@/components/officer/OfficerDashboard";

export const metadata: Metadata = {
  title: "Officer Review Portal | JanSetu™ (जनसेतु)",
  description: "Official/Admin Back-Office Scrutiny Dashboard for cross-departmental application review, SLA tracking, and DigiLocker verification.",
};

export default function OfficerPage() {
  return (
    <main className="min-h-screen bg-slate-100/60 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <OfficerDashboard />
      </div>
    </main>
  );
}

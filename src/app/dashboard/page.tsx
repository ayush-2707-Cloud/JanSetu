"use client";

import React from "react";
import { useJourney } from "@/context/JourneyContext";
import { GovTechHeader } from "@/components/GovTechHeader";
import { GoalDiscoveryLanding } from "@/components/GoalDiscoveryLanding";
import { MilestoneRoadmap } from "@/components/MilestoneRoadmap";
import { DemoControlsPanel } from "@/components/DemoControlsPanel";
import UnifiedApplicationTracker from "@/components/UnifiedApplicationTracker";
import { ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const {
    activeScreen,
    activeJourney,
    selectJourneyById,
    filterStatus,
    setFilterStatus,
    toggleStepStatus,
    resetJourney,
  } = useJourney();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans relative perf-gpu">
      {/* GovTech Header with Language Switcher & Citizen Profile Avatar */}
      <GovTechHeader />

      {/* Main Container with WCAG Skip Target ID */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeScreen === "LANDING" ? (
          <GoalDiscoveryLanding />
        ) : (
          <div className="space-y-6">
            {/* Unified Cross-Portal Application Tracker (Central, State, Municipal) */}
            <UnifiedApplicationTracker onSelectJourney={(id) => selectJourneyById(id)} />

            {/* Interactive Sandbox Toolbar */}
            <DemoControlsPanel
              currentDatasetKey={activeJourney.journeyId}
              onSelectDataset={(id) => selectJourneyById(id)}
              filterStatus={filterStatus}
              onSetFilter={setFilterStatus}
              onToggleStepStatus={(stepId, status) => toggleStepStatus(stepId, status)}
              onReset={resetJourney}
              stepList={activeJourney.steps.map((s) => ({ id: s.id, title: s.title, status: s.status }))}
            />

            {/* Core Milestone Roadmap Component */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-8 shadow-gov-card transition-colors">
              <MilestoneRoadmap />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 text-slate-400 text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>JanSetu™ AI Universal GovTech Bridge • Powered by Next.js App Router</span>
          </div>
          <p>© 2026 National e-Governance Division (NeGD). DPDP Act 2023 Compliant • Multi-Language Standard (12 Languages).</p>
        </div>
      </footer>
    </div>
  );
}

"use client";

import React, { useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Building2,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { GovTechHeader } from "@/components/GovTechHeader";
import { MilestoneRoadmap } from "@/components/MilestoneRoadmap";
import { DemoControlsPanel } from "@/components/DemoControlsPanel";
import { useJourney } from "@/context/JourneyContext";

interface StepDeepLinkPageProps {
  params: Promise<{
    journeyId: string;
    stepId: string;
  }>;
}

export default function StepDeepLinkPage({ params }: StepDeepLinkPageProps) {
  const resolvedParams = use(params);
  const { journeyId, stepId } = resolvedParams;

  const {
    allJourneys,
    activeJourney,
    selectJourneyById,
    openStepDrawer,
    filterStatus,
    setFilterStatus,
    toggleStepStatus,
    resetJourney,
  } = useJourney();

  useEffect(() => {
    if (journeyId && activeJourney?.journeyId !== journeyId) {
      selectJourneyById(journeyId);
    }
  }, [journeyId, activeJourney?.journeyId, selectJourneyById]);

  useEffect(() => {
    if (stepId) {
      // Small timeout to allow roadmap animation to mount smoothly before sliding drawer
      const timer = setTimeout(() => {
        openStepDrawer(stepId);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [stepId, openStepDrawer]);

  const targetJourney = allJourneys.find((j) => j.journeyId === journeyId) || activeJourney;

  if (!targetJourney) {
    notFound();
  }

  const targetStep = targetJourney.steps.find((s) => s.id === stepId || s.step_id === stepId);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <GovTechHeader />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Breadcrumb Bar with Deep-Link Badge */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Roadmaps</span>
            </Link>
            <span className="text-slate-400">/</span>
            <Link
              href={`/journey/${targetJourney.journeyId}`}
              className="text-slate-500 hover:underline font-semibold"
            >
              {targetJourney.title}
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[280px]">
              {targetStep ? `Step ${targetStep.stepNumber}: ${targetStep.title}` : stepId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Deep-Linked Step Active</span>
            </span>
          </div>
        </div>

        {/* Interactive Sandbox Toolbar */}
        <DemoControlsPanel
          currentDatasetKey={targetJourney.journeyId}
          onSelectDataset={(id) => selectJourneyById(id)}
          filterStatus={filterStatus}
          onSetFilter={setFilterStatus}
          onToggleStepStatus={(sId, status) => toggleStepStatus(sId, status)}
          onReset={resetJourney}
          stepList={targetJourney.steps.map((s) => ({ id: s.id, title: s.title, status: s.status }))}
        />

        {/* Core Milestone Roadmap Component */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-8 shadow-gov-card transition-colors">
          <MilestoneRoadmap />
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 text-slate-400 text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>JanSetu™ (जनसेतु) Universal Statutory Framework • Deep-Link Step URL Route</span>
          </div>
          <p>© 2026 National e-Governance Division (NeGD) • DPDP Act 2023 Compliant</p>
        </div>
      </footer>
    </div>
  );
}

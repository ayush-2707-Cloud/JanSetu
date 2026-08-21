"use client";

import React from "react";
import { Zap, RefreshCw, Layers } from "lucide-react";
import { useJourney } from "@/context/JourneyContext";

export const FloatingDemoController: React.FC = () => {
  const { activeScreen, completeActiveStepAndUnlockNext, resetJourney, activeJourney } = useJourney();

  if (activeScreen !== "ROADMAP") return null;

  const activeStep = activeJourney.steps.find((s) => s.status === "IN_PROGRESS");

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-slate-950/90 text-white backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-2xl flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Demo Controller</span>
          <span className="text-xs font-bold text-blue-300">
            {activeStep ? `Active: Step ${activeStep.stepNumber}` : "All Steps Completed!"}
          </span>
        </div>

        <button
          onClick={completeActiveStepAndUnlockNext}
          disabled={!activeStep}
          className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
          title="Simulate step completion locally and unlock next dependent milestone"
        >
          <Zap className="w-4 h-4 fill-current text-yellow-300" />
          <span>Complete Step & Unlock Next</span>
        </button>

        <button
          onClick={resetJourney}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
          title="Reset milestones to initial state"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

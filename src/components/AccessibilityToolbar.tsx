"use client";

import React, { useState } from "react";
import {
  Eye,
  Volume2,
  VolumeX,
  Type,
  Sun,
  Moon,
  Contrast,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Smartphone,
} from "lucide-react";
import { useAccessibility, ContrastMode, FontSizeScale } from "@/context/AccessibilityContext";

export default function AccessibilityToolbar() {
  const {
    contrastMode,
    setContrastMode,
    fontSize,
    setFontSize,
    isDyslexic,
    setIsDyslexic,
    speakText,
    stopSpeaking,
    isSpeaking,
    isToolbarVisible,
    setIsToolbarVisible,
    setIsMobilePhoneOpen,
  } = useAccessibility();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!isToolbarVisible) return null;

  return (
    <aside
      aria-label="Accessibility & Divyangjan Assistive Tools"
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 text-xs select-none"
    >
      {/* Expanded Controls Panel */}
      {isExpanded && (
        <div className="p-3.5 rounded-2xl bg-slate-950/95 text-white border border-slate-800 shadow-2xl backdrop-blur-md space-y-3 w-72 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              GIGW 3.0 Accessibility Suite
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
              WCAG 2.1 AA
            </span>
          </div>

          {/* 1. Contrast Mode Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-semibold block">High-Contrast Mode:</span>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setContrastMode("standard")}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  contrastMode === "standard"
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setContrastMode("high-contrast-dark")}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  contrastMode === "high-contrast-dark"
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Dark High
              </button>
              <button
                type="button"
                onClick={() => setContrastMode("yellow-on-black")}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  contrastMode === "yellow-on-black"
                    ? "bg-yellow-400 border-yellow-300 text-black font-black"
                    : "bg-black border-yellow-500/50 text-yellow-300 hover:border-yellow-400"
                }`}
              >
                Yellow/Black
              </button>
            </div>
          </div>

          {/* 2. Text Scaler */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-semibold block">Font Size Scale:</span>
            <div className="grid grid-cols-4 gap-1 font-mono">
              {(["90%", "100%", "115%", "130%"] as FontSizeScale[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSize(size)}
                  className={`py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    fontSize === size
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Dyslexic Font Mode */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <span className="text-[10px] text-slate-300 font-medium flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-400" />
              Dyslexia-Friendly Font
            </span>
            <button
              type="button"
              onClick={() => setIsDyslexic((prev) => !prev)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                isDyslexic
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400"
              }`}
            >
              {isDyslexic ? "ON" : "OFF"}
            </button>
          </div>

          {/* 4. Text-to-Speech Engine Trigger */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <span className="text-[10px] text-slate-300 font-medium flex items-center gap-1.5">
              {isSpeaking ? <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              Screen Narration
            </span>
            <button
              type="button"
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  speakText(
                    "Welcome to JanSetu. You are viewing the unified Maharashtra citizen and business regulatory services portal."
                  );
                }
              }}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                isSpeaking
                  ? "bg-rose-600 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {isSpeaking ? "Stop" : "Speak"}
            </button>
          </div>
        </div>
      )}

      {/* Main Trigger Pill */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsMobilePhoneOpen(true)}
          className="px-3 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl flex items-center gap-1.5 font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Open Citizen Mobile WhatsApp & SMS Simulator"
        >
          <Smartphone className="w-4 h-4" />
          <span className="hidden sm:inline">📱 WhatsApp Alert</span>
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 shadow-xl flex items-center gap-2 font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Toggle GIGW 3.0 / WCAG 2.1 Accessibility Suite"
        >
          <Eye className="w-4 h-4 text-blue-400" />
          <span>♿ Accessibility</span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
        </button>
      </div>
    </aside>
  );
}

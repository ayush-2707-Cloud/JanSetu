"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Code2,
  FileCode,
  Zap,
  Building2,
  X,
  BadgeCheck,
  Database,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  harmonizeSchemaWithIndEA,
  fetchSampleLegacyPayloads,
  HarmonizationResponse,
  HarmonizationRule,
} from "@/services/tier1MiddlewareService";

interface VisualDataHarmonizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisualDataHarmonizerModal({
  isOpen,
  onClose,
}: VisualDataHarmonizerModalProps) {
  useBodyScrollLock(isOpen);

  const [samplePayloads, setSamplePayloads] = useState<Record<string, any>>({});
  const [selectedDeptKey, setSelectedDeptKey] = useState<string>("REVENUE_MAHARASHTRA");
  const [rawInputText, setRawInputText] = useState<string>("");
  const [harmonizedData, setHarmonizedData] = useState<HarmonizationResponse | null>(null);
  const [isHarmonizing, setIsHarmonizing] = useState<boolean>(false);
  const [copiedRaw, setCopiedRaw] = useState<boolean>(false);
  const [copiedCanonical, setCopiedCanonical] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    const payloads = await fetchSampleLegacyPayloads();
    setSamplePayloads(payloads);
    const initial = payloads[selectedDeptKey] || payloads.REVENUE_MAHARASHTRA;
    if (initial) {
      setRawInputText(JSON.stringify(initial.raw, null, 2));
      executeHarmonize(selectedDeptKey, initial.raw);
    }
  };

  const handleSelectDepartment = (deptKey: string) => {
    setSelectedDeptKey(deptKey);
    const payload = samplePayloads[deptKey];
    if (payload) {
      setRawInputText(JSON.stringify(payload.raw, null, 2));
      executeHarmonize(deptKey, payload.raw);
    }
  };

  const executeHarmonize = async (deptKey: string, rawObj?: any) => {
    setIsHarmonizing(true);
    try {
      let parsed = rawObj;
      if (!parsed) {
        parsed = JSON.parse(rawInputText);
      }
      const res = await harmonizeSchemaWithIndEA(deptKey, parsed);
      setHarmonizedData(res);
    } catch (e) {
      console.error("Harmonization error:", e);
    } finally {
      setIsHarmonizing(false);
    }
  };

  const handleCopy = (text: string, isRaw: boolean) => {
    navigator.clipboard.writeText(text);
    if (isRaw) {
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    } else {
      setCopiedCanonical(true);
      setTimeout(() => setCopiedCanonical(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 perf-gpu animate-in fade-in duration-150">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden will-change-transform">
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500" />

        {/* Header */}
        <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shadow-xs shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Visual Data Harmonizer (IndEA 2.0 MDM Mapper)
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  MeitY IndEA 2.0 Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Raw Legacy Schema Ingestion → Active Mapping Rules → Canonical IndEA 2.0 Citizen Model
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Department Switcher Bar */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto shrink-0 overscroll-contain">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-500" />
            Select Conflicting Source Portal:
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {Object.entries(samplePayloads).map(([key, item]) => {
              const isSelected = key === selectedDeptKey;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectDepartment(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.department.split("(")[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Split View: Raw Input -> Active Rules -> IndEA Output */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 overscroll-contain transform-gpu">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
            {/* Column 1: Raw Incoming Legacy JSON (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white overflow-hidden flex flex-col shadow-xs">
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-amber-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  1. Raw Legacy Ingestion
                </span>
                <button
                  onClick={() => handleCopy(rawInputText, true)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  {copiedRaw ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRaw ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="p-3 font-mono text-[11px] leading-relaxed flex-1 max-h-96 overflow-y-auto bg-slate-900/90 text-amber-200">
                <textarea
                  value={rawInputText}
                  onChange={(e) => setRawInputText(e.target.value)}
                  className="w-full h-80 bg-transparent outline-none resize-none font-mono text-[11px] text-amber-300"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Column 2: Active Harmonization Rules Pipeline (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 flex flex-col space-y-2.5 overflow-hidden shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-500" />
                  2. Active Mapping Engine ({harmonizedData?.rules_applied.length || 0} Rules)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200">
                  100% Normalized
                </span>
              </div>

              <div className="space-y-2 flex-1 max-h-84 overflow-y-auto pr-1">
                {harmonizedData?.rules_applied.map((rule: HarmonizationRule) => (
                  <div
                    key={rule.rule_id}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[10px] text-slate-500">
                        {rule.rule_id}
                      </span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                        {rule.transformation_applied}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-800 dark:text-slate-200 font-semibold">
                      <span className="text-amber-600 dark:text-amber-400">{rule.source_field}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="text-emerald-600 dark:text-emerald-400">{rule.target_canonical_field}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      Output: {rule.sample_output}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Canonical IndEA 2.0 Output (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white overflow-hidden flex flex-col shadow-xs">
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                  3. IndEA 2.0 Canonical Output
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(harmonizedData?.canonical_record, null, 2),
                      false
                    )
                  }
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  {copiedCanonical ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedCanonical ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="p-3 font-mono text-[11px] leading-relaxed flex-1 max-h-96 overflow-y-auto bg-slate-900/90 text-emerald-300">
                <pre>{JSON.stringify(harmonizedData?.canonical_record, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-indigo-500" />
            <span>Harmonized & Ready for Downstream API Exchange via IndEA 2.0 Data Fabric</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => executeHarmonize(selectedDeptKey)}
              disabled={isHarmonizing}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isHarmonizing ? "animate-spin" : ""}`} />
              <span>Execute Live Harmonization</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

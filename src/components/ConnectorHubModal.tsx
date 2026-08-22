"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Activity,
  Zap,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Database,
  Globe,
  RefreshCw,
  Copy,
  Check,
  Code2,
  X,
  Radio,
  FileCode,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  fetchConnectorsList,
  transformProtocol,
  ConnectorSpec,
  ProtocolTransformResponse,
} from "@/services/interoperabilityService";

interface ConnectorHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectorHubModal({ isOpen, onClose }: ConnectorHubModalProps) {
  useBodyScrollLock(isOpen);

  const [connectors, setConnectors] = useState<ConnectorSpec[]>([]);
  const [selectedConnectorId, setSelectedConnectorId] = useState<string>("conn-bhoomi");
  const [direction, setDirection] = useState<"LEGACY_TO_CANONICAL" | "CANONICAL_TO_LEGACY">(
    "LEGACY_TO_CANONICAL"
  );
  const [inputPayload, setInputPayload] = useState<string>("");
  const [transformedOutput, setTransformedOutput] = useState<string>("");
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [transformMetrics, setTransformMetrics] = useState<ProtocolTransformResponse | null>(null);
  const [copiedInput, setCopiedInput] = useState<boolean>(false);
  const [copiedOutput, setCopiedOutput] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadConnectors();
    }
  }, [isOpen]);

  const loadConnectors = async () => {
    const data = await fetchConnectorsList();
    setConnectors(data);
    const defaultConn = data.find((c) => c.id === selectedConnectorId) || data[0];
    if (defaultConn) {
      setInputPayload(defaultConn.sample_legacy_payload);
      setTransformedOutput(JSON.stringify(defaultConn.sample_canonical_json, null, 2));
    }
  };

  const handleSelectConnector = (conn: ConnectorSpec) => {
    setSelectedConnectorId(conn.id);
    if (direction === "LEGACY_TO_CANONICAL") {
      setInputPayload(conn.sample_legacy_payload);
      setTransformedOutput(JSON.stringify(conn.sample_canonical_json, null, 2));
    } else {
      setInputPayload(JSON.stringify(conn.sample_canonical_json, null, 2));
      setTransformedOutput(conn.sample_legacy_payload);
    }
    setTransformMetrics(null);
  };

  const handleToggleDirection = () => {
    const newDir = direction === "LEGACY_TO_CANONICAL" ? "CANONICAL_TO_LEGACY" : "LEGACY_TO_CANONICAL";
    setDirection(newDir);
    const conn = connectors.find((c) => c.id === selectedConnectorId);
    if (conn) {
      if (newDir === "LEGACY_TO_CANONICAL") {
        setInputPayload(conn.sample_legacy_payload);
        setTransformedOutput(JSON.stringify(conn.sample_canonical_json, null, 2));
      } else {
        setInputPayload(JSON.stringify(conn.sample_canonical_json, null, 2));
        setTransformedOutput(conn.sample_legacy_payload);
      }
    }
    setTransformMetrics(null);
  };

  const handleExecuteTransform = async () => {
    setIsTransforming(true);
    try {
      const res = await transformProtocol(selectedConnectorId, direction, inputPayload);
      setTransformedOutput(res.transformed_content);
      setTransformMetrics(res);
    } catch (e) {
      console.error("Transformation error:", e);
    } finally {
      setIsTransforming(false);
    }
  };

  const handleCopy = (text: string, isInput: boolean) => {
    navigator.clipboard.writeText(text);
    if (isInput) {
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    } else {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    }
  };

  if (!isOpen) return null;

  const currentConn = connectors.find((c) => c.id === selectedConnectorId) || connectors[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 perf-gpu animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden will-change-transform">
        {/* Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

        {/* Header */}
        <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center shadow-xs shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Reusable Legacy & Modern Connectors Hub
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-500" />
                  5 Live Adapters
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Non-Invasive Interoperability Middleware • SOAP/XML ↔ OpenAPI JSON Protocol Bridge
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

        {/* Connectors Horizontal Directory Bar */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 overscroll-contain">
          {connectors.map((conn) => {
            const isSelected = conn.id === selectedConnectorId;
            return (
              <button
                key={conn.id}
                onClick={() => handleSelectConnector(conn)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    conn.status === "ACTIVE" ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                <span>{conn.name.split(" ")[0]} ({conn.protocol.replace("_", "/")})</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? "bg-blue-700 text-blue-100" : "bg-slate-100 dark:bg-slate-700 text-slate-500"
                  }`}
                >
                  {conn.latency_ms}ms
                </span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 overscroll-contain transform-gpu">
          {/* Active Connector Overview Card */}
          {currentConn && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/40 dark:from-slate-800/60 dark:to-blue-950/20 border border-slate-200 dark:border-slate-700/80 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Adapter Spec</span>
                <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{currentConn.name}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{currentConn.department}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Protocol Type</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block mt-0.5">
                  {currentConn.protocol} ({currentConn.version})
                </span>
                <span className="text-[10px] text-slate-500 truncate block">{currentConn.endpoint_url}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Live Performance</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentConn.latency_ms} ms Latency</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{currentConn.uptime_percentage}% SLA</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Zero-Loss Failover Enabled</span>
              </div>
              <div className="flex items-center justify-end">
                <button
                  onClick={handleToggleDirection}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500" />
                  <span>Switch Direction</span>
                </button>
              </div>
            </div>
          )}

          {/* Protocol Direction Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Live Bidirectional Protocol Transformation
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {direction === "LEGACY_TO_CANONICAL"
                  ? `${currentConn?.protocol} → Canonical OpenAPI JSON`
                  : `Canonical JSON → ${currentConn?.protocol}`}
              </span>
            </div>

            {transformMetrics && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Transformed in {transformMetrics.transformation_latency_ms}ms ({transformMetrics.mapped_fields_count} fields mapped)
              </span>
            )}
          </div>

          {/* Split-Screen Code & Protocol Converter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Panel: Source Protocol Input */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white overflow-hidden flex flex-col">
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  {direction === "LEGACY_TO_CANONICAL"
                    ? `Source Legacy Envelope (${currentConn?.protocol})`
                    : "Source Canonical JSON"}
                </span>
                <button
                  onClick={() => handleCopy(inputPayload, true)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  {copiedInput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedInput ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="p-3 font-mono text-[11px] leading-relaxed overflow-x-auto flex-1 max-h-72 bg-slate-900/90 text-slate-200">
                <textarea
                  value={inputPayload}
                  onChange={(e) => setInputPayload(e.target.value)}
                  className="w-full h-64 bg-transparent outline-none resize-none font-mono text-[11px] text-amber-300"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Right Panel: Transformed Output */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white overflow-hidden flex flex-col">
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  {direction === "LEGACY_TO_CANONICAL"
                    ? "Transformed Canonical OpenAPI JSON"
                    : `Transformed Legacy Envelope (${currentConn?.protocol})`}
                </span>
                <button
                  onClick={() => handleCopy(transformedOutput, false)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  {copiedOutput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedOutput ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="p-3 font-mono text-[11px] leading-relaxed overflow-x-auto flex-1 max-h-72 bg-slate-900/90 text-emerald-300">
                <pre>{transformedOutput}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Complies with MeitY National Open Digital Ecosystem (NODE) & API Setu Specifications
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handleExecuteTransform}
              disabled={isTransforming}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTransforming ? "animate-spin" : ""}`} />
              <span>Execute Live Transformation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

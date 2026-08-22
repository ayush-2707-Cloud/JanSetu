"use client";

import React, { useState, useEffect } from "react";
import {
  GitBranch,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Radio,
  Sliders,
  X,
  Layers,
  Save,
} from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import {
  fetchWorkflowRules,
  updateWorkflowRule,
  WorkflowGraph,
  WorkflowNodeRule,
} from "@/services/tier1MiddlewareService";

interface WorkflowRuleManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  journeyId?: string;
  onRuleUpdated?: () => void;
}

export default function WorkflowRuleManagerModal({
  isOpen,
  onClose,
  journeyId = "msme-food-business",
  onRuleUpdated,
}: WorkflowRuleManagerModalProps) {
  useBodyScrollLock(isOpen);

  const [workflowGraph, setWorkflowGraph] = useState<WorkflowGraph | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("step-fssai-03");
  const [editingPrerequisites, setEditingPrerequisites] = useState<string[]>([]);
  const [editingIsOptional, setEditingIsOptional] = useState<boolean>(false);
  const [editingCondition, setEditingCondition] = useState<string>("");
  const [editingSLA, setEditingSLA] = useState<number>(48);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadGraph();
    }
  }, [isOpen, journeyId]);

  const loadGraph = async () => {
    const data = await fetchWorkflowRules(journeyId);
    setWorkflowGraph(data);
    const targetNode = data.nodes.find((n) => n.step_id === selectedNodeId) || data.nodes[2];
    if (targetNode) {
      setSelectedNodeId(targetNode.step_id);
      setEditingPrerequisites(targetNode.prerequisites);
      setEditingIsOptional(targetNode.is_optional);
      setEditingCondition(targetNode.conditional_rule || "");
      setEditingSLA(targetNode.statutory_sla_hours);
    }
  };

  const handleSelectNode = (node: WorkflowNodeRule) => {
    setSelectedNodeId(node.step_id);
    setEditingPrerequisites(node.prerequisites);
    setEditingIsOptional(node.is_optional);
    setEditingCondition(node.conditional_rule || "");
    setEditingSLA(node.statutory_sla_hours);
    setSaveSuccess(false);
  };

  const handleTogglePrerequisite = (prereqId: string) => {
    setEditingPrerequisites((prev) =>
      prev.includes(prereqId) ? prev.filter((id) => id !== prereqId) : [...prev, prereqId]
    );
  };

  const handleSaveRule = async () => {
    setIsSaving(true);
    try {
      const updated = await updateWorkflowRule(
        journeyId,
        selectedNodeId,
        editingPrerequisites,
        editingIsOptional,
        editingCondition || undefined,
        editingSLA
      );
      setWorkflowGraph(updated);
      setSaveSuccess(true);
      if (onRuleUpdated) {
        onRuleUpdated();
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error("Save workflow rule error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const currentNode = workflowGraph?.nodes.find((n) => n.step_id === selectedNodeId);
  const availablePrereqOptions =
    workflowGraph?.nodes.filter((n) => n.step_id !== selectedNodeId) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 perf-gpu animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden will-change-transform">
        {/* Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500" />

        {/* Header */}
        <div className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center justify-center shadow-xs shrink-0">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Visual Configurable Workflow Orchestrator (DAG Engine)
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-purple-500" />
                  Live EventBus Broadcast Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                No-Code Dependency Graph Rule Manager • Dynamically Modify Sequence & Conditions at Runtime
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

        {/* Nodes Selector Horizontal Bar */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 overscroll-contain">
          {workflowGraph?.nodes.map((node) => {
            const isSelected = node.step_id === selectedNodeId;
            return (
              <button
                key={node.step_id}
                onClick={() => handleSelectNode(node)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="font-mono text-[10px]">Step {node.step_number}:</span>
                <span className="truncate max-w-[140px]">{node.step_title.split(" ")[0]}...</span>
                {node.is_optional && (
                  <span className="text-[9px] px-1 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                    Opt
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 overscroll-contain transform-gpu text-xs">
          {currentNode && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Column: Node Configuration Editor (7 cols) */}
              <div className="md:col-span-7 space-y-4">
                {/* Node Metadata Card */}
                <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">
                      Step #{currentNode.step_number} Configuration Desk
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">{currentNode.step_id}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {currentNode.step_title}
                  </h3>
                  <span className="text-slate-600 dark:text-slate-400 block">{currentNode.department}</span>
                </div>

                {/* 1. Prerequisites Multi-Select Toggle */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block">
                    Prerequisite Milestone Dependencies (Steps required BEFORE this step unlocks):
                  </label>
                  <div className="space-y-1.5">
                    {availablePrereqOptions.map((opt) => {
                      const isRequired = editingPrerequisites.includes(opt.step_id);
                      return (
                        <button
                          key={opt.step_id}
                          type="button"
                          onClick={() => handleTogglePrerequisite(opt.step_id)}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isRequired
                              ? "bg-purple-50 dark:bg-purple-950/60 border-purple-600 text-purple-900 dark:text-purple-200 font-bold shadow-xs"
                              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-slate-400">Step {opt.step_number}</span>
                            <span>{opt.step_title}</span>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                              isRequired
                                ? "bg-purple-600 text-white"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-500"
                            }`}
                          >
                            {isRequired ? "MANDATORY PREREQUISITE" : "NOT REQUIRED"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Optional Switch */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      Optional Exemption Status
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Allow citizens to bypass this step if statutory exemptions apply
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingIsOptional}
                      onChange={(e) => setEditingIsOptional(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                  </label>
                </div>

                {/* 3. Conditional Rule Expression */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block">
                    Dynamic Conditional Exemption Rule (Python / JS Expression):
                  </label>
                  <input
                    type="text"
                    value={editingCondition}
                    onChange={(e) => setEditingCondition(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g. water_test_exempt = daily_orders < 20"
                  />
                </div>

                {/* 4. Statutory SLA Window */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block">
                    Statutory Citizen Charter SLA Window (Hours):
                  </label>
                  <input
                    type="number"
                    value={editingSLA}
                    onChange={(e) => setEditingSLA(parseInt(e.target.value, 10) || 48)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Right Column: Live DAG Dependency Tree Preview (5 cols) */}
              <div className="md:col-span-5 rounded-2xl bg-slate-900 text-white p-4 space-y-3 flex flex-col justify-between shadow-xs">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-purple-400 block">
                    Live Directed Acyclic Graph (DAG) Preview
                  </span>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] space-y-2 text-slate-300 leading-relaxed">
                    <div>Journey: "{workflowGraph?.journey_name}"</div>
                    <div className="text-purple-400 font-bold pt-1">
                      Node: {currentNode.step_title}
                    </div>
                    <div>Prerequisites: {JSON.stringify(editingPrerequisites)}</div>
                    <div>Optional: {editingIsOptional ? "TRUE" : "FALSE"}</div>
                    <div>Rule: "{editingCondition || "NONE"}"</div>
                    <div>Statutory SLA: {editingSLA} Hours</div>
                  </div>
                </div>

                {saveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>DAG updated live & broadcasted to all active citizen clients via SSE!</span>
                  </div>
                )}

                <button
                  onClick={handleSaveRule}
                  disabled={isSaving}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save DAG Rule & Broadcast Live</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Enables runtime adaptation of Maharashtra statutory rules without code redeployments
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            Close Rule Manager
          </button>
        </div>
      </div>
    </div>
  );
}

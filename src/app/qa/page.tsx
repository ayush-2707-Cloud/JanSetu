"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Square,
  Sparkles,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  ListFilter,
  Layers,
  Search,
  ShieldCheck,
  Download,
  ArrowLeft,
  Sliders,
} from "lucide-react";
import { GovTechHeader } from "@/components/GovTechHeader";
import { useToast } from "@/context/ToastContext";

interface TestCase {
  id: string;
  category: "UI_TIMELINE" | "GOVTECH_TOOLS" | "AI_COPILOT" | "PWA_COLLAB" | "ROUTING" | "BACKEND";
  title: string;
  howToTest: string;
  launchUrl?: string;
}

const MASTER_TEST_CASES: TestCase[] = [
  // UI & Timeline
  {
    id: "ui_fab",
    category: "UI_TIMELINE",
    title: "1.1 Back to Top & Active Step Floating FAB",
    howToTest: "Scroll down on roadmap -> click 'Top' or 'Step 2' in bottom-right corner.",
    launchUrl: "/journey/karnataka_cloud_kitchen_setup",
  },
  {
    id: "ui_confetti",
    category: "UI_TIMELINE",
    title: "1.2 Confetti & Step Completion Micro-Interactions",
    howToTest: "Complete any sub-step -> observe GPU confetti burst + green check bounce + stem line fill.",
    launchUrl: "/journey/karnataka_cloud_kitchen_setup",
  },
  {
    id: "ui_drawer_resize",
    category: "UI_TIMELINE",
    title: "1.3 Resizable Instruction Drawer (380px - 1100px)",
    howToTest: "Click a milestone card -> drag left border to resize -> refresh page to verify memory.",
    launchUrl: "/journey/karnataka_cloud_kitchen_setup",
  },
  {
    id: "ui_keyboard",
    category: "UI_TIMELINE",
    title: "1.4 Keyboard Navigation (↓/↑, 1/2/3/4, Esc)",
    howToTest: "Use Arrow keys to switch steps, 1-4 for drawer tabs, Esc to close.",
    launchUrl: "/journey/karnataka_cloud_kitchen_setup",
  },
  {
    id: "ui_lang_theme",
    category: "UI_TIMELINE",
    title: "1.5 Multi-Language (EN/HI/KN) & Dark Mode",
    howToTest: "Switch language and theme in header -> observe seamless typography and cross-fade.",
    launchUrl: "/",
  },

  // GovTech Toolkits
  {
    id: "tool_stamp_duty",
    category: "GOVTECH_TOOLS",
    title: "2.1 Dynamic State Stamp Duty Calculator",
    howToTest: "Click 'e-Stamp Duty' in toolbar -> compute KA/MH lease duty and registration fees.",
    launchUrl: "/journey/karnataka_cloud_kitchen_setup",
  },
  {
    id: "tool_dsc_qr",
    category: "GOVTECH_TOOLS",
    title: "2.2 Cryptographic QR & DSC Verifier",
    howToTest: "Open drawer -> Required Docs -> click 'Verify DSC / QR' for Class-3 RSA integrity check.",
    launchUrl: "/journey/karnataka_cloud_kitchen_setup/step/step_bbmp_trade",
  },
  {
    id: "tool_bylaws_diff",
    category: "GOVTECH_TOOLS",
    title: "2.3 Municipal Compliance Diff Engine (BBMP vs BMC)",
    howToTest: "Click 'City Bylaws Diff' in header -> compare trade license SLAs and inspection rules.",
    launchUrl: "/",
  },
  {
    id: "tool_sms_dispatch",
    category: "GOVTECH_TOOLS",
    title: "2.4 Real-Time SMS & WhatsApp Dispatch Sandbox",
    howToTest: "Click 'SMS / WhatsApp Alert' in toolbar -> simulate C-DAC & Meta WhatsApp dispatch.",
    launchUrl: "/journey/karnataka_cloud_kitchen_setup",
  },
  {
    id: "tool_nodal_finder",
    category: "GOVTECH_TOOLS",
    title: "2.5 Geo-Located Nodal Officer & CSC Finder",
    howToTest: "Click 'Find Nodal Offices' in toolbar -> search pincode '560038' for SROs & CSC centers.",
    launchUrl: "/journey/karnataka_cloud_kitchen_setup",
  },
  {
    id: "tool_gantt_critical",
    category: "GOVTECH_TOOLS",
    title: "2.6 Milestone GANTT Critical Path View",
    howToTest: "View GANTT chart above roadmap -> toggle Critical Path bottleneck highlighting.",
    launchUrl: "/journey/karnataka_cloud_kitchen_setup",
  },
  {
    id: "tool_dossier_export",
    category: "GOVTECH_TOOLS",
    title: "2.7 Statutory Citizen Dossier & PDF Export",
    howToTest: "Click 'Export Dossier (PDF)' in toolbar -> download .html or trigger print stylesheet.",
    launchUrl: "/journey/karnataka_cloud_kitchen_setup",
  },

  // AI & Voice
  {
    id: "ai_voice_input",
    category: "AI_COPILOT",
    title: "3.1 Voice Recognition (EN / HI / KN)",
    howToTest: "Click ✨ bottom-right -> click 🎙️ -> speak 'Help me register for FSSAI in Karnataka'.",
    launchUrl: "/",
  },
  {
    id: "ai_generative_ui",
    category: "AI_COPILOT",
    title: "3.2 Generative UI Autonomous Navigation",
    howToTest: "Click quick prompt chip -> watch AI load journey, scroll to step, and open drawer.",
    launchUrl: "/",
  },
  {
    id: "ai_barge_in",
    category: "AI_COPILOT",
    title: "3.3 Full-Duplex Speech Barge-in",
    howToTest: "Speak while AI voice is reading -> audio immediately cuts off for collision-free speech.",
    launchUrl: "/",
  },
  {
    id: "ai_rag_citations",
    category: "AI_COPILOT",
    title: "3.4 Grounded ChromaDB RAG with .gov.in Citations",
    howToTest: "Ask legal question in drawer chat -> verify department manual citation links.",
    launchUrl: "/journey/karnataka_cloud_kitchen_setup",
  },

  // PWA & Collaboration
  {
    id: "pwa_encrypted_vault",
    category: "PWA_COLLAB",
    title: "4.1 AES-256-GCM Encrypted Offline Document Vault",
    howToTest: "Click 'Encrypted Vault (Offline)' -> set PIN -> encrypt and preview sample document.",
    launchUrl: "/journey/karnataka_cloud_kitchen_setup",
  },
  {
    id: "collab_hub",
    category: "PWA_COLLAB",
    title: "4.2 Multi-Party Co-Applicant Collaboration Hub",
    howToTest: "Click 'Co-Applicant Collab' -> invite member -> test real-time sync across browser tabs.",
    launchUrl: "/journey/karnataka_cloud_kitchen_setup",
  },

  // Routing
  {
    id: "route_explore",
    category: "ROUTING",
    title: "5.1 Domain Explorer Page (/explore)",
    howToTest: "Browse 6 legal domains and 20+ procedural sub-activities.",
    launchUrl: "/explore",
  },
  {
    id: "route_search",
    category: "ROUTING",
    title: "5.2 Full Search Engine (/search?q=FSSAI)",
    howToTest: "Search keywords and filter by authority or domain.",
    launchUrl: "/search?q=FSSAI",
  },
  {
    id: "route_resources",
    category: "ROUTING",
    title: "5.3 Government Portals Directory (/resources)",
    howToTest: "Check official acts, helplines, and direct .gov.in links.",
    launchUrl: "/resources",
  },
  {
    id: "route_sitemap",
    category: "ROUTING",
    title: "5.4 Sitemap & Robots (/sitemap.xml, /robots.txt)",
    howToTest: "Open /sitemap.xml and /robots.txt in browser to verify valid schema.",
    launchUrl: "/sitemap.xml",
  },
];

const STORAGE_KEY = "civic_qa_checklist_v1";

export default function QAPage() {
  const { showToast } = useToast();
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCheckedIds(JSON.parse(raw));
    } catch {}
  }, []);

  const toggleCheck = (id: string) => {
    const updated = { ...checkedIds, [id]: !checkedIds[id] };
    setCheckedIds(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleCheckAll = () => {
    const allChecked: Record<string, boolean> = {};
    MASTER_TEST_CASES.forEach((tc) => (allChecked[tc.id] = true));
    setCheckedIds(allChecked);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allChecked));
    } catch {}
    showToast("✓ All test cases marked as passed!", "success");
  };

  const handleReset = () => {
    setCheckedIds({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    showToast("Checklist reset to zero.", "info");
  };

  const totalTests = MASTER_TEST_CASES.length;
  const passedCount = MASTER_TEST_CASES.filter((tc) => checkedIds[tc.id]).length;
  const progressPct = Math.round((passedCount / totalTests) * 100);

  const filteredTests = MASTER_TEST_CASES.filter((tc) => {
    const matchesFilter = activeFilter === "ALL" || tc.category === activeFilter;
    const matchesSearch =
      tc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.howToTest.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <GovTechHeader />

      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Hero */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
              <Link href="/" className="hover:underline flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <span>/</span>
              <span>QA Testing Hub</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <CheckSquare className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              <span>Interactive Platform Testing Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Track and check off tests across all features, tools, and pages with instant 1-click test launchers.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Testing Progress:</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {passedCount} / {totalTests}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px]">Pass Rate:</span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                {progressPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: "ALL", label: "All Tests" },
              { id: "UI_TIMELINE", label: "🎨 UI & Timeline" },
              { id: "GOVTECH_TOOLS", label: "🏛️ GovTech Tools" },
              { id: "AI_COPILOT", label: "🤖 AI Copilot" },
              { id: "PWA_COLLAB", label: "🔒 Vault & Collab" },
              { id: "ROUTING", label: "🌐 Pages & Routes" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCheckAll}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer"
            >
              Check All
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold transition-all cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Checklist Container */}
        <div className="space-y-3">
          {filteredTests.map((tc) => {
            const isChecked = !!checkedIds[tc.id];

            return (
              <div
                key={tc.id}
                onClick={() => toggleCheck(tc.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isChecked
                    ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 shadow-xs"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 text-blue-600 dark:text-blue-400 shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="space-y-0.5 text-left">
                    <h4
                      className={`text-xs sm:text-sm font-bold ${
                        isChecked
                          ? "text-emerald-900 dark:text-emerald-200 line-through opacity-80"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {tc.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {tc.howToTest}
                    </p>
                  </div>
                </div>

                {tc.launchUrl && (
                  <Link
                    href={tc.launchUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3.5 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <span>Test Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}

"use client";

import React from "react";
import {
  ExternalLink,
  Download,
  Search,
  CreditCard,
  FileText,
  Info,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { OfficialLink, OfficialLinkType, Language } from "@/types/journey";

interface OfficialLinksPanelProps {
  links: OfficialLink[];
  language: Language;
}

const linkTypeConfig: Record<
  OfficialLinkType,
  { icon: React.ElementType; color: string; bgColor: string; label: string }
> = {
  APPLY: {
    icon: ExternalLink,
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-100 dark:bg-blue-950/80",
    label: "Apply Online",
  },
  DOWNLOAD: {
    icon: Download,
    color: "text-emerald-700 dark:text-emerald-300",
    bgColor: "bg-emerald-100 dark:bg-emerald-950/80",
    label: "Download Form",
  },
  VERIFY: {
    icon: Search,
    color: "text-indigo-700 dark:text-indigo-300",
    bgColor: "bg-indigo-100 dark:bg-indigo-950/80",
    label: "Verify Status",
  },
  TRACK: {
    icon: FileText,
    color: "text-amber-700 dark:text-amber-300",
    bgColor: "bg-amber-100 dark:bg-amber-950/80",
    label: "Track Application",
  },
  PAY: {
    icon: CreditCard,
    color: "text-violet-700 dark:text-violet-300",
    bgColor: "bg-violet-100 dark:bg-violet-950/80",
    label: "Pay Fees",
  },
  INFO: {
    icon: Info,
    color: "text-slate-700 dark:text-slate-300",
    bgColor: "bg-slate-100 dark:bg-slate-800",
    label: "Information",
  },
};

/**
 * Displays official government portal links organized by type.
 * Each link is tagged with its purpose (Apply, Download, Verify, Track, Pay)
 * and shows a government-verified badge for `.gov.in` domains.
 */
export const OfficialLinksPanel: React.FC<OfficialLinksPanelProps> = ({
  links,
  language,
}) => {
  if (!links || links.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {language === "HI"
            ? "आधिकारिक पोर्टल लिंक"
            : language === "KN"
            ? "ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಲಿಂಕ್‌ಗಳು"
            : "Official Portal Links"}
        </h4>
      </div>

      <div className="space-y-2">
        {links.map((link) => {
          const config = linkTypeConfig[link.type];
          const Icon = config.icon;
          const isGovDomain = link.url.includes(".gov.in") || link.url.includes(".nic.in");

          const label =
            language === "HI" && link.labelHi
              ? link.labelHi
              : language === "KN" && link.labelKn
              ? link.labelKn
              : link.label;

          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${config.bgColor} ${config.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {label}
                      </span>

                      {/* Type Badge */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}
                      >
                        {config.label}
                      </span>

                      {/* Government Verified Badge */}
                      {(link.isGovernment || isGovDomain) && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Govt Verified</span>
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                      {link.portal} • {link.url.replace(/^https?:\/\//, "").split("/")[0]}
                    </span>
                  </div>
                </div>

                <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transform" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

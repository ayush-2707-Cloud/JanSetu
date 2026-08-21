"use client";

import React from "react";
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from "lucide-react";
import { LegalPrecaution, PrecautionSeverity, Language } from "@/types/journey";

interface PrecautionBannerProps {
  precautions: LegalPrecaution[];
  language: Language;
}

const severityConfig: Record<
  PrecautionSeverity,
  {
    icon: React.ElementType;
    containerClass: string;
    iconClass: string;
    titleClass: string;
    descClass: string;
    label: string;
    labelHi: string;
    labelKn: string;
  }
> = {
  CRITICAL: {
    icon: ShieldAlert,
    containerClass: "bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-900 ring-1 ring-red-200 dark:ring-red-900/50",
    iconClass: "bg-red-600 text-white",
    titleClass: "text-red-900 dark:text-red-300",
    descClass: "text-red-950/80 dark:text-red-200/80",
    label: "CRITICAL WARNING",
    labelHi: "गंभीर चेतावनी",
    labelKn: "ಕ್ರಿಟಿಕಲ್ ಎಚ್ಚರಿಕೆ",
  },
  WARNING: {
    icon: AlertTriangle,
    containerClass: "bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-900",
    iconClass: "bg-amber-500 text-white",
    titleClass: "text-amber-900 dark:text-amber-300",
    descClass: "text-amber-950/80 dark:text-amber-200/80",
    label: "IMPORTANT",
    labelHi: "महत्वपूर्ण",
    labelKn: "ಮುಖ್ಯ",
  },
  INFO: {
    icon: Info,
    containerClass: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900",
    iconClass: "bg-blue-600 text-white",
    titleClass: "text-blue-900 dark:text-blue-300",
    descClass: "text-blue-950/80 dark:text-blue-200/80",
    label: "GOOD TO KNOW",
    labelHi: "जानने योग्य",
    labelKn: "ತಿಳಿಯಲು ಒಳ್ಳೆಯದು",
  },
};

/**
 * Displays severity-tagged precaution banners for a journey step.
 * CRITICAL items have a red alarm styling, WARNING is amber, INFO is blue.
 */
export const PrecautionBanner: React.FC<PrecautionBannerProps> = ({
  precautions,
  language,
}) => {
  if (!precautions || precautions.length === 0) return null;

  // Sort: CRITICAL first, then WARNING, then INFO
  const sortOrder: Record<PrecautionSeverity, number> = {
    CRITICAL: 0,
    WARNING: 1,
    INFO: 2,
  };

  const sorted = [...precautions].sort(
    (a, b) => sortOrder[a.severity] - sortOrder[b.severity]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {language === "HI"
            ? "सावधानियां और चेतावनियां"
            : language === "KN"
            ? "ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು"
            : "Precautions & Warnings"}
        </h4>
      </div>

      {sorted.map((precaution) => {
        const config = severityConfig[precaution.severity];
        const Icon = config.icon;

        const title =
          language === "HI" && precaution.titleHi
            ? precaution.titleHi
            : language === "KN" && precaution.titleKn
            ? precaution.titleKn
            : precaution.title;

        const description =
          language === "HI" && precaution.descriptionHi
            ? precaution.descriptionHi
            : language === "KN" && precaution.descriptionKn
            ? precaution.descriptionKn
            : precaution.description;

        const severityLabel =
          language === "HI"
            ? config.labelHi
            : language === "KN"
            ? config.labelKn
            : config.label;

        return (
          <div
            key={precaution.id}
            className={`p-4 rounded-xl border flex items-start gap-3.5 ${config.containerClass}`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 mt-0.5 ${config.iconClass}`}
            >
              <Icon className="w-4 h-4" />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider ${config.titleClass}`}
                >
                  {severityLabel}
                </span>
              </div>

              <h5
                className={`text-sm font-bold leading-snug ${config.titleClass}`}
              >
                {title}
              </h5>

              <p className={`text-xs leading-relaxed ${config.descClass}`}>
                {description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

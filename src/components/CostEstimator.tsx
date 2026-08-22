"use client";

import React from "react";
import { IndianRupee, Calculator, TrendingUp } from "lucide-react";
import { EnhancedJourney, Language } from "@/types/journey";

interface CostEstimatorProps {
  journey: EnhancedJourney;
  language: Language;
}

/**
 * Accumulated cost breakdown for a journey.
 * Shows government fees, professional charges, and total estimated range.
 */
const CostEstimatorComponent: React.FC<CostEstimatorProps> = ({
  journey,
  language,
}) => {
  const cost = journey.totalEstimatedCost;

  // Fallback: compute from individual step fees if no totalEstimatedCost
  const stepFees = journey.steps
    .filter((s) => s.instructions.fee)
    .map((s) => ({
      stepNumber: s.stepNumber,
      title: s.title,
      fee: s.instructions.fee!,
    }));

  if (!cost && stepFees.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {language === "HI"
            ? "अनुमानित लागत विवरण"
            : language === "KN"
            ? "ಅಂದಾಜು ವೆಚ್ಚ ವಿವರ"
            : "Estimated Cost Breakdown"}
        </h4>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        {/* Total Estimate (if available) */}
        {cost && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  {language === "HI"
                    ? "कुल अनुमानित लागत"
                    : language === "KN"
                    ? "ಒಟ್ಟು ಅಂದಾಜು ವೆಚ್ಚ"
                    : "Total Estimated Cost"}
                </span>
              </div>
              <span className="text-lg font-black text-emerald-900 dark:text-emerald-200">
                {cost.totalRange}
              </span>
            </div>
          </div>
        )}

        {/* Cost Line Items */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {cost?.governmentFees && (
            <div className="px-4 py-3 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
                <IndianRupee className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {language === "HI" ? "सरकारी शुल्क" : language === "KN" ? "ಸರ್ಕಾರಿ ಶುಲ್ಕ" : "Government Fees"}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{cost.governmentFees}</span>
            </div>
          )}

          {cost?.professionalCharges && (
            <div className="px-4 py-3 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
                <IndianRupee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                {language === "HI" ? "पेशेवर शुल्क (CA/वकील)" : language === "KN" ? "ವೃತ್ತಿಪರ ಶುಲ್ಕ (CA/ವಕೀಲ)" : "Professional Charges (CA/Lawyer)"}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{cost.professionalCharges}</span>
            </div>
          )}

          {/* Per-step fee breakdown */}
          {stepFees.length > 0 && (
            <>
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {language === "HI" ? "चरण-वार शुल्क" : language === "KN" ? "ಹಂತ-ವಾರ ಶುಲ್ಕ" : "Per-Step Fees"}
                </span>
              </div>
              {stepFees.map((sf) => (
                <div
                  key={sf.stepNumber}
                  className="px-4 py-2.5 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-600 dark:text-slate-400 truncate max-w-[240px]">
                    Step {sf.stepNumber}: {sf.title}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0 ml-2">
                    {sf.fee}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Disclaimer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
            {language === "HI"
              ? "* शुल्क अनुमानित हैं और सरकारी संशोधनों के अधीन बदल सकते हैं। वर्तमान शुल्क के लिए आधिकारिक पोर्टल पर जाँच करें।"
              : language === "KN"
              ? "* ಶುಲ್ಕಗಳು ಅಂದಾಜು ಮಾತ್ರ ಮತ್ತು ಸರ್ಕಾರಿ ಪರಿಷ್ಕರಣೆಗಳಿಗೆ ಒಳಪಟ್ಟಿವೆ. ಪ್ರಸ್ತುತ ಶುಲ್ಕಗಳಿಗಾಗಿ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ನೋಡಿ."
              : "* Fees are estimates and subject to government revisions. Verify current fees on the official portal."}
          </p>
        </div>
      </div>
    </div>
  );
};

export const CostEstimator = React.memo(CostEstimatorComponent);

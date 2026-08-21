"use client";

import React, { useMemo } from "react";
import { Calendar, AlertTriangle, Building2 } from "lucide-react";
import { UniversalJourney, Language } from "@/types/journey";

interface HolidayAlertBannerProps {
  journey: UniversalJourney;
  language: Language;
  className?: string;
}

interface GazettedHoliday {
  date: string; // YYYY-MM-DD
  name: string;
  nameHi: string;
  nameKn: string;
  type: "National" | "State" | "Restricted";
  affectedOffices: string[];
}

const INDIAN_HOLIDAYS: GazettedHoliday[] = [
  {
    date: "2026-08-15",
    name: "Independence Day",
    nameHi: "स्वतंत्रता दिवस",
    nameKn: "ಸ್ವಾತಂತ್ರ್ಯ ದಿನಾಚರಣೆ",
    type: "National",
    affectedOffices: ["All Central & State Govt Offices", "Registrar", "Banks"],
  },
  {
    date: "2026-08-26",
    name: "Janmashtami",
    nameHi: "जन्माष्टमी",
    nameKn: "ಜನ್ಮಾಷ್ಟಮಿ",
    type: "Restricted",
    affectedOffices: ["Municipal Corporations", "Tahsildar Offices"],
  },
  {
    date: "2026-10-02",
    name: "Gandhi Jayanti",
    nameHi: "गांधी जयंती",
    nameKn: "ಗಾಂಧಿ ಜಯಂತಿ",
    type: "National",
    affectedOffices: ["All Govt Portals & Offices", "Sub-Registrar Offices"],
  },
  {
    date: "2026-11-01",
    name: "Kannada Rajyotsava",
    nameHi: "कन्नड़ राज्योत्सव",
    nameKn: "ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ",
    type: "State",
    affectedOffices: ["Karnataka State Govt Offices", "BBMP", "BDA"],
  },
  {
    date: "2026-01-26",
    name: "Republic Day",
    nameHi: "गणतंत्र दिवस",
    nameKn: "ಗಣರಾಜ್ಯೋತ್ಸವ",
    type: "National",
    affectedOffices: ["All Central & State Offices", "Banks", "RTO"],
  },
];

export const HolidayAlertBanner: React.FC<HolidayAlertBannerProps> = ({
  journey,
  language,
  className,
}) => {
  // Check if any step in this journey requires physical presence or manual verification
  const requiresPhysicalOffice = useMemo(() => {
    return journey.steps.some(
      (s) =>
        s.instructions?.actionUrl === undefined ||
        s.category?.toLowerCase().includes("physical") ||
        s.category?.toLowerCase().includes("verification") ||
        s.instructions?.summary?.toLowerCase().includes("visit") ||
        s.instructions?.summary?.toLowerCase().includes("office")
    );
  }, [journey]);

  // Find nearest upcoming holiday within 14 days
  const upcomingHoliday = useMemo(() => {
    const today = new Date();
    const futureLimit = new Date();
    futureLimit.setDate(today.getDate() + 30);

    for (const h of INDIAN_HOLIDAYS) {
      const hDate = new Date(h.date);
      // If holiday is within next 30 days
      if (hDate >= today && hDate <= futureLimit) {
        return h;
      }
    }
    // Return the first one as representative demonstration if none in next 30 days
    return INDIAN_HOLIDAYS[1]; // Janmashtami upcoming demo
  }, []);

  if (!requiresPhysicalOffice || !upcomingHoliday) {
    return null;
  }

  const holidayName =
    language === "HI"
      ? upcomingHoliday.nameHi
      : language === "KN"
      ? upcomingHoliday.nameKn
      : upcomingHoliday.name;

  return (
    <div
      role="alert"
      className={`bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 transition-colors ${className || ""}`}
    >
      <div className="p-1.5 bg-amber-100 dark:bg-amber-900/60 rounded-lg text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
        <AlertTriangle className="w-4 h-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2 font-bold">
          <span>🏛️ Government Holiday Advisory:</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-200/70 dark:bg-amber-800/60 text-amber-950 dark:text-amber-100 text-[11px]">
            <Calendar className="w-3 h-3" />
            {holidayName} ({new Date(upcomingHoliday.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })})
          </span>
        </div>
        <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed text-[11px]">
          Physical counters (such as {upcomingHoliday.affectedOffices.slice(0, 2).join(", ")}) may remain closed on this day. Plan your milestone submission or offline document verification accordingly.
        </p>
      </div>
    </div>
  );
};

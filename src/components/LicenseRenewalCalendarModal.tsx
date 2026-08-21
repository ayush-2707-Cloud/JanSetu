"use client";

import React, { useState } from "react";
import {
  Calendar,
  X,
  Clock,
  Download,
  ShieldCheck,
  AlertCircle,
  BellRing,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import { UniversalJourney } from "@/types/journey";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface LicenseRenewalCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: UniversalJourney;
}

export const LicenseRenewalCalendarModal: React.FC<LicenseRenewalCalendarModalProps> = ({
  isOpen,
  onClose,
  journey,
}) => {
  // Universal background scroll lock
  useBodyScrollLock(isOpen);

  const [validityYears, setValidityYears] = useState<number>(1);
  const [issuedDate, setIssuedDate] = useState<string>(new Date().toISOString().split("T")[0]);

  if (!isOpen) return null;

  // Calculate Expiration and 30-Day Prior Notification Date
  const expiryDate = new Date(issuedDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + validityYears);

  const reminderDate = new Date(expiryDate);
  reminderDate.setDate(reminderDate.getDate() - 30);

  const expiryFormatted = expiryDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const reminderFormatted = reminderDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Generate .ICS Calendar File
  const handleDownloadICS = () => {
    const formatDateICS = (d: Date) => {
      return d.toISOString().replace(/-|:|\.\d\d\d/g, "").substring(0, 15) + "Z";
    };

    const startDate = formatDateICS(reminderDate);
    const endDate = formatDateICS(new Date(reminderDate.getTime() + 3600000));

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//JanSetu//Statutory License Tracker//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@jansetu.gov.in
DTSTAMP:${formatDateICS(new Date())}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:⚠️ Statutory Renewal Due in 30 Days: ${journey.title}
DESCRIPTION:Your government license / clearance for ${journey.title} expires on ${expiryFormatted}. Initiate your renewal application on the official portal at least 30 days prior to avoid late fees or operational cessation.
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT1440M
ACTION:DISPLAY
DESCRIPTION:Statutory Renewal Deadline Reminder
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Statutory_Renewal_${journey.journeyId}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in" onClick={onClose} />

      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>License Expiry & Renewal Tracker</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Automated statutory renewal alerts to prevent late penalties.
                </p>
              </div>
            </div>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Active Certificate / License
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {journey.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Statutory Authority: {journey.department}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Date of Issue / Grant
                </label>
                <input
                  type="date"
                  value={issuedDate}
                  onChange={(e) => setIssuedDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Validity Period
                </label>
                <select
                  value={validityYears}
                  onChange={(e) => setValidityYears(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs"
                >
                  <option value={1}>1 Year (Annual)</option>
                  <option value={2}>2 Years</option>
                  <option value={3}>3 Years</option>
                  <option value={5}>5 Years (Long-term)</option>
                </select>
              </div>
            </div>

            {/* Calculated Timeline Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 font-medium">Statutory Expiration Date:</span>
                <span className="font-extrabold text-red-600 dark:text-red-400 font-mono">
                  {expiryFormatted}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Proactive 30-Day Alert Trigger:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {reminderFormatted}
                </span>
              </div>
            </div>

            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Click below to download an official <span className="font-bold font-mono text-blue-600 dark:text-blue-400">.ICS calendar event</span> compatible with Google Calendar, Apple Calendar, and Microsoft Outlook.
            </p>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer">
              Cancel
            </button>
            <button
              onClick={handleDownloadICS}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export .ICS Calendar Reminder</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

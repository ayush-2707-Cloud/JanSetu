"use client";

import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Send,
  CheckCheck,
  Bell,
  MessageSquare,
  ShieldCheck,
  X,
  Volume2,
  Sparkles,
  Zap,
} from "lucide-react";
import { useAccessibility } from "@/context/AccessibilityContext";
import {
  simulatePushNotification,
  fetchRecentNotifications,
  PushNotificationRecord,
} from "@/services/tier3Service";

export default function MobilePhoneMockup() {
  const { isMobilePhoneOpen, setIsMobilePhoneOpen } = useAccessibility();

  const [activeTab, setActiveTab] = useState<"WHATSAPP" | "SMS">("WHATSAPP");
  const [notifications, setNotifications] = useState<PushNotificationRecord[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    if (isMobilePhoneOpen) {
      loadHistory();
    }
  }, [isMobilePhoneOpen]);

  const loadHistory = async () => {
    const data = await fetchRecentNotifications();
    setNotifications(data);
  };

  const handleSendTestPush = async (
    eventType: string,
    department: string,
    customMsg?: string
  ) => {
    setIsSending(true);
    try {
      const record = await simulatePushNotification(
        "UTID-MH-2026-094182",
        activeTab,
        eventType,
        department,
        customMsg
      );
      setNotifications((prev) => [record, ...prev]);

      // Play soft chime audio
      if (typeof window !== "undefined" && "AudioContext" in window) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } catch (err) {
          // Audio blocked by browser policy
        }
      }
    } catch (e) {
      console.warn("Push error:", e);
    } finally {
      setIsSending(false);
    }
  };

  if (!isMobilePhoneOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm h-[680px] bg-slate-900 border-4 border-slate-700 rounded-[44px] shadow-2xl overflow-hidden flex flex-col will-change-transform">
        {/* Phone Speaker & Camera Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
        </div>

        {/* Close Button Top-Right of Phone Screen */}
        <button
          type="button"
          onClick={() => setIsMobilePhoneOpen(false)}
          className="absolute top-3.5 right-4 z-40 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          title="Close Simulator"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Status Bar */}
        <div className="pt-3 px-6 pb-1 bg-emerald-800 text-white flex items-center justify-between text-[10px] font-mono shrink-0 select-none">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Channel Switcher (WhatsApp vs SMS) */}
        <div className="grid grid-cols-2 text-center text-xs font-bold shrink-0 bg-slate-800 text-slate-300">
          <button
            type="button"
            onClick={() => setActiveTab("WHATSAPP")}
            className={`py-2 transition-colors cursor-pointer ${
              activeTab === "WHATSAPP"
                ? "bg-emerald-700 text-white border-b-2 border-white"
                : "hover:bg-slate-700"
            }`}
          >
            💬 WhatsApp (Govt Verified)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("SMS")}
            className={`py-2 transition-colors cursor-pointer ${
              activeTab === "SMS"
                ? "bg-blue-700 text-white border-b-2 border-white"
                : "hover:bg-slate-700"
            }`}
          >
            📱 SMS (VM-MAHGOV)
          </button>
        </div>

        {/* App Header */}
        <div className="p-3 bg-emerald-800 text-white flex items-center gap-2.5 shrink-0 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-white text-emerald-800 flex items-center justify-center font-black text-xs shadow-xs">
            🇮🇳
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs font-bold">
              <span>JanSetu™ Maharashtra</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <span className="text-[10px] text-emerald-200 block">Official Government Notifications</span>
          </div>
        </div>

        {/* Chat / SMS Messages Scroll Area */}
        <div
          className={`flex-1 p-3.5 overflow-y-auto space-y-3 text-xs ${
            activeTab === "WHATSAPP"
              ? "bg-[#0b141a] text-white"
              : "bg-slate-950 text-slate-200"
          }`}
        >
          {notifications.map((notif) => {
            const isWA = notif.channel === "WHATSAPP";
            return (
              <div
                key={notif.notification_id}
                className={`p-3 rounded-2xl max-w-[90%] shadow-sm animate-in slide-in-from-bottom-2 duration-200 ${
                  isWA
                    ? "bg-[#005c4b] text-emerald-50 rounded-tl-xs ml-auto"
                    : "bg-slate-800 text-white rounded-tl-xs mr-auto border border-slate-700"
                }`}
              >
                <div className="text-[10px] font-bold text-amber-300 flex items-center justify-between pb-1 border-b border-white/10 mb-1">
                  <span>{notif.department}</span>
                  <span className="font-mono">{notif.utid}</span>
                </div>

                <p className="text-[11px] leading-relaxed select-text">{notif.message}</p>

                <div className="flex items-center justify-end gap-1 pt-1 text-[9px] text-emerald-200/80">
                  <span>
                    {new Date(notif.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isWA && <CheckCheck className="w-3.5 h-3.5 text-blue-400" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Simulator Triggers Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Simulate Live Government Event:
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() =>
                handleSendTestPush(
                  "MILESTONE_APPROVED",
                  "Food Safety Authority (FSSAI)",
                  "Govt of Maharashtra: Your FSSAI Basic License for UTID-MH-2026-094182 has been APPROVED by designated officer. Subsequent trade milestone unlocked."
                )
              }
              disabled={isSending}
              className="p-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 font-bold transition-all cursor-pointer text-center"
            >
              ✅ Approval Push
            </button>

            <button
              type="button"
              onClick={() =>
                handleSendTestPush(
                  "DEFECT_FLAGGED",
                  "Municipal Corporation (BMC)",
                  "Govt of Maharashtra: Scrutiny notice on UTID-MH-2026-094182. Water test report missing. Upload within statutory 48h window."
                )
              }
              disabled={isSending}
              className="p-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 font-bold transition-all cursor-pointer text-center"
            >
              ⚠️ Defect Alert
            </button>

            <button
              type="button"
              onClick={() =>
                handleSendTestPush(
                  "SLA_WARNING",
                  "Maharashtra RTSA Appellate",
                  "RTSA 2015 Statutory Notice: Application UTID-MH-2026-094182 SLA window 80% elapsed. Accelerated priority assigned."
                )
              }
              disabled={isSending}
              className="p-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold transition-all cursor-pointer text-center"
            >
              ⏱️ RTSA Warning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

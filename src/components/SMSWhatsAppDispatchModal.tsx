"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  X,
  Smartphone,
  Send,
  CheckCircle2,
  Bell,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Building2,
  Layers,
  FileText,
  AlertTriangle,
  Zap,
  Globe,
  Radio,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useJourney } from "@/context/JourneyContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface SMSWhatsAppDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  journeyTitle?: string;
  stepTitle?: string;
}

export const SMSWhatsAppDispatchModal: React.FC<SMSWhatsAppDispatchModalProps> = ({
  isOpen,
  onClose,
  journeyTitle: initialJourneyTitle,
  stepTitle: initialStepTitle,
}) => {
  // Universal background scroll lock
  useBodyScrollLock(isOpen);

  const { showToast } = useToast();
  const { allJourneys, activeJourney } = useJourney();

  // Channel & Recipient State
  const [channel, setChannel] = useState<"WHATSAPP" | "SMS" | "RCS">("WHATSAPP");
  const [mobileNumber, setMobileNumber] = useState<string>("+91 98765 43210");
  const [notificationType, setNotificationType] = useState<
    "MILESTONE_REMINDER" | "SLA_EXPIRY" | "GAZETTE_UPDATE"
  >("MILESTONE_REMINDER");
  const [lang, setLang] = useState<"en" | "hi" | "kn">("en");

  // Selected Journey & Milestone
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(
    activeJourney?.journeyId || "food-business-license"
  );
  const [customStepTitle, setCustomStepTitle] = useState<string>("");

  // Loading & Result state
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchStatus, setDispatchStatus] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const targetJourney =
    allJourneys.find((j) => j.journeyId === selectedJourneyId) ||
    activeJourney || {
      title: initialJourneyTitle || "Karnataka Cloud Kitchen & MSME Setup",
      steps: [{ title: initialStepTitle || "Obtain Commercial Lease & FSSAI License" }],
    };

  const activeStepName =
    customStepTitle.trim() ||
    targetJourney.steps?.[0]?.title ||
    initialStepTitle ||
    "Obtain Commercial Lease Agreement & Landlord NOC";

  // Generate Message Text Preview based on parameters
  const generateMessageContent = () => {
    const journeyName = targetJourney.title;
    const milestoneName = activeStepName;

    if (channel === "WHATSAPP") {
      if (lang === "hi") {
        if (notificationType === "SLA_EXPIRY") {
          return {
            header: "🏛️ JanSetu™ वैधानिक SLA चेतावनी",
            body: `नमस्ते! आपके *${journeyName}* आवेदन के चरण *${milestoneName}* की समय सीमा में केवल 48 घंटे शेष हैं। विलंब शुल्क से बचने के लिए तुरंत सबमिट करें।`,
            milestone: `⚠️ समय सीमा: 48 घंटे शेष`,
            footer: "दस्तावेज़ सत्यापित करें: https://jansetu.gov.in/roadmap\n\n_राष्ट्रीय ई-गवर्नेंस प्रभाग (NeGD) द्वारा जनहित में जारी।_",
          };
        } else if (notificationType === "GAZETTE_UPDATE") {
          return {
            header: "📜 JanSetu™ आधिकारिक राजपत्र अपडेट",
            body: `नागरिक अलर्ट: *${journeyName}* के अंतर्गत नए नगर निगम उपनियम (2026) लागू किए गए हैं। आपके चरण *${milestoneName}* के शुल्क में संशोधन हुआ है।`,
            milestone: `📢 नया परिपत्र: राजपत्र अधिसूचना सं. 2026/KA-412`,
            footer: "संशोधित नियम पढ़ें: https://jansetu.gov.in/alerts\n\n_डिजिटल इंडिया / NIC सेवा संदेश।_",
          };
        }
        return {
          header: "🏛️ JanSetu™ सरकारी सूचना",
          body: `नमस्ते! आपके *${journeyName}* आवेदन का अगला चरण सक्रिय है:\n👉 *${milestoneName}*`,
          milestone: `⏰ अनुमानित समय सीमा: 3–5 कार्य दिवस`,
          footer: "दस्तावेज़ सत्यापित करें: https://jansetu.gov.in/roadmap\n\n_यह एक स्वचालित आधिकारिक सरकारी अलर्ट है।_",
        };
      } else if (lang === "kn") {
        return {
          header: "🏛️ JanSetu™ ಶಾಸನಬದ್ಧ ಎಚ್ಚರಿಕೆ",
          body: `ನಮಸ್ಕಾರ! ನಿಮ್ಮ *${journeyName}* ಅರ್ಜಿಯ ಮುಂದಿನ ಹಂತ ಸಕ್ರಿಯವಾಗಿದೆ:\n👉 *${milestoneName}*`,
          milestone: `⏰ ಅಂದಾಜು ಅವಧಿ: 3-5 ಕೆಲಸದ ದಿನಗಳು`,
          footer: "ಪರಿಶೀಲಿಸಿ: https://jansetu.gov.in/roadmap\n\n_ರಾಷ್ಟ್ರೀಯ ಇ-ಆಡಳಿತ ವಿಭಾಗ (NeGD) ಅಧಿಕೃತ ಸಂದೇಶ._",
        };
      } else {
        // English
        if (notificationType === "SLA_EXPIRY") {
          return {
            header: "🏛️ JanSetu™ Statutory SLA Expiry Alert",
            body: `Namaste! The statutory submission window for milestone *${milestoneName}* under *${journeyName}* will expire in 48 hours. Submit documents to avoid late penalties.`,
            milestone: `⚠️ Critical SLA: 48 Hours Remaining`,
            footer: "Track progress: https://jansetu.gov.in/roadmap\n\n_Issued in public interest by National e-Governance Division (NeGD)._",
          };
        } else if (notificationType === "GAZETTE_UPDATE") {
          return {
            header: "📜 JanSetu™ Regulatory Policy Circular",
            body: `Citizen Notice: Gazette Circular No. 2026/KA-412 has been gazetted for *${journeyName}*. Statutory compliance fee waived for MSME applicants under *${milestoneName}*.`,
            milestone: `📢 Regulatory Policy: Gazette Notification 2026/KA-412`,
            footer: "Review circular: https://jansetu.gov.in/alerts\n\n_Digital Governance & Public Service Delivery._",
          };
        }
        return {
          header: "🏛️ JanSetu™ Statutory Milestone Alert",
          body: `Namaste! The next milestone in your roadmap *${journeyName}* is ready for submission:\n👉 *${milestoneName}*`,
          milestone: `⏰ Statutory Turnaround SLA: 3–5 Business Days`,
          footer: "Review verified steps: https://jansetu.gov.in/roadmap\n\n_Issued in public interest by National e-Governance Division (NeGD)._",
        };
      }
    } else {
      // SMS format (160 char DLT Telecom Template)
      if (lang === "hi") {
        return {
          header: "GOV-CDAC-ALERT",
          body: `सरकारी अलर्ट: '${journeyName}' में चरण '${milestoneName}' सत्यापन के लिए लंबित है। विवरण: jansetu.gov.in - NIC GOI`,
          milestone: "",
          footer: "DLT Reg ID: 1407168923019827",
        };
      }
      return {
        header: "GOV-CDAC-ALERT",
        body: `GovTech Alert: Milestone '${milestoneName}' in '${journeyName}' is due for statutory verification. Track: jansetu.gov.in - NeGD`,
        milestone: "",
        footer: "DLT Reg ID: 1407168923019827",
      };
    }
  };

  const messageData = generateMessageContent();

  const fullRawMessage = `${messageData.header}\n\n${messageData.body}\n\n${
    messageData.milestone ? `${messageData.milestone}\n\n` : ""
  }${messageData.footer}`;

  // Dispatch Simulation (Call Backend FastAPI with fallback)
  const handleSimulateDispatch = async () => {
    setIsDispatching(true);
    setDispatchStatus(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/notifications/simulate-dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: channel,
          recipient_mobile: mobileNumber,
          journey_title: targetJourney.title,
          step_title: activeStepName,
          notification_type: notificationType,
          language: lang,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDispatchStatus(data);
        showToast(`✓ Dispatched ${channel} alert via ${data.gateway_reference}!`, "success");
      } else {
        throw new Error("Backend fallback");
      }
    } catch {
      // Offline fallback
      setTimeout(() => {
        setDispatchStatus({
          dispatch_id: `CDAC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          gateway_reference:
            channel === "WHATSAPP"
              ? "Meta WhatsApp Business API (NIC Gov Verified Green Tick)"
              : "C-DAC e-Pramaan National SMS Gateway (DLT Certified)",
          delivery_sla: "Delivered (<1.2s Carrier Acknowledged)",
          recipient_mobile_masked: mobileNumber.replace(/\d(?=\d{4})/g, "*"),
          template_id: channel === "WHATSAPP" ? "gov_citizen_milestone_v2" : "NIC_SMS_SLA_102",
          dispatched_at_iso: new Date().toISOString(),
        });
        showToast(`✓ Simulated ${channel} notification dispatched to ${mobileNumber}!`, "success");
      }, 700);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(fullRawMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Click-to-chat WhatsApp direct URL
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(
    mobileNumber.replace(/\D/g, "")
  )}&text=${encodeURIComponent(fullRawMessage)}`;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sms-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="min-h-screen px-3 sm:px-6 py-6 flex items-center justify-center">
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200 max-h-[92vh]">
          
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="sms-modal-title"
                  className="text-base font-black text-white flex items-center gap-2 flex-wrap"
                >
                  <span>SMS & WhatsApp Alert Dispatch Sandbox</span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/30">
                    C-DAC & Meta Business API
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Simulate verified government milestone alerts, statutory SLA expirations & circulars.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
            
            {/* Top Channel Switcher (WhatsApp vs C-DAC SMS vs RCS) */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setChannel("WHATSAPP")}
                className={`p-3 rounded-2xl border font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                  channel === "WHATSAPP"
                    ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30 shadow-xs"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-center sm:text-left">WhatsApp Business</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel("SMS")}
                className={`p-3 rounded-2xl border font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                  channel === "SMS"
                    ? "bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/30 shadow-xs"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-center sm:text-left">C-DAC SMS Gateway</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel("RCS")}
                className={`p-3 rounded-2xl border font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                  channel === "RCS"
                    ? "bg-purple-50 dark:bg-purple-950/50 border-purple-500 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/30 shadow-xs"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Radio className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="text-center sm:text-left">RCS Verified Push</span>
              </button>
            </div>

            {/* Notification Configuration Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              
              {/* Recipient Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Citizen Mobile Number (India)
                </label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              {/* Notification Scenario */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Alert Scenario / Template
                </label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="MILESTONE_REMINDER">📌 Milestone Submission Ready</option>
                  <option value="SLA_EXPIRY">⚠️ Statutory SLA Expiration (48h Warning)</option>
                  <option value="GAZETTE_UPDATE">📜 Gazette Circular & Rule Change</option>
                </select>
              </div>

              {/* Active Roadmap Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Statutory Roadmap Context
                </label>
                <select
                  value={selectedJourneyId}
                  onChange={(e) => {
                    setSelectedJourneyId(e.target.value);
                    setCustomStepTitle("");
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                >
                  {allJourneys.map((j) => (
                    <option key={j.journeyId} value={j.journeyId}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Template Language
                </label>
                <div className="flex items-center gap-1.5 pt-0.5">
                  {[
                    { id: "en", label: "English" },
                    { id: "hi", label: "हिन्दी (Hindi)" },
                    { id: "kn", label: "ಕನ್ನಡ (Kannada)" },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLang(l.id as any)}
                      className={`flex-1 py-2 px-2 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                        lang === l.id
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Live Smartphone Visual Screen Mockup */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <span className="uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Real-Time Citizen Device Preview</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy Payload"}</span>
                </button>
              </div>

              {/* Phone Frame Mockup */}
              <div className="rounded-3xl bg-slate-950 p-4 border border-slate-800 shadow-2xl text-white space-y-3 font-sans">
                
                {/* Phone Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      🏛️
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-slate-100">
                          {channel === "WHATSAPP" ? "JanSetu™ GovTech" : "VM-GOVGOI"}
                        </span>
                        {channel === "WHATSAPP" && (
                          <span className="p-0.5 rounded-full bg-emerald-500 text-white" title="NIC Verified Official Business Account">
                            <Check className="w-2.5 h-2.5 stroke-[4]" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 block leading-none">
                        {channel === "WHATSAPP"
                          ? "Official National e-Governance Gateway"
                          : "National SMS DLT Header"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-slate-400">
                    <span className="block font-mono">Today</span>
                    <span className="text-emerald-400 font-bold">● Active Sandbox</span>
                  </div>
                </div>

                {/* Message Bubble: WhatsApp vs SMS vs RCS */}
                {channel === "WHATSAPP" ? (
                  /* WhatsApp Bubble */
                  <div className="max-w-md ml-auto bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-xs p-3.5 shadow-md space-y-2 text-xs leading-relaxed border border-emerald-600/30">
                    <div className="font-bold text-emerald-200 flex items-center gap-1 text-[13px]">
                      <span>{messageData.header}</span>
                    </div>

                    <div className="whitespace-pre-line text-slate-100">
                      {messageData.body}
                    </div>

                    {messageData.milestone && (
                      <div className="p-2.5 rounded-xl bg-black/25 border border-emerald-400/20 text-emerald-300 font-mono text-[11px]">
                        {messageData.milestone}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-300 border-t border-emerald-700/40 pt-1.5 whitespace-pre-line">
                      {messageData.footer}
                    </div>

                    <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200/80 pt-0.5">
                      <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      <span className="text-sky-300 font-bold">✓✓</span>
                    </div>
                  </div>
                ) : channel === "RCS" ? (
                  /* Google RCS Verified Rich Card */
                  <div className="max-w-md bg-slate-900 rounded-3xl p-4 shadow-xl space-y-3 text-xs leading-relaxed border border-purple-500/40">
                    {/* RCS Header Card */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-xl bg-purple-600 text-white shadow-xs">
                          <Radio className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-100 text-xs">National Compliance Gateway</span>
                            <span className="p-0.5 rounded-full bg-blue-500 text-white" title="Verified Business Profile">
                              <ShieldCheck className="w-2.5 h-2.5" />
                            </span>
                          </div>
                          <span className="text-[10px] text-purple-400 font-mono">rcs.negd.gov.in (Verified)</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {/* RCS Rich Media Banner */}
                    <div className="p-3 bg-gradient-to-r from-purple-950 to-indigo-950 rounded-2xl border border-purple-800/60 space-y-1">
                      <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
                        🏛️ Official Statutory Notice
                      </span>
                      <h4 className="font-black text-white text-xs">
                        {targetJourney.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 whitespace-pre-line leading-relaxed">
                        {messageData.body}
                      </p>
                    </div>

                    {/* Interactive Action Chips (RCS Quick Replies) */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Suggested Actions:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            showToast("📄 Official Statutory Notice Opened", "info");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-500/50 hover:bg-purple-900 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <FileText className="w-3 h-3 text-purple-400" />
                          <span>View Notice</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            showToast("🔗 Redirecting to Citizen Portal Verification...", "success");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-950 border border-indigo-500/50 hover:bg-indigo-900 text-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3 text-indigo-400" />
                          <span>Verify Online</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            showToast("📞 Dialing Official Nodal Helpline: 1800-11-4000", "info");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <PhoneCall className="w-3 h-3 text-slate-400" />
                          <span>Call Helpline</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard SMS Bubble */
                  <div className="max-w-md bg-slate-900 text-slate-200 rounded-2xl rounded-tl-xs p-3.5 shadow-md space-y-2 text-xs leading-relaxed border border-slate-800">
                    <div className="text-[10px] font-mono text-blue-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Sender: {messageData.header}</span>
                    </div>

                    <div className="whitespace-pre-line text-slate-100">
                      {messageData.body}
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono border-t border-slate-800 pt-1">
                      {messageData.footer}
                    </div>

                    <div className="text-right text-[9px] text-slate-500 font-mono">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Dispatch Status Card */}
            {dispatchStatus && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 animate-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Carrier Dispatch Acknowledged: {dispatchStatus.dispatch_id}</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-mono font-bold">
                    {dispatchStatus.delivery_sla || "Instant (<1.2s)"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="font-bold block">Gateway:</span>
                    <span className="text-slate-800 dark:text-slate-200">{dispatchStatus.gateway_reference}</span>
                  </div>
                  <div>
                    <span className="font-bold block">Recipient:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{dispatchStatus.recipient_mobile_masked}</span>
                  </div>
                  <div>
                    <span className="font-bold block">DLT Template ID:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{dispatchStatus.template_id}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-300 font-bold text-xs transition-colors cursor-pointer border border-emerald-300 dark:border-emerald-800"
                title="Test sending this message directly to WhatsApp app"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send to Real WhatsApp</span>
                <span className="sm:hidden">Send App</span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 font-bold text-xs cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleSimulateDispatch}
                disabled={isDispatching}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isDispatching
                    ? "Dispatching..."
                    : `Simulate ${channel} Dispatch`}
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

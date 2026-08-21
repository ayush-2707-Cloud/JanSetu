"use client";

import React, { useState } from "react";
import { Bot, Send, User, Sparkles, RefreshCw, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { JourneyStep } from "@/types/journey";
import { translations } from "@/data/translations";
import { aiService, CitationItem } from "@/services/api";

interface StepAIChatProps {
  step: JourneyStep;
}

interface Message {
  sender: "user" | "ai";
  text: string;
  citations?: CitationItem[];
  isFallback?: boolean;
  portalUrl?: string;
  department?: string;
}

export const StepAIChat: React.FC<StepAIChatProps> = ({ step }) => {
  const { language, activeJourney } = useJourney();
  const t = translations[language];

  const initialAiGreeting =
    language === "HI"
      ? `नमस्ते! मैं चरण ${step.stepNumber} (${step.titleHi || step.title}) के लिए आपका आधिकारिक एआई सहायक हूं। मुझसे इस चरण की फीस, आवश्यक दस्तावेजों या नियमों के बारे में पूछें!`
      : language === "KN"
      ? `ನಮಸ್ಕಾರ! ನಾನು ಹಂತ ${step.stepNumber} (${step.titleKn || step.title}) ಗಾಗಿ ನಿಮ್ಮ ಅಧಿಕೃತ AI ಸಹಾಯಕ. ಈ ಹಂತದ ಶುಲ್ಕಗಳು ಅಥವಾ ದಾಖಲೆಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ!`
      : `Hello! I am your GovTech Grounded AI Assistant for Step ${step.stepNumber} (${step.title}). Ask me anything about statutory fees, required documents, or official circulars.`;

  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: initialAiGreeting },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const ragResponse = await aiService.queryRAG(
        userText,
        step.id,
        activeJourney?.journeyId,
        language.toLowerCase()
      );

      if (ragResponse) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: ragResponse.answer,
            citations: ragResponse.citations,
            isFallback: ragResponse.is_fallback,
            portalUrl: ragResponse.verified_portal_url,
            department: ragResponse.department_source,
          },
        ]);
      } else {
        // Local deterministic fallback
        let reply = "";
        const lower = userText.toLowerCase();
        if (lower.includes("fee") || lower.includes("cost") || lower.includes("शुल्क") || lower.includes("ಶುಲ್ಕ")) {
          reply = step.instructions.fee
            ? `The statutory fee for Step ${step.stepNumber} is ${step.instructions.fee}.`
            : `There is no statutory fee for this step (₹0.00).`;
        } else if (lower.includes("time") || lower.includes("days") || lower.includes("समय") || lower.includes("ಸಮಯ")) {
          reply = `The estimated duration for completing Step ${step.stepNumber} is ${step.estimatedDays || "1-3 Business Days"}.`;
        } else if (lower.includes("document") || lower.includes("paper") || lower.includes("दस्तावेज") || lower.includes("ದಾಖಲೆ")) {
          reply = step.instructions.documentsRequired
            ? `Required documents for Step ${step.stepNumber}: ${step.instructions.documentsRequired.join(", ")}.`
            : `No additional documents are required beyond identity verification.`;
        } else {
          reply = `For Step ${step.stepNumber} (${step.title}), ensure all mandatory requirements are submitted through the official portal. Review officer: ${step.instructions.officerContact?.name || "Nodal Department Desk"}.`;
        }

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: reply,
            portalUrl: step.instructions.actionUrl,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `For Step ${step.stepNumber} (${step.title}), please refer to the official government portal at ${step.instructions.actionUrl || "https://india.gov.in"} for verified guidelines.`,
          portalUrl: step.instructions.actionUrl,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-3 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5">
              <span>{t.embeddedAiChatTitle}</span>
              <Sparkles className="w-3 h-3 text-blue-400" />
            </h4>
            <p className="text-[10px] text-slate-400">Grounded RAG (ChromaDB + Gemini Pro)</p>
          </div>
        </div>
        <span className="text-[9px] uppercase font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Verified Citations
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="max-h-56 overflow-y-auto overscroll-contain touch-pan-y space-y-3 pr-1 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              m.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                m.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-blue-400 border border-slate-700"
              }`}
            >
              {m.sender === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
            </div>

            <div
              className={`p-3 rounded-xl max-w-[86%] leading-relaxed ${
                m.sender === "user"
                  ? "bg-blue-600 text-white font-medium"
                  : m.isFallback
                  ? "bg-amber-950/70 text-amber-200 border border-amber-800/80"
                  : "bg-slate-800/90 text-slate-200 border border-slate-700/80"
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* Citations block */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-700/60 space-y-1.5 text-[10px]">
                  <div className="text-slate-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Statutory Citations:</span>
                  </div>
                  {m.citations.map((c, cIdx) => (
                    <div key={cIdx} className="bg-slate-900/80 p-1.5 rounded border border-slate-800 space-y-0.5">
                      <div className="font-semibold text-slate-300">
                        {c.department} — {c.section}
                      </div>
                      <a
                        href={c.portal_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-mono text-[9px]"
                      >
                        <span>{c.portal_url}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Verified portal quick link */}
              {m.portalUrl && !m.citations?.length && (
                <div className="mt-2 pt-1.5 border-t border-slate-700/60 text-[10px]">
                  <a
                    href={m.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-semibold"
                  >
                    <span>Official Portal: {m.portalUrl}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium bg-slate-800/50 p-2 rounded-lg border border-slate-800">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
            <span>Retrieving official statutory passages from ChromaDB...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t.aiInputPlaceholder}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};


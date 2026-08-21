"use client";

import React, { useState, useRef } from "react";
import { useJourney } from "@/context/JourneyContext";
import { Mic, MicOff, Search, Sparkles } from "lucide-react";
import { copilotService } from "@/services/api";

interface CopilotBarProps {
  setActiveJourney?: (journeyId: string) => void;
  setOpenDrawer?: (stepId: string) => void;
}

export default function CopilotBar({
  setActiveJourney,
  setOpenDrawer,
}: CopilotBarProps = {}) {
  const {
    selectJourneyById,
    openStepDrawer,
    setActiveScreen,
    language,
    triggerConsentFlow,
  } = useJourney();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  // 1. Browser Native Speech-to-Text via Web Speech API
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Web Speech API is not supported in this browser. Please type your query.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "HI" ? "hi-IN" : "en-IN";
    recognition.continuous = false;

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);

      // Auto-send when the user stops speaking
      handleSendToCopilot(text, true);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // 2. Action Dispatcher: Where Gemini drives the UI
  const handleSendToCopilot = async (message: string, isVoiceOrigin: boolean = false) => {
    if (!message || !message.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const data = await copilotService.queryGeminiAgent(message, language.toLowerCase());

      if (data && data.ui_actions) {
        // 3. Execute the UI Tools returned by Gemini
        data.ui_actions.forEach((tool) => {
          if (tool.action === "load_journey" || tool.action === "LOAD_JOURNEY") {
            const jId = tool.payload?.journey_id || "food-business-license";
            if (setActiveJourney) {
              setActiveJourney(jId);
            } else {
              selectJourneyById(jId);
              setActiveScreen("ROADMAP");
            }
          } else if (tool.action === "open_step_drawer" || tool.action === "OPEN_STEP") {
            const sId = tool.payload?.step_id || "fssai-license";
            if (setOpenDrawer) {
              setOpenDrawer(sId);
            } else {
              openStepDrawer(sId);
            }
          } else if (tool.action === "trigger_consent_modal") {
            const doc = tool.payload?.doc_type || "PAN";
            triggerConsentFlow(doc, tool.payload?.purpose || "Statutory Verification", () => {});
          }
        });

        // 4. Text-to-Speech: Read response out loud ONLY if user initiated via voice mic
        if (isVoiceOrigin && data.text_response && typeof window !== "undefined" && "speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(data.text_response);
          utterance.lang = language === "HI" ? "hi-IN" : "en-IN";
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (err) {
      console.error("Copilot error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-2xl mx-auto items-center gap-3 p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 transition-all">
      <div className="text-blue-600 dark:text-blue-400 pl-1">
        <Sparkles className="w-5 h-5 animate-pulse" />
      </div>

      <input
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSendToCopilot(transcript);
        }}
        placeholder={
          isListening
            ? "🎙️ Listening... (Speak now)"
            : language === "HI"
            ? "बोलें या लिखें: 'कर्नाटक में खाद्य व्यवसाय शुरू करना है'..."
            : "Say 'Help me start a food business in Bangalore'..."
        }
        className="flex-1 p-2 outline-none text-slate-800 dark:text-white bg-transparent text-sm placeholder:text-slate-400"
      />

      {/* Microphone Button with Pulsing Wave Animation */}
      <button
        type="button"
        onClick={toggleListening}
        className={`p-3 rounded-full transition-all flex items-center justify-center cursor-pointer ${
          isListening
            ? "bg-red-600 animate-pulse text-white ring-4 ring-red-300 shadow-lg shadow-red-500/50"
            : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
        }`}
        title={isListening ? "Listening... Click to stop" : "Click to speak"}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>

      {/* Manual Send Button */}
      <button
        type="button"
        onClick={() => handleSendToCopilot(transcript)}
        disabled={isLoading || !transcript.trim()}
        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Ask AI</span>
      </button>
    </div>
  );
}

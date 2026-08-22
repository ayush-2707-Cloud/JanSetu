"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
  ShieldCheck,
  Zap,
  ExternalLink,
  Bot,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { translations } from "@/data/translations";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { copilotService, CopilotResponse, CopilotAction } from "@/services/api";
import { ChoiceChips } from "@/components/ChoiceChips";

const QUICK_PROMPTS = [
  {
    label: "Register for FSSAI Food License in Karnataka",
    query: "Help me register for FSSAI food license in Karnataka",
    tag: "MSME Food",
  },
  {
    label: "Higher Education Loan (PM-Vidyalaxmi Interest Subsidy)",
    query: "Help me apply for PM-Vidyalaxmi Higher Education Loan with interest subsidy",
    tag: "Student Loan",
  },
  {
    label: "Verify Identity with DigiLocker Sandbox",
    query: "Verify my PAN card with DigiLocker sandbox",
    tag: "DigiLocker",
  },
  {
    label: "Switch to Hindi & View Education Loan",
    query: "मुझे हिंदी में पीएम विद्यालक्ष्मी शिक्षा ऋण के नियम बताएं",
    tag: "हिन्दी / Voice",
  },
];

export const AICopilotBar: React.FC = () => {
  const {
    language,
    activeJourney,
    selectedStepId,
    activeScreen,
    executeCopilotAction,
    choiceChipsData,
    choiceChipsPrompt,
    setChoiceChipsData,
  } = useJourney();

  const t = useMemo(() => translations[language] || translations.EN, [language]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copilotData, setCopilotData] = useState<CopilotResponse | null>(null);
  const [actionLog, setActionLog] = useState<CopilotAction[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Browser TTS & Web Speech API Hooks
  const { speak, stop: stopSpeech, isMuted, toggleMute, isSpeaking } = useTextToSpeech();

  // Main Copilot query execution
  const executeQuery = useCallback(
    async (queryText: string, isVoiceOrigin: boolean = false) => {
      const q = queryText.trim();
      if (!q || isLoading) return;

      stopSpeech();
      setIsLoading(true);
      setStatusMessage("Analyzing statutory intent & synthesizing UI actions...");
      setActionLog([]);
      // Clear any previous choice chips
      setChoiceChipsData(null);

      try {
        const res = await copilotService.sendActionQuery({
          query: q,
          language: language.toLowerCase(),
          active_journey_id: activeJourney?.journeyId,
          active_step_id: selectedStepId || undefined,
          active_screen: activeScreen,
        });

        if (res) {
          setCopilotData(res);
          setActionLog(res.actions || []);

          // Voice-In -> Voice-Out Policy: ONLY speak aloud if the query originated from microphone voice input
          if (isVoiceOrigin && res.speech_text && !isMuted) {
            speak(res.speech_text, language as "EN" | "HI" | "KN");
          }

          // Execute emitted UI actions sequentially
          if (res.actions && res.actions.length > 0) {
            setStatusMessage(`Executing ${res.actions.length} client-side UI action(s)...`);
            for (const action of res.actions) {
              await executeCopilotAction(action);
              // Small delay between action dispatch for smooth visual animation
              await new Promise((resolve) => setTimeout(resolve, 200));
            }
          }
          setStatusMessage(null);
        } else {
          setStatusMessage("AI service offline or unreachable. Please try again.");
          setTimeout(() => setStatusMessage(null), 3000);
        }
      } catch (err) {
        console.error("Copilot execution error:", err);
        setStatusMessage("Failed to connect to AI Copilot engine.");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, stopSpeech, language, activeJourney, selectedStepId, activeScreen, isMuted, speak, executeCopilotAction]
  );

  const handleSpeechResult = useCallback(
    async (spokenText: string) => {
      if (!spokenText || spokenText.trim().length < 2) return;
      setInputQuery(spokenText);
      await executeQuery(spokenText, true);
    },
    [executeQuery]
  );

  const {
    isListening,
    transcript,
    isSupported: isSpeechSupported,
    audioLevel,
    startListening,
    stopListening,
    toggleListening,
  } = useSpeechRecognition({
    language: language as "EN" | "HI" | "KN",
    onTranscriptChange: (text) => setInputQuery(text),
    onFinalTranscript: handleSpeechResult,
    silenceTimeoutMs: 1400,
  });

  // Sync interim speech transcript into input box
  useEffect(() => {
    if (isListening && transcript) {
      setInputQuery(transcript);
    }
  }, [isListening, transcript]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeQuery(inputQuery);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Copilot Active Command Center Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-blue-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-white relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-44 h-44 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Header Row: Title, Audio Indicator & Voice Mute Toggle */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600/40 text-blue-300 border border-blue-400/40 shadow-inner">
                <Sparkles className="w-5 h-5 text-blue-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                    {t.civicCopilotTitle || "Civic Copilot™ Autonomous AI Agent"}
                  </h2>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/80">
                    {t.genUiLiveBadge || "Generative UI Live"}
                  </span>
                </div>
                <p className="text-xs text-blue-200/80">
                  {t.civicCopilotSub || "Speak or type naturally — AI autonomously controls the screen, opens drawers & verifies documents"}
                </p>
              </div>
            </div>

            {/* Voice Mute / Unmute Button */}
            <div className="flex items-center gap-2">
              {isSpeaking && (
                <div className="flex items-center gap-1 text-[11px] text-blue-300 bg-blue-950/80 border border-blue-700/60 px-2 py-0.5 rounded-full animate-pulse">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Speaking...</span>
                </div>
              )}
              <button
                type="button"
                onClick={toggleMute}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isMuted
                    ? "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                    : "bg-blue-600/30 text-blue-300 border-blue-500/50 hover:bg-blue-600/50 shadow-xs"
                }`}
                title={isMuted ? "Unmute Copilot Voice Feedback" : "Mute Copilot Voice Feedback"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isMuted ? (t.voiceOff || "Voice Off") : (t.voiceOn || "Voice On")}</span>
              </button>
            </div>
          </div>

          {/* Voice Input Search Bar with Animated Active Microphone */}
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-blue-400">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={
                isListening
                  ? "🎙️ Listening... (Speak in English, Hindi, or Kannada)"
                  : language === "HI"
                  ? "अपनी बात कहें या लिखें (उदा: 'कर्नाटक में FSSAI लाइसेंस कैसे लें?')..."
                  : language === "KN"
                  ? "ನಿಮ್ಮ ಗುರಿಯನ್ನು ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ..."
                  : "Speak or type your goal (e.g., 'Help me register for FSSAI food license in Karnataka')..."
              }
              className={`w-full pl-11 pr-28 py-3.5 text-sm bg-slate-950/80 border rounded-2xl text-white placeholder:text-slate-400 focus:outline-none transition-all shadow-inner ${
                isListening
                  ? "border-red-500 ring-2 ring-red-500/40 bg-red-950/20"
                  : "border-blue-500/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40"
              }`}
            />

            {/* Action Buttons Inside Search Bar */}
            <div className="absolute right-2 flex items-center gap-1.5">
              {/* Dynamic Web Speech API Microphone Button */}
              <button
                type="button"
                onClick={
                  !isSpeechSupported
                    ? () => {
                        setStatusMessage("Speech recognition requires Chrome or Edge. You can click any Quick Voice Prompt below!");
                        setTimeout(() => setStatusMessage(null), 4000);
                      }
                    : isListening
                    ? stopListening
                    : startListening
                }
                className={`p-2 rounded-xl transition-all relative flex items-center justify-center cursor-pointer ${
                  isListening
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105"
                    : "bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700"
                }`}
                title={
                  !isSpeechSupported
                    ? "Speech recognition not supported in this browser"
                    : isListening
                    ? "Stop Voice Recording"
                    : "Click to Speak (Web Speech API)"
                }
              >
                {isListening ? (
                  <>
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                    </span>
                    <MicOff className="w-4 h-4" />
                  </>
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              {/* Submit Query Button */}
              <button
                type="button"
                onClick={() => executeQuery(inputQuery)}
                disabled={isLoading || !inputQuery.trim()}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Go</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Audio Waveform Indicator (When Listening) */}
          {isListening && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="text-xs text-red-200 font-semibold">
                  Listening in {language === "HI" ? "हिन्दी" : language === "KN" ? "ಕನ್ನಡ" : "English"}...
                </span>
              </div>

              {/* Simulated Visualizer Bars */}
              <div className="flex items-center gap-1">
                {[18, 35, 60, 80, 45, 70, 30, 50, 20].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-red-400 rounded-full transition-all duration-75"
                    style={{
                      height: `${Math.max(6, Math.min(24, (h * audioLevel) / 60))}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Status Message / Action Progress Loader */}
          {statusMessage && (
            <div className="flex items-center gap-2 text-xs text-blue-300 bg-blue-950/60 border border-blue-800/60 p-2.5 rounded-xl font-medium animate-pulse">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Quick-Prompt Recommendation Chips */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-blue-400" />
              {t.tryAsking || "Try Asking:"}
            </span>
            {QUICK_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputQuery(p.query);
                  executeQuery(p.query);
                }}
                className="text-xs px-2.5 py-1 bg-slate-800/80 hover:bg-blue-900/60 border border-slate-700/80 hover:border-blue-500/60 text-slate-200 hover:text-white rounded-lg transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <span className="text-[10px] text-blue-400 font-semibold bg-blue-950 px-1.5 py-0.2 rounded">
                  {p.tag}
                </span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* AI Response Card with Executed Client-Side Tool Actions */}
          {copilotData && !isLoading && (
            <div className="mt-4 p-4 bg-slate-950/90 border border-blue-500/50 rounded-2xl space-y-3 shadow-xl animate-in fade-in zoom-in-95 duration-200">
              {/* Top Banner: Speech Summary */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full">
                      AI Copilot Response
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      ⚡ {copilotData.latency_ms}ms latency
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white leading-snug">
                    "{copilotData.speech_text}"
                  </p>
                </div>
              </div>

              {/* Executed Generative UI Actions Badges */}
              {actionLog.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    Autonomous UI Actions Executed ({actionLog.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {actionLog.map((action, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-slate-900 border border-emerald-900/60 rounded-xl flex items-center gap-2 text-xs text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-mono font-bold text-[10px] text-emerald-300 block">
                            {action.action_type}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate block">
                            {action.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grounded Citations Panel */}
              {copilotData.citations && copilotData.citations.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    Verified Official Citations (.gov.in):
                  </span>
                  <div className="space-y-1.5">
                    {copilotData.citations.map((c, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{c.department}</span>
                          <a
                            href={c.portal_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-mono text-[10px]"
                          >
                            <span>{c.portal_url}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <span className="text-[11px] text-slate-400 block font-medium">
                          {c.document_title} — {c.section}
                        </span>
                        <p className="text-[11px] text-slate-300/80 leading-relaxed italic">
                          "{c.excerpt}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dynamic Choice Chips for Journey Disambiguation */}
          {choiceChipsData && choiceChipsData.length > 0 && (
            <div className="mt-3">
              <ChoiceChips
                prompt={choiceChipsPrompt || undefined}
                options={choiceChipsData}
              />
            </div>
          )}

          {/* Suggested Follow-up Chips from AI Response */}
          {copilotData && copilotData.suggested_chips && copilotData.suggested_chips.length > 0 && !isLoading && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Follow-up:
              </span>
              {copilotData.suggested_chips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputQuery(chip);
                    executeQuery(chip);
                  }}
                  className="text-[11px] px-2.5 py-1 bg-slate-800/60 hover:bg-indigo-900/50 border border-slate-700/60 hover:border-indigo-500/50 text-slate-300 hover:text-white rounded-lg transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

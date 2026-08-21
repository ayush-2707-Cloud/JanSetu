"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
  CheckCircle2,
  X,
  Globe,
  Loader2,
  Bot,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { useVoiceInput, VoiceLanguage } from "@/hooks/useVoiceInput";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useActionDispatcher } from "@/components/ActionDispatcher";
import { copilotService, CopilotResponse, CopilotAction } from "@/services/api";
import { ChoiceChips } from "@/components/ChoiceChips";

const QUICK_VOICE_PROMPTS = [
  {
    label: "FSSAI Food License (Karnataka)",
    query: "Help me register for FSSAI food license in Karnataka",
    lang: "en-IN" as VoiceLanguage,
  },
  {
    label: "पीएम विद्यालक्ष्मी शिक्षा ऋण",
    query: "मुझे हिंदी में पीएम विद्यालक्ष्मी शिक्षा ऋण के नियम बताएं",
    lang: "hi-IN" as VoiceLanguage,
  },
  {
    label: "Verify Identity with DigiLocker",
    query: "Verify my PAN card with DigiLocker sandbox",
    lang: "en-IN" as VoiceLanguage,
  },
];

export const VoiceCopilotFloatingBar: React.FC = () => {
  const {
    language: appLanguage,
    activeJourney,
    selectedStepId,
    activeScreen,
    choiceChipsData,
    choiceChipsPrompt,
    setChoiceChipsData,
  } = useJourney();

  const { dispatchToolAction } = useActionDispatcher();
  const { speak, stop: stopSpeech, isMuted, toggleMute, isSpeaking } = useTextToSpeech();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeActions, setActiveActions] = useState<{ name: string; description: string }[]>([]);
  const [copilotResponse, setCopilotResponse] = useState<CopilotResponse | null>(null);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Automatically sync voice language to App Language default
  const defaultVoiceLang: VoiceLanguage = appLanguage === "HI" ? "hi-IN" : "en-IN";

  // Process user command through the Copilot Engine & Dispatch Tool Calls
  const processVoiceCommand = useCallback(
    async (query: string, isVoiceOrigin: boolean = false) => {
      const q = query.trim();
      if (!q || isLoading) return;

      stopSpeech();
      setIsLoading(true);
      setStatusNotification("Analyzing statutory intent & synthesizing tool calls...");
      setActiveActions([]);
      setChoiceChipsData(null);

      try {
        const res = await copilotService.sendActionQuery({
          query: q,
          language: defaultVoiceLang.startsWith("hi") ? "hi" : "en",
          active_journey_id: activeJourney?.journeyId,
          active_step_id: selectedStepId || undefined,
          active_screen: activeScreen,
        });

        if (res) {
          setCopilotResponse(res);

          // Vocal Speech Feedback (Only when initiated via microphone voice input)
          if (isVoiceOrigin && res.speech_text && !isMuted) {
            const ttsLang = defaultVoiceLang.startsWith("hi") ? "HI" : "EN";
            speak(res.speech_text, ttsLang as any);
          }

          // Dispatch Tool Calls returned by the backend
          if (res.actions && res.actions.length > 0) {
            const executedList: { name: string; description: string }[] = [];

            for (const action of res.actions) {
              setStatusNotification(`Executing tool action: ${action.action_type}...`);
              await dispatchToolAction(action);
              executedList.push({
                name: action.action_type,
                description: action.description,
              });
              // Small pause for smooth UI animation transition
              await new Promise((r) => setTimeout(r, 220));
            }

            setActiveActions(executedList);
          }
          setStatusNotification(null);
        } else {
          setStatusNotification("AI service offline or unreachable. Please try again.");
          setTimeout(() => setStatusNotification(null), 3000);
        }
      } catch (err) {
        console.error("Copilot voice execution error:", err);
        setStatusNotification("Failed to process command. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, stopSpeech, defaultVoiceLang, activeJourney, selectedStepId, activeScreen, isMuted, speak, dispatchToolAction, setChoiceChipsData]
  );

  const handleFinalVoiceInput = useCallback(
    async (spokenText: string) => {
      if (!spokenText || spokenText.trim().length < 2) return;
      setInputText(spokenText);
      await processVoiceCommand(spokenText, true);
    },
    [processVoiceCommand]
  );

  const {
    isListening,
    transcript,
    isSupported: isSpeechSupported,
    language: voiceLang,
    audioLevel,
    setLanguage: setVoiceLang,
    startListening,
    stopListening,
    toggleListening,
  } = useVoiceInput({
    language: defaultVoiceLang,
    onTranscriptChange: (text) => {
      setInputText(text);
      if (!isOpen) setIsOpen(true);
    },
    onFinalTranscript: handleFinalVoiceInput,
    silenceTimeoutMs: 1400,
  });

  // Full-Duplex Voice Barge-In: Cancel active AI speech immediately when citizen speaks
  useEffect(() => {
    if (isListening && isSpeaking) {
      stopSpeech();
    }
  }, [isListening, isSpeaking, stopSpeech]);

  // Sync interim transcript into the text field
  useEffect(() => {
    if (isListening && transcript) {
      if (isSpeaking) {
        stopSpeech();
      }
      setInputText(transcript);
      if (!isOpen) setIsOpen(true);
    }
  }, [isListening, transcript, isSpeaking, stopSpeech, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processVoiceCommand(inputText);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Expanded Voice Command Center Card */}
      {isOpen && (
        <div className="w-[90vw] max-w-md bg-slate-950/95 text-white border border-blue-500/50 rounded-3xl p-5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200 space-y-4 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Header Row: Title, Language Switcher, Close */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/40">
                <Sparkles className="w-4 h-4 text-blue-300 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span>Voice Copilot Controller</span>
                  <span className="text-[9px] uppercase font-black px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-full">
                    Active
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Language Switch: en-IN / hi-IN */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setVoiceLang("en-IN")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    voiceLang === "en-IN"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceLang("hi-IN")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    voiceLang === "hi-IN"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* TTS Mute Toggle */}
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                title={isMuted ? "Unmute vocal response" : "Mute vocal response"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-400" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  stopListening();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Voice Input Field */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={
                isListening
                  ? `🎙️ Listening in ${voiceLang === "hi-IN" ? "हिन्दी" : "English"}...`
                  : voiceLang === "hi-IN"
                  ? "बोलें या लिखें (उदा: 'FSSAI लाइसेंस खोलें')..."
                  : "Speak or type (e.g., 'Open FSSAI food license')..."
              }
              className={`w-full pl-3 pr-20 py-2.5 text-xs bg-slate-900/90 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                isListening
                  ? "border-red-500 ring-2 ring-red-500/40 bg-red-950/20"
                  : "border-slate-800 focus:border-blue-500"
              }`}
            />

            <div className="absolute right-1.5 flex items-center gap-1">
              {isSpeechSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-1.5 rounded-lg transition-all ${
                    isListening
                      ? "bg-red-600 text-white shadow-md shadow-red-600/50"
                      : "bg-slate-800 text-blue-300 hover:bg-slate-700"
                  }`}
                  title={isListening ? "Stop listening" : "Start voice recognition"}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              )}

              <button
                type="button"
                onClick={() => processVoiceCommand(inputText)}
                disabled={isLoading || !inputText.trim()}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all flex items-center"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Active Audio Waveform (Listening state) */}
          {isListening && (
            <div className="p-2.5 bg-red-950/40 border border-red-900/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-[11px] text-red-200 font-semibold">
                  Listening ({voiceLang === "hi-IN" ? "हिन्दी" : "Indian English"})...
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[15, 30, 60, 80, 45, 70, 30, 20].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-red-400 rounded-full transition-all duration-75"
                    style={{
                      height: `${Math.max(4, Math.min(18, (h * audioLevel) / 70))}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Status Notification */}
          {statusNotification && (
            <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/60 p-2 rounded-xl animate-pulse font-medium">
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>{statusNotification}</span>
            </div>
          )}

          {/* Executed Tool Actions Feed */}
          {activeActions.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Dispatched Tool Actions ({activeActions.length}):
              </span>
              <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                {activeActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-slate-900/90 border border-emerald-900/60 rounded-xl flex items-center gap-2 text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-mono text-[10px] font-bold text-emerald-300 block">
                        {action.name}
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

          {/* Dynamic Choice Chips Disambiguation */}
          {choiceChipsData && choiceChipsData.length > 0 && (
            <div className="space-y-1.5 pt-1 border-t border-slate-800">
              <ChoiceChips
                prompt={choiceChipsPrompt || "Suggested Journeys:"}
                options={choiceChipsData}
                onSelect={() => setIsOpen(false)}
              />
            </div>
          )}

          {/* Suggested Follow-up Chips */}
          {copilotResponse && copilotResponse.suggested_chips && copilotResponse.suggested_chips.length > 0 && !isLoading && (
            <div className="space-y-1 pt-1 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Follow-up Suggestions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {copilotResponse.suggested_chips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputText(chip);
                      processVoiceCommand(chip);
                    }}
                    className="text-[11px] px-2 py-0.5 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800/60 text-indigo-200 rounded-lg transition-all"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Voice Prompt Chips */}
          <div className="space-y-1.5 pt-1 border-t border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Voice Commands:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_VOICE_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setVoiceLang(item.lang);
                    setInputText(item.query);
                    processVoiceCommand(item.query);
                  }}
                  className="text-[11px] px-2.5 py-1 bg-slate-900 hover:bg-blue-900/60 border border-slate-800 hover:border-blue-500/60 text-slate-300 hover:text-white rounded-lg transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Mic Button with Active Pulsing Ripple Animation */}
      <div className="relative group">
        {/* Active Listening Glowing Ripple Rings */}
        {isListening && (
          <>
            <span className="absolute -inset-2 rounded-full bg-red-600 opacity-40 animate-ping pointer-events-none" />
            <span className="absolute -inset-4 rounded-full bg-red-500 opacity-20 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Floating Trigger Button */}
        <button
          type="button"
          onClick={() => {
            if (!isOpen) {
              setIsOpen(true);
              startListening();
            } else {
              toggleListening();
            }
          }}
          className={`relative p-4 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
            isListening
              ? "bg-gradient-to-r from-red-600 to-rose-600 ring-4 ring-red-400/50 shadow-red-600/50"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 ring-4 ring-blue-400/30 shadow-blue-600/40"
          }`}
          title={isListening ? "Listening... Click to stop" : "Open AI Voice Copilot"}
        >
          {isListening ? (
            <Mic className="w-6 h-6 animate-pulse" />
          ) : (
            <Mic className="w-6 h-6" />
          )}

          {/* Small Status Badge Indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isListening ? "bg-red-400" : "bg-emerald-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-slate-950 ${
                isListening ? "bg-red-500" : "bg-emerald-500"
              }`}
            />
          </span>
        </button>
      </div>
    </div>
  );
};

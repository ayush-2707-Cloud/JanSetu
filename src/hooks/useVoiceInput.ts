"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type VoiceLanguage = "en-IN" | "hi-IN";

export interface UseVoiceInputOptions {
  language?: VoiceLanguage;
  continuous?: boolean;
  onTranscriptChange?: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
  silenceTimeoutMs?: number;
}

export interface UseVoiceInputReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  language: VoiceLanguage;
  audioLevel: number;
  setLanguage: (lang: VoiceLanguage) => void;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

/**
 * useVoiceInput
 *
 * Real-time speech-to-text hook with live streaming transcription,
 * instant input mirroring, silence-triggered auto-submission, and active waveform.
 */
export function useVoiceInput({
  language: initialLanguage = "en-IN",
  continuous = true,
  onTranscriptChange,
  onFinalTranscript,
  silenceTimeoutMs = 1500,
}: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [language, setLanguageState] = useState<VoiceLanguage>(initialLanguage);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioAnimationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const lastSpokenTextRef = useRef<string>("");

  // Persistent callback refs to prevent effect re-runs on render cycles
  const onTranscriptChangeRef = useRef(onTranscriptChange);
  const onFinalTranscriptRef = useRef(onFinalTranscript);
  const isListeningTargetRef = useRef(false);
  const languageRef = useRef(language);
  const silenceTimeoutMsRef = useRef(silenceTimeoutMs);

  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange;
    onFinalTranscriptRef.current = onFinalTranscript;
    languageRef.current = language;
    silenceTimeoutMsRef.current = silenceTimeoutMs;
  });

  const stopWaveform = () => {
    if (audioAnimationRef.current) {
      cancelAnimationFrame(audioAnimationRef.current);
      audioAnimationRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  const startWaveform = async () => {
    stopWaveform();

    // Try real Web Audio API with AnalyserNode for live frequency analysis & speech barge-in
    try {
      if (typeof window !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;

          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const analyzeAudio = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            const normalizedLevel = Math.min(100, Math.round((average / 128) * 100));

            // Full-Duplex Speech Barge-In Interruption:
            // If user begins speaking (volume > 15), immediately cancel ongoing TTS speech
            if (normalizedLevel > 15 && typeof window !== "undefined" && window.speechSynthesis?.speaking) {
              window.speechSynthesis.cancel();
            }

            setAudioLevel(normalizedLevel);
            audioAnimationRef.current = requestAnimationFrame(analyzeAudio);
          };

          audioAnimationRef.current = requestAnimationFrame(analyzeAudio);
          return;
        }
      }
    } catch {
      // Fallback to dynamic simulation if getUserMedia is denied/blocked
    }

    const animate = () => {
      setAudioLevel(Math.floor(Math.random() * 60) + 20);
      audioAnimationRef.current = requestAnimationFrame(animate);
    };
    audioAnimationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    } else {
      setIsSupported(true);
    }
  }, []);

  const createRecognitionInstance = useCallback(() => {
    if (typeof window === "undefined") return null;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return null;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = languageRef.current;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        startWaveform();
      };

      recognition.onresult = (event: any) => {
        let fullTranscript = "";
        let currentInterim = "";

        for (let i = 0; i < event.results.length; i++) {
          const chunk = event.results[i][0]?.transcript || "";
          fullTranscript += chunk;
          if (!event.results[i].isFinal) {
            currentInterim += chunk;
          }
        }

        const combined = fullTranscript.trim();
        if (combined) {
          lastSpokenTextRef.current = combined;
          setTranscript(combined);
          setInterimTranscript(currentInterim);

          // Instantly notify parent so text appears in real time
          if (onTranscriptChangeRef.current) {
            onTranscriptChangeRef.current(combined);
          }

          // Debounce final submission when speech pauses
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (lastSpokenTextRef.current && onFinalTranscriptRef.current) {
              const textToSubmit = lastSpokenTextRef.current;
              lastSpokenTextRef.current = "";
              isListeningTargetRef.current = false;
              setIsListening(false);
              stopWaveform();
              try {
                recognition.stop();
              } catch {}
              onFinalTranscriptRef.current(textToSubmit);
            }
          }, silenceTimeoutMsRef.current);
        }
      };

      recognition.onerror = (event: any) => {
        const err = event.error;
        if (err !== "no-speech" && err !== "aborted") {
          console.warn("Voice input error:", err);
          setError(`Mic error: ${err}`);
        }

        if (err === "not-allowed" || err === "service-not-allowed") {
          isListeningTargetRef.current = false;
          setIsListening(false);
          stopWaveform();
          setError("Microphone permission denied. Please allow mic access in your browser bar.");
        }
      };

      recognition.onend = () => {
        if (isListeningTargetRef.current) {
          try {
            recognition.lang = languageRef.current;
            recognition.start();
            return;
          } catch {
            // Ignore
          }
        }

        setIsListening(false);
        stopWaveform();
      };

      return recognition;
    } catch {
      return null;
    }
  }, [continuous]);

  const startListening = useCallback(async () => {
    setError(null);
    lastSpokenTextRef.current = "";
    setTranscript("");
    setInterimTranscript("");

    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        console.warn("Microphone access prompt error:", e);
      }
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }

      const rec = createRecognitionInstance();
      if (!rec) {
        setIsSupported(false);
        setError("Web Speech API is not supported in this browser. Please type your query.");
        return;
      }

      recognitionRef.current = rec;
      isListeningTargetRef.current = true;
      rec.lang = languageRef.current;
      rec.start();
    } catch (err: any) {
      console.warn("Voice input start error:", err);
      isListeningTargetRef.current = true;
      setIsListening(true);
      startWaveform();
    }
  }, [createRecognitionInstance]);

  const stopListening = useCallback(() => {
    isListeningTargetRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    stopWaveform();
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    // If user manually stopped listening and had spoken text, submit immediately
    if (lastSpokenTextRef.current && onFinalTranscriptRef.current) {
      const textToSubmit = lastSpokenTextRef.current;
      lastSpokenTextRef.current = "";
      onFinalTranscriptRef.current(textToSubmit);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListeningTargetRef.current || isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resetTranscript = useCallback(() => {
    lastSpokenTextRef.current = "";
    setTranscript("");
    setInterimTranscript("");
  }, []);

  const setLanguage = useCallback((lang: VoiceLanguage) => {
    setLanguageState(lang);
    languageRef.current = lang;
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
    }
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    language,
    audioLevel,
    setLanguage,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    error,
  };
}

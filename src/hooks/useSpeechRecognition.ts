"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SpeechRecognitionHookOptions {
  language?: "EN" | "HI" | "KN";
  onTranscriptChange?: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
  silenceTimeoutMs?: number;
}

export function useSpeechRecognition({
  language = "EN",
  onTranscriptChange,
  onFinalTranscript,
  silenceTimeoutMs = 1500,
}: SpeechRecognitionHookOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioAnimationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const lastSpokenTextRef = useRef<string>("");

  const onTranscriptChangeRef = useRef(onTranscriptChange);
  const onFinalTranscriptRef = useRef(onFinalTranscript);
  const isListeningTargetRef = useRef(false);
  const languageRef = useRef(language);
  const silenceTimeoutMsRef = useRef(silenceTimeoutMs);

  const getLanguageTag = (lang: "EN" | "HI" | "KN") => {
    switch (lang) {
      case "HI":
        return "hi-IN";
      case "KN":
        return "kn-IN";
      case "EN":
      default:
        return "en-IN";
    }
  };

  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange;
    onFinalTranscriptRef.current = onFinalTranscript;
    languageRef.current = language;
    silenceTimeoutMsRef.current = silenceTimeoutMs;
    if (recognitionRef.current) {
      recognitionRef.current.lang = getLanguageTag(language);
    }
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

    // Graceful fallback animation
    const simulateAudioWave = () => {
      setAudioLevel(Math.floor(Math.random() * 60) + 20);
      audioAnimationRef.current = requestAnimationFrame(simulateAudioWave);
    };
    audioAnimationRef.current = requestAnimationFrame(simulateAudioWave);
  };

  // Check support on mount
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
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getLanguageTag(languageRef.current);

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
          if (onTranscriptChangeRef.current) {
            onTranscriptChangeRef.current(combined);
          }

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
          console.warn("Speech recognition notice:", err);
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
            recognition.lang = getLanguageTag(languageRef.current);
            recognition.start();
            return;
          } catch {
            // Ignore restart failure
          }
        }

        setIsListening(false);
        stopWaveform();
      };

      return recognition;
    } catch {
      return null;
    }
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    lastSpokenTextRef.current = "";
    setTranscript("");
    setInterimTranscript("");

    // Request browser mic permission if navigator mediaDevices is available
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
      rec.lang = getLanguageTag(languageRef.current);
      rec.start();
    } catch (err: any) {
      console.warn("Recognition start error:", err);
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

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    audioLevel,
    startListening,
    stopListening,
    toggleListening,
    error,
  };
}

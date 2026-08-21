"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = useCallback(
    (text: string, language: "EN" | "HI" | "KN" = "EN") => {
      if (!synthRef.current || isMuted || !text.trim()) return;

      try {
        synthRef.current.cancel(); // Stop any active speech

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        switch (language) {
          case "HI":
            utterance.lang = "hi-IN";
            break;
          case "KN":
            utterance.lang = "kn-IN";
            break;
          case "EN":
          default:
            utterance.lang = "en-IN";
            break;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synthRef.current.speak(utterance);
      } catch (err) {
        console.warn("Text-to-speech error:", err);
        setIsSpeaking(false);
      }
    },
    [isMuted]
  );

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      if (!prev && synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      return !prev;
    });
  }, []);

  return {
    isSpeaking,
    isMuted,
    isSupported,
    speak,
    stop,
    toggleMute,
  };
}

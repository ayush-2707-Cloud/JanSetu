"use client";

import React, { useEffect, useRef } from "react";

interface CelebrationConfettiProps {
  isActive: boolean;
  durationMs?: number;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  opacity: number;
  shape: "rect" | "circle";
}

const COLORS = [
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#ef4444", // Red
  "#fbbf24", // Gold
];

export const CelebrationConfetti: React.FC<CelebrationConfettiProps> = ({
  isActive,
  durationMs = 2800,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = Math.min(140, Math.floor(window.innerWidth / 10));

    // Spawn burst from top center and sides
    for (let i = 0; i < particleCount; i++) {
      const startX = window.innerWidth * (0.2 + Math.random() * 0.6);
      const startY = window.innerHeight * (0.1 + Math.random() * 0.2);
      
      particles.push({
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 10 - 2,
        size: Math.random() * 8 + 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle",
      });
    }

    let animationFrameId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Physics update
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Gravity
        p.vx *= 0.985; // Air friction
        p.rotation += p.vRot;
        p.opacity = Math.max(0, 1 - progress * 1.2);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (onComplete) onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isActive, durationMs, onComplete]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100] w-full h-full"
      aria-hidden="true"
    />
  );
};

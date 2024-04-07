"use client";

import { useRef, type ReactNode } from "react";

/**
 * Effet de tilt 3D qui suit la souris, signature des landing
 * fintech (Revolut, Stripe). Se désactive naturellement au
 * toucher (pas de mouvement de souris sur mobile).
 */
export default function TiltCard({
  children,
  className = "",
  max = 14,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Pas de transition pendant le mouvement : suivi de la souris précis.
    el.style.transition = "none";
    el.style.transform = `perspective(1000px) rotateY(${x * max}deg) rotateX(${y * -max}deg)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    // La transition (classe Tailwind) reprend pour un retour fluide.
    el.style.transition = "";
    el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

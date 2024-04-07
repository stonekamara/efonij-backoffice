"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Animation d'image liée au scroll, signature Revolut :
 * la carte/visuel pivote en 3D et se déplace en parallaxe selon
 * sa position dans le viewport. Rythmée par requestAnimationFrame,
 * désactivée si l'utilisateur préfère réduire les animations.
 */
export default function ScrollMotion({
  children,
  className = "",
  maxRotate = 16,
  parallax = 36,
}: {
  children: ReactNode;
  className?: string;
  maxRotate?: number;
  parallax?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < -120 || rect.top > vh + 120) return;
      // -1 → élément en bas de l'écran, +1 → en haut
      const center = rect.top + rect.height / 2;
      const progress = Math.max(
        -1.2,
        Math.min(1.2, (vh / 2 - center) / (vh / 2)),
      );
      const rotateY = progress * maxRotate;
      const translateY = progress * parallax;
      el.style.transform = `perspective(1100px) rotateY(${rotateY}deg) translateY(${translateY}px)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [maxRotate, parallax]);

  return (
    <div
      ref={ref}
      className={`will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

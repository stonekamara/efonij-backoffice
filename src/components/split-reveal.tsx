"use client";

import { useEffect, useRef, useState } from "react";

/** Titre révélé mot par mot (effet « split text ») quand il entre dans le viewport. */
export default function SplitReveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <h2 ref={ref} data-split aria-label={text} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top">
          <span
            className={`inline-block transition-transform duration-700 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] ${
              visible ? "translate-y-0" : "translate-y-[110%]"
            }`}
            style={{ transitionDelay: `${i * 55}ms` }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </h2>
  );
}

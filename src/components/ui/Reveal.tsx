"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Fait apparaître en cascade les enfants marqués [data-reveal] quand ils
 * entrent dans l'écran (ScrollTrigger.batch : un seul observateur pour tous).
 */
export function Reveal({
  children,
  className,
  y = 48,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
        if (!items.length) return;
        gsap.set(items, { autoAlpha: 0, y });
        ScrollTrigger.batch(items, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.2, stagger, ease: "expo.out" }),
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

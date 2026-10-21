"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Curseur en deux couches : un point qui suit exactement la souris et un
 * anneau qui le rattrape avec inertie. Un élément avec data-cursor="Voir"
 * transforme l'anneau en pastille avec ce libellé.
 */
const FINE = "(pointer: fine)";
const isFinePointer = () => window.matchMedia(FINE).matches;
const subscribeFinePointer = (cb: () => void) => {
  const mq = window.matchMedia(FINE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const enabled = useSyncExternalStore(subscribeFinePointer, isFinePointer, () => false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3.out" });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest("a, button, [role='button'], input, textarea, select, summary");
      const next = labelled?.dataset.cursor ?? "";
      setLabel(next);
      gsap.to(ring.current, {
        scale: next ? 2.6 : interactive ? 1.7 : 1,
        backgroundColor: next ? "rgba(255,77,28,1)" : "rgba(255,77,28,0)",
        borderColor: next ? "rgba(255,77,28,1)" : interactive ? "rgba(243,240,234,0.9)" : "rgba(243,240,234,0.45)",
        duration: 0.45,
        ease: "expo.out",
      });
      gsap.to(dot.current, { scale: next || interactive ? 0 : 1, duration: 0.3 });
    };

    const leave = () => {
      shown = false;
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
    };
    const down = () => gsap.to(ring.current, { scale: "-=0.25", duration: 0.2 });
    const up = () => gsap.to(ring.current, { scale: "+=0.25", duration: 0.35 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor-layer pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      <div
        ref={ring}
        className="invisible absolute left-0 top-0 -ml-5 -mt-5 flex size-10 items-center justify-center rounded-full border border-ink/45 opacity-0"
      >
        <span
          className="font-mono text-[4.5px] font-medium uppercase tracking-[0.12em] text-[#0a0a0a] transition-opacity duration-300"
          style={{ opacity: label ? 1 : 0 }}
        >
          {label}
        </span>
      </div>
      <div
        ref={dot}
        className="invisible absolute left-0 top-0 -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-accent opacity-0"
      />
    </div>
  );
}

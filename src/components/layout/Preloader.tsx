"use client";

import { useEffect, useRef } from "react";
import { useDict } from "@/components/providers/I18nProvider";
import { site } from "@/data/site";
import { gsap } from "@/lib/gsap";
import { lockScroll, markIntroDone } from "@/lib/stores";

/**
 * Écran d'ouverture : compteur 0 → 100, prénom qui monte lettre par lettre,
 * puis rideau qui s'ouvre sur le hero. Joué une seule fois par session.
 */
export function Preloader() {
  const dict = useDict();
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (html.classList.contains("intro-seen") || reduce || !root.current) {
      if (root.current) root.current.style.display = "none";
      markIntroDone();
      return;
    }

    lockScroll(true);
    const value = { n: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem("ab-intro", "1");
        } catch {}
        html.classList.add("intro-seen");
        lockScroll(false);
      },
    });

    tl.from("[data-pre-letter]", { yPercent: 110, stagger: 0.05, duration: 1.1, ease: "expo.out" }, 0)
      .from("[data-pre-meta]", { autoAlpha: 0, y: 10, duration: 0.8 }, 0.2)
      .to(
        value,
        {
          n: 100,
          duration: 1.9,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counter.current) counter.current.textContent = String(Math.round(value.n)).padStart(3, "0");
          },
        },
        0
      )
      .to("[data-pre-bar]", { scaleX: 1, duration: 1.9, ease: "power2.inOut" }, 0)
      .to("[data-pre-letter]", { yPercent: -110, stagger: 0.03, duration: 0.7, ease: "expo.in" }, 2.0)
      .to("[data-pre-meta]", { autoAlpha: 0, duration: 0.4 }, 2.0)
      .add(() => markIntroDone(), 2.45)
      .to("[data-pre-panel]", { yPercent: -100, duration: 1.1, ease: "expo.inOut", stagger: 0.08 }, 2.45)
      .set(root.current, { display: "none" });

    return () => {
      tl.kill();
      lockScroll(false);
    };
  }, []);

  return (
    <div ref={root} className="preloader fixed inset-0 z-[150]" aria-hidden>
      <div data-pre-panel className="absolute inset-0 bg-bg-2" />
      <div data-pre-panel className="absolute inset-0 flex flex-col justify-between bg-bg p-6 sm:p-10">
        <div data-pre-meta className="flex justify-between font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
          <span>{site.role[dict.locale as "fr" | "en"]}</span>
          <span>©{site.copyrightYear}</span>
        </div>

        <div className="flex items-end justify-between gap-6">
          <p className="flex overflow-hidden text-[18vw] font-semibold leading-[0.85] tracking-[-0.06em] sm:text-[12vw]">
            {site.firstName.split("").map((c, i) => (
              <span key={i} data-pre-letter className="inline-block">
                {c}
              </span>
            ))}
          </p>
          <span data-pre-meta className="pb-[1.2vw] font-mono text-sm text-accent sm:text-base">
            <span ref={counter}>000</span>
          </span>
        </div>

        <div data-pre-meta className="h-px w-full bg-line">
          <div data-pre-bar className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}

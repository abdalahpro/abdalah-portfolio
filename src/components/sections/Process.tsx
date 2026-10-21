"use client";

import { useRef } from "react";
import { useDict } from "@/components/providers/I18nProvider";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** Titre collant à gauche, étapes à droite reliées par une ligne qui se remplit. */
export function Process() {
  const dict = useDict();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-process-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-process-list]", start: "top 60%", end: "bottom 60%", scrub: true },
          }
        );
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          gsap.fromTo(
            step,
            { opacity: 0.25 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: step, start: "top 70%", end: "top 45%", scrub: true },
            }
          );
          gsap.fromTo(
            step.querySelector("[data-step-dot]"),
            { scale: 0.4, backgroundColor: "#16241f" },
            {
              scale: 1,
              backgroundColor: "#c9a96e",
              scrollTrigger: { trigger: step, start: "top 60%", toggleActions: "play none none reverse" },
              duration: 0.5,
            }
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="process" className="relative py-28 sm:py-40">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow mb-6">
              <span className="h-px w-8 bg-accent" />
              {dict.process.eyebrow}
            </p>
            <SplitReveal className="text-display text-[clamp(2.4rem,4.6vw,5rem)]">{dict.process.title}</SplitReveal>
            <p className="mt-6 max-w-md text-ink-2 sm:text-lg">{dict.process.subtitle}</p>
          </div>
        </div>

        <ol data-process-list className="relative lg:col-span-6 lg:col-start-7">
          <span className="absolute bottom-0 left-[11px] top-0 w-px bg-line" aria-hidden />
          <span data-process-line className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-accent" aria-hidden />
          {dict.process.steps.map((s, i) => (
            <li key={s.title} data-step className="relative pb-16 pl-14 last:pb-0 sm:pb-24">
              <span data-step-dot className="absolute left-0 top-2 size-[23px] rounded-full border-4 border-bg bg-bg-3" />
              <span className="font-mono text-xs tracking-[0.2em] text-muted">
                {dict.process.eyebrow} — {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-[clamp(1.8rem,3.2vw,3.2rem)] font-semibold leading-none tracking-[-0.04em]">
                {s.title}
              </h3>
              <p className="mt-4 max-w-md text-ink-2 sm:text-lg">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

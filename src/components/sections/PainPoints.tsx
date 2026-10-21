"use client";

import { useRef } from "react";
import { useDict } from "@/components/providers/I18nProvider";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

/**
 * 1) Manifeste : chaque mot s'allume au rythme du scroll.
 * 2) Les 6 freins à la vente en cartes "sticky" qui s'empilent ; la carte
 *    recouverte recule et s'assombrit.
 */
export function PainPoints() {
  const dict = useDict();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create("[data-manifesto]", { type: "words", autoSplit: true });
        gsap.fromTo(
          split.words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: "[data-manifesto]", start: "top 80%", end: "bottom 45%", scrub: true },
          }
        );

        const cards = gsap.utils.toArray<HTMLElement>("[data-pain-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          // Assombrir (et non rendre transparent) : le texte de la carte
          // recouverte ne doit pas transparaître à travers la suivante.
          gsap.to(card.querySelector("[data-pain-inner]"), {
            scale: 0.92,
            filter: "brightness(0.35)",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
          });
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative py-28 sm:py-40">
      <div className="container-x">
        <p className="eyebrow mb-10">
          <span className="h-px w-8 bg-accent" />
          {dict.manifesto.eyebrow}
        </p>
        <p
          data-manifesto
          className="max-w-6xl text-[clamp(1.9rem,4.6vw,4.6rem)] font-medium leading-[1.08] tracking-[-0.035em]"
        >
          {dict.manifesto.text}
        </p>
      </div>

      <div className="container-x mt-24 sm:mt-36">
        {dict.painPoints.items.map((item, i) => (
          <article
            key={item.title}
            data-pain-card
            className="sticky mb-6 last:mb-0"
            style={{ top: `calc(12vh + ${i * 22}px)` }}
          >
            <div
              data-pain-inner
              className="grid origin-top gap-8 overflow-hidden rounded-[2rem] border border-line bg-bg-2 p-7 shadow-[0_-30px_60px_-30px_rgba(0,0,0,0.8)] sm:p-12 md:grid-cols-12 md:gap-12 md:p-16"
            >
              <div className="flex items-start justify-between md:col-span-5 md:flex-col">
                <span className="font-mono text-xs tracking-[0.2em] text-muted">
                  {String(i + 1).padStart(2, "0")} / {String(dict.painPoints.items.length).padStart(2, "0")}
                </span>
                <span className="text-[clamp(3.5rem,9vw,9rem)] font-semibold leading-none tracking-[-0.06em] text-accent">
                  {item.stat || <span className="text-outline">{String(i + 1).padStart(2, "0")}</span>}
                </span>
              </div>
              <div className="md:col-span-7 md:pt-2">
                <h3 className="text-[clamp(1.6rem,3vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
                  {item.title}
                </h3>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">{item.description}</p>
                {item.source && <p className="mt-6 font-mono text-xs text-muted">{item.source}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

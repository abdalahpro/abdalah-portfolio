"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useDict, useLocale } from "@/components/providers/I18nProvider";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { StoreFrame } from "@/components/ui/StoreFrame";
import { localePath } from "@/i18n/types";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import type { ProjectView } from "@/lib/projects";

/**
 * Galerie horizontale épinglée : le scroll vertical fait glisser les boutiques
 * de droite à gauche. Sur mobile, simple carrousel tactile à aimantation.
 */
export function Work({ projects, total }: { projects: ProjectView[]; total: number }) {
  const dict = useDict();
  const locale = useLocale();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const el = track.current;
        if (!el) return;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-work-card]").forEach((card) => {
          gsap.from(card.querySelector("[data-work-media]"), {
            scale: 0.86,
            rotate: 2,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "left 45%",
              scrub: true,
            },
          });
        });

        gsap.to("[data-work-intro]", {
          xPercent: -30,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerWidth * 0.6}`,
            scrub: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="work" className="relative overflow-hidden py-24 lg:h-screen lg:py-0">
      <div data-work-intro className="container-x lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[42vw] lg:flex-col lg:justify-center">
        <p className="eyebrow mb-6">
          <span className="h-px w-8 bg-accent" />
          {dict.work.eyebrow}
        </p>
        <SplitReveal className="text-display text-[clamp(2.6rem,5.6vw,6.5rem)]">{dict.work.title}</SplitReveal>
        <p className="mt-6 max-w-md text-ink-2 sm:text-lg">{dict.work.subtitle}</p>
        <p className="mt-8 hidden font-mono text-xs uppercase tracking-[0.2em] text-muted lg:block">
          {dict.work.hoverHint} →
        </p>
      </div>

      <div
        ref={track}
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-10 lg:mt-0 lg:h-full lg:snap-none lg:items-center lg:gap-[3vw] lg:overflow-visible lg:pl-[46vw] lg:pr-[8vw]"
      >
        {projects.map((p, i) => (
          <article key={p.id} data-work-card className="group w-[78vw] shrink-0 snap-center sm:w-[46vw] lg:w-[min(27vw,56vh)]">
            <a href={p.url} target="_blank" rel="noreferrer" data-cursor={dict.common.viewLive} className="block">
              <div data-work-media className="will-change-transform">
                <StoreFrame project={p} sizes="(min-width: 1024px) 27vw, 78vw" priority={i < 2} />
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[0.7rem] tracking-[0.2em] text-muted">
                    {String(i + 1).padStart(2, "0")} — {dict.catalog.niches[p.niche] ?? p.niche}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{p.name}</h3>
                  <p className="mt-1 text-sm text-ink-2">{p.tagline}</p>
                </div>
                <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </a>
          </article>
        ))}

        <article data-work-card className="flex w-[78vw] shrink-0 snap-center items-center justify-center sm:w-[46vw] lg:w-[min(27vw,56vh)]">
          <Link
            href={localePath(locale, "/realisations")}
            data-work-media
            className="group relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-full border border-line-strong text-center"
          >
            <span className="absolute inset-0 scale-0 rounded-full bg-accent transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-100" />
            <span className="relative text-[clamp(3.5rem,7vw,7rem)] font-semibold leading-none tracking-[-0.06em] transition-colors group-hover:text-bg">
              {total}
            </span>
            <span className="relative mt-2 text-sm text-ink-2 transition-colors group-hover:text-bg">{dict.work.viewAllSub}</span>
            <span className="relative mt-6 inline-flex items-center gap-2 font-medium transition-colors group-hover:text-bg">
              {dict.work.viewAll}
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
        </article>
      </div>
    </section>
  );
}

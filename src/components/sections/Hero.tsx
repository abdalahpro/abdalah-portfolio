"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useDict } from "@/components/providers/I18nProvider";
import { Magnetic } from "@/components/ui/Magnetic";
import { site } from "@/data/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useIntroDone } from "@/lib/stores";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

/** Une ligne du titre : chaque mot est masqué, chaque lettre monte dans son masque. */
function TitleLine({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, w) => (
        <span key={w} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          {word.split("").map((c, i) => (
            <span key={i} data-hero-char className="inline-block will-change-transform">
              {c}
            </span>
          ))}
          {" "}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const dict = useDict();
  const locale = dict.locale as "fr" | "en";
  const root = useRef<HTMLElement>(null);
  const introDone = useIntroDone();

  // Entrée : se déclenche à la fin du préchargeur.
  useGSAP(
    () => {
      if (!introDone) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set("[data-hero-reveal]", { opacity: 1 });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from("[data-hero-char]", { yPercent: 115, rotate: 6, duration: 1.4, stagger: 0.022 }, 0)
          .from("[data-hero-fade]", { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.08 }, 0.5)
          .from("[data-hero-stat]", { autoAlpha: 0, y: 30, duration: 1.2, stagger: 0.1 }, 0.7)
          .from("[data-hero-scene]", { autoAlpha: 0, scale: 0.85, duration: 2.4 }, 0);
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hero-reveal]", { opacity: 1 });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [introDone] }
  );

  // Sortie au scroll : le titre file vers le haut et s'estompe (parallaxe).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.to("[data-hero-content]", {
          yPercent: -18,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="top" className="relative overflow-hidden">
      <div data-hero-reveal data-hero-scene className="absolute inset-0">
        <HeroScene />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_100%,rgba(9,9,11,0.95)_0%,rgba(9,9,11,0.4)_45%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div
        data-hero-content
        className="container-x relative z-10 flex min-h-[100svh] flex-col justify-end pb-8 pt-28 sm:min-h-[max(100svh,720px)] sm:pb-12"
      >
        <div data-hero-reveal className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-10">
          <p
            data-hero-fade
            className="inline-flex items-center gap-3 rounded-full border border-line bg-bg/40 px-4 py-2 text-xs text-ink-2 backdrop-blur-md sm:text-sm"
          >
            <span className="size-2 animate-pulse-dot rounded-full bg-accent" />
            {dict.hero.badge}
          </p>
          <p data-hero-fade className="hidden font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted md:block">
            {site.location[locale]}
          </p>
        </div>

        <h1
          data-hero-reveal
          className="text-display text-[clamp(2.9rem,8.4vw,10.5rem)] text-ink"
          aria-label={`${dict.hero.titleLine1} ${dict.hero.titleLine2} ${dict.hero.titleHighlight}`}
        >
          <span aria-hidden className="block">
            <TitleLine text={dict.hero.titleLine1} className="block" />
            <TitleLine text={dict.hero.titleLine2} className="block" />
            <TitleLine text={dict.hero.titleHighlight} className="serif-accent block text-accent-2" />
          </span>
        </h1>

        <div data-hero-reveal className="mt-8 grid gap-8 sm:mt-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <p data-hero-fade className="max-w-md text-base leading-relaxed text-ink-2 sm:text-lg">
              {dict.hero.subtitle}
            </p>
            <div data-hero-fade className="mt-7 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.3}>
                <a
                  href="#contact"
                  data-cursor="Go"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-accent py-4 pl-7 pr-5 text-[0.95rem] font-medium text-[#120703]"
                >
                  <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0" />
                  <span className="relative">{dict.hero.ctaPrimary}</span>
                  <span className="relative flex size-7 items-center justify-center rounded-full bg-[#120703] text-accent transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="size-4" />
                  </span>
                </a>
              </Magnetic>
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-4 text-[0.95rem] text-ink-2 transition-colors hover:text-ink"
              >
                <span className="relative">
                  {dict.hero.ctaSecondary}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-ink transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </span>
                <ArrowDownRight className="size-4 transition-transform duration-500 group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6 lg:col-span-6 lg:col-start-7">
            {dict.hero.stats.map((s) => (
              <div key={s.label} data-hero-stat>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">{s.value}</span>
                  <span className="mt-1 block text-xs text-muted sm:text-sm">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="pointer-events-none absolute right-[clamp(1.25rem,4vw,3.5rem)] top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted [writing-mode:vertical-rl]">
          {dict.hero.scrollHint}
        </span>
        <span className="relative h-14 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-line_1.8s_var(--ease-quart)_infinite] bg-ink" />
        </span>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useDict } from "@/components/providers/I18nProvider";
import {
  DemoCompare,
  DemoFaq,
  DemoFlow,
  DemoOffer,
  DemoReviews,
  DemoSales,
  DemoSpeed,
  DemoThemes,
} from "@/components/ui/ServiceDemos";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/*
 * Grille "bento" : 8 cartes de tailles différentes, chacune avec une
 * mini-démo animée du service. Les cartes s'assemblent en 3D à l'entrée
 * puis s'inclinent légèrement sous le pointeur.
 */

// Placement dans la grille 4 colonnes (desktop) — même ordre que dict.services.items.
const spans = [
  "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  "sm:col-span-2 lg:col-span-2",
  "",
  "",
  "sm:col-span-2 lg:col-span-2",
  "",
  "",
  "sm:col-span-2 lg:col-span-4",
];

function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
    ref.current.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
    ref.current.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    ref.current.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const leave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={cn(
        "group relative h-full overflow-hidden rounded-3xl border border-line bg-bg-2 transition-[transform,border-color] duration-500 ease-[var(--ease-expo)] [transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] hover:border-accent/40",
        className
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(500px circle at var(--gx,50%) var(--gy,50%), rgba(201,169,110,0.09), transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}

export function Services() {
  const dict = useDict();
  const s = dict.services;
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  // Les démos ne tournent que lorsque la grille est visible.
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setPlay(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-bento]", {
          y: 90,
          rotateX: -22,
          autoAlpha: 0,
          transformOrigin: "50% 100%",
          duration: 1.3,
          ease: "expo.out",
          stagger: { each: 0.09, from: "start" },
          scrollTrigger: { trigger: grid.current, start: "top 82%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const demos = [
    <DemoFlow key="flow" demo={s.demo} play={play} />,
    <DemoReviews key="reviews" demo={s.demo} />,
    <DemoOffer key="offer" demo={s.demo} play={play} />,
    <DemoCompare key="compare" demo={s.demo} />,
    <DemoFaq key="faq" demo={s.demo} play={play} />,
    <DemoSpeed key="speed" demo={s.demo} play={play} />,
    <DemoThemes key="themes" demo={s.demo} play={play} />,
    <DemoSales key="sales" demo={s.demo} />,
  ];

  return (
    <section ref={root} id="services" className="relative py-28 sm:py-40">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">
              <span className="h-px w-8 bg-accent" />
              {s.eyebrow}
            </p>
            <SplitReveal className="text-display text-[clamp(2.4rem,5vw,5.5rem)]">{s.title}</SplitReveal>
          </div>
          <p className="text-ink-2 sm:text-lg lg:col-span-4 lg:col-start-9">{s.subtitle}</p>
        </div>

        <div
          ref={grid}
          className={cn(
            "mt-16 grid gap-4 [perspective:1600px] sm:mt-20 sm:grid-cols-2 lg:auto-rows-[minmax(19rem,auto)] lg:grid-cols-4",
            !play && "[&_*]:[animation-play-state:paused]"
          )}
        >
          {s.items.map((item, i) => (
            <article key={item.title} data-bento className={spans[i]}>
              <TiltCard className="flex flex-col p-6 sm:p-7">
                <div className="relative flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.2em] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
                    {s.example}
                  </span>
                </div>
                <div
                  className={cn(
                    "relative my-6 flex-1",
                    i === 0 ? "min-h-[17rem]" : i === 7 ? "min-h-[10rem]" : "min-h-[9.5rem]"
                  )}
                  aria-hidden
                >
                  {demos[i]}
                </div>
                <div className="relative">
                  <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2 sm:text-base">{item.description}</p>
                </div>
              </TiltCard>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

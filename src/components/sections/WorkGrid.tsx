"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useDict } from "@/components/providers/I18nProvider";
import { StoreFrame } from "@/components/ui/StoreFrame";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import type { ProjectView } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function WorkGrid({
  projects,
  niches,
}: {
  projects: ProjectView[];
  niches: { niche: string; count: number }[];
}) {
  const dict = useDict();
  const [filter, setFilter] = useState<string>("all");
  const grid = useRef<HTMLDivElement>(null);
  const visible = filter === "all" ? projects : projects.filter((p) => p.niche === filter);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-grid-card]",
          { autoAlpha: 0, y: 60, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            stagger: { each: 0.06, from: "start" },
            ease: "expo.out",
            scrollTrigger: { trigger: grid.current, start: "top 85%", once: true },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: grid, dependencies: [filter], revertOnUpdate: true }
  );

  const chip = (value: string, label: string, count: number) => (
    <button
      key={value}
      type="button"
      onClick={() => setFilter(value)}
      aria-pressed={filter === value}
      className={cn(
        "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors duration-300",
        filter === value ? "border-accent bg-accent text-[#120703]" : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
      )}
    >
      {label}
      <sup className="ml-1 font-mono text-[0.6rem]">{count}</sup>
    </button>
  );

  return (
    <section className="relative pb-24">
      <div className="sticky top-0 z-30 border-b border-line bg-bg/80 py-4 backdrop-blur-xl">
        <div className="container-x flex gap-2 overflow-x-auto [scrollbar-width:none]" data-lenis-prevent>
          {chip("all", dict.workPage.filterAll, projects.length)}
          {niches.map((n) => chip(n.niche, dict.catalog.niches[n.niche] ?? n.niche, n.count))}
        </div>
      </div>

      <div ref={grid} className="container-x mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <article key={p.id} data-grid-card className="group">
            <a href={p.url} target="_blank" rel="noreferrer" data-cursor={dict.common.viewLive} className="block">
              <StoreFrame project={p} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw" priority={i < 3} />
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[0.7rem] tracking-[0.2em] text-muted">
                    {dict.catalog.niches[p.niche] ?? p.niche} · {p.year}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{p.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-2">{p.description}</p>
                </div>
                <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

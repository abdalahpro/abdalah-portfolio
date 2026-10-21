"use client";

import { useState } from "react";
import { useDict } from "@/components/providers/I18nProvider";
import { HoverPreview } from "@/components/ui/HoverPreview";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";

export interface NicheEntry {
  niche: string;
  count: number;
  image: string;
}

/** Les univers produits, en grande typographie, avec aperçu au survol. */
export function Catalog({ niches }: { niches: NicheEntry[] }) {
  const dict = useDict();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative py-28 sm:py-40">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">
              <span className="h-px w-8 bg-accent" />
              {dict.catalog.eyebrow}
            </p>
            <SplitReveal className="text-display text-[clamp(2.4rem,5vw,5.5rem)]">{dict.catalog.title}</SplitReveal>
          </div>
          <p className="text-ink-2 sm:text-lg lg:col-span-4 lg:col-start-9">{dict.catalog.subtitle}</p>
        </div>

        <Reveal className="mt-16 flex flex-wrap items-baseline gap-x-6 gap-y-2 sm:mt-24" y={40} stagger={0.04}>
          {niches.map((n, i) => (
            <span
              key={n.niche}
              data-reveal
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              className="group inline-flex items-start gap-2 text-[clamp(2.2rem,6.4vw,6.8rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-ink/25 transition-colors duration-500 hover:text-ink"
            >
              <span className="transition-[font-style] group-hover:serif-accent">{dict.catalog.niches[n.niche] ?? n.niche}</span>
              <sup className="mt-[0.6em] font-mono text-xs font-normal tracking-normal text-accent">
                {n.count}&nbsp;{n.count > 1 ? dict.catalog.storesPlural : dict.catalog.storeSingular}
              </sup>
              {i < niches.length - 1 && <span className="text-accent/60">/</span>}
            </span>
          ))}
        </Reveal>
      </div>
      <HoverPreview images={niches.map((n) => n.image)} active={active} />
    </section>
  );
}

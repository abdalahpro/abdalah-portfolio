"use client";

import { useCallback, useState } from "react";
import { useDict } from "@/components/providers/I18nProvider";
import { ReelCard } from "@/components/ui/ReelCard";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { VideoLightbox } from "@/components/ui/VideoLightbox";
import { reels, type Reel } from "@/data/reels";
import { cn } from "@/lib/utils";

/** Deux rangées de téléphones qui défilent en sens inverse (pause au survol). */
export function Reels() {
  const dict = useDict();
  const [open, setOpen] = useState<Reel | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const half = Math.ceil(reels.length / 2);
  const rows = [reels.slice(0, half), reels.slice(half)];

  return (
    <section className="relative overflow-hidden py-28 sm:py-40">
      <div className="container-x mb-16 grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-6">
            <span className="h-px w-8 bg-accent" />
            {dict.reels.eyebrow}
          </p>
          <SplitReveal className="text-display text-[clamp(2.4rem,5vw,5.5rem)]">{dict.reels.title}</SplitReveal>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className="text-ink-2 sm:text-lg">{dict.reels.subtitle}</p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">{dict.reels.hint}</p>
        </div>
      </div>

      <div className="flex -rotate-3 flex-col gap-6">
        {rows.map((row, r) => (
          <div key={r} className="group/row flex overflow-hidden">
            <div
              className={cn(
                "flex w-max gap-6 pr-6 group-hover/row:[animation-play-state:paused]",
                r === 0 ? "animate-marquee" : "animate-marquee-reverse"
              )}
              style={{ ["--marquee-duration" as string]: "70s" }}
            >
              {[...row, ...row].map((reel, i) => (
                <ReelCard
                  key={`${reel.id}-${i}`}
                  reel={reel}
                  caption={dict.reels.captions[reel.caption]}
                  playLabel={dict.common.play}
                  onOpen={setOpen}
                  className="w-[44vw] sm:w-[220px]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <VideoLightbox reel={open} onClose={close} />
    </section>
  );
}

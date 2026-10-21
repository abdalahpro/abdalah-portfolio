"use client";

import { useCallback, useState } from "react";
import { useDict } from "@/components/providers/I18nProvider";
import { ReelCard } from "@/components/ui/ReelCard";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { VideoLightbox } from "@/components/ui/VideoLightbox";
import { reels, type Reel } from "@/data/reels";

export function ReelWall() {
  const dict = useDict();
  const [open, setOpen] = useState<Reel | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section className="relative border-t border-line py-24 sm:py-32">
      <div className="container-x">
        <p className="eyebrow mb-6">
          <span className="h-px w-8 bg-accent" />
          {dict.reels.eyebrow}
        </p>
        <SplitReveal className="text-display text-[clamp(2.4rem,5vw,5.5rem)]">{dict.workPage.videoTitle}</SplitReveal>
        <p className="mt-6 max-w-xl text-ink-2 sm:text-lg">{dict.reels.subtitle}</p>

        <Reveal className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" y={40} stagger={0.04}>
          {reels.map((reel) => (
            <div key={reel.id} data-reveal>
              <ReelCard
                reel={reel}
                caption={dict.reels.captions[reel.caption]}
                playLabel={dict.common.play}
                onOpen={setOpen}
                className="w-full"
              />
            </div>
          ))}
        </Reveal>
      </div>
      <VideoLightbox reel={open} onClose={close} />
    </section>
  );
}

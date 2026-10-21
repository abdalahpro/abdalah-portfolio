"use client";

import { useRef } from "react";
import { useDict } from "@/components/providers/I18nProvider";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Bandeau géant qui défile en continu et s'incline selon la vitesse de scroll. */
export function VelocityMarquee() {
  const dict = useDict();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
        const loops = rows.map((row, i) =>
          gsap.fromTo(
            row,
            { xPercent: i % 2 ? -50 : 0 },
            { xPercent: i % 2 ? 0 : -50, duration: 38, ease: "none", repeat: -1 }
          )
        );
        const skewTo = gsap.quickTo(rows, "skewX", { duration: 0.6, ease: "power3.out" });
        let settle: gsap.core.Tween | null = null;
        // Le scroll accélère le défilement (dans son sens), puis tout revient
        // en douceur à la vitesse de croisière dès que le scroll s'arrête.
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            const dir = self.direction === 1 ? 1 : -1;
            const boost = 1 + Math.min(Math.abs(v) / 350, 6);
            loops.forEach((l) => gsap.to(l, { timeScale: dir * boost, duration: 0.25, overwrite: true }));
            skewTo(gsap.utils.clamp(-10, 10, v / -260));
            settle?.kill();
            settle = gsap.delayedCall(0.12, () => {
              loops.forEach((l) => gsap.to(l, { timeScale: dir, duration: 1.2, overwrite: true }));
              skewTo(0);
            });
          },
        });
        return () => {
          settle?.kill();
          st.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} aria-hidden className="relative overflow-hidden border-y border-line py-8 sm:py-12">
      <MarqueeRow words={dict.marquee} />
      <MarqueeRow words={dict.marquee} outline />
    </div>
  );
}

function MarqueeRow({ words, outline }: { words: string[]; outline?: boolean }) {
  return (
    <div data-row className="flex w-max shrink-0 items-center will-change-transform">
      {[...words, ...words].map((w, i) => (
        <span key={i} className="flex items-center">
          <span
            className={cn(
              "px-[2vw] text-[11vw] font-semibold leading-none tracking-[-0.05em] md:text-[8vw]",
              outline && "text-outline"
            )}
          >
            {w}
          </span>
          <span className="serif-accent text-[7vw] leading-none text-accent md:text-[5vw]">✺</span>
        </span>
      ))}
    </div>
  );
}

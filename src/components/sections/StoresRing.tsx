"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useDict } from "@/components/providers/I18nProvider";
import type { RingDrive } from "@/components/three/RingScene";
import { site } from "@/data/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const RingScene = dynamic(() => import("@/components/three/RingScene"), { ssr: false });

/** Anneau 3D de captures de boutiques piloté par le scroll + compteur géant. */
export function StoresRing({ images }: { images: string[] }) {
  const dict = useDict();
  const root = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const drive = useRef<RingDrive>({ progress: 0, velocity: 0 });

  useGSAP(
    () => {
      const total = site.metrics.storesLaunched;
      const count = { n: 0 };
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          drive.current.progress = self.progress;
          drive.current.velocity = self.getVelocity();
        },
      });
      gsap.to(count, {
        n: total,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 60%", end: "top top", scrub: 1 },
        onUpdate: () => {
          if (counter.current) counter.current.textContent = String(Math.round(count.n));
        },
      });
      gsap.from("[data-ring-copy]", {
        autoAlpha: 0,
        y: 40,
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 40%", once: true },
      });
      return () => st.kill();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative h-[220vh]" aria-label={`${site.metrics.storesLaunched}+ ${dict.ring.line1}`}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <RingScene urls={images} drive={drive} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(11,19,16,0.85)_80%)]" />

        <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center text-center mix-blend-difference">
          <p data-ring-copy className="eyebrow mb-4 !text-ink">
            {dict.ring.eyebrow}
          </p>
          <p className="text-[clamp(6rem,22vw,22rem)] font-semibold leading-[0.8] tracking-[-0.07em] text-ink">
            <span ref={counter}>0</span>
            <span className="serif-accent">+</span>
          </p>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-bg via-bg/80 to-transparent pb-10 pt-24">
          <div className="container-x flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <p data-ring-copy className="text-[clamp(1.6rem,3.2vw,3rem)] font-semibold leading-[1] tracking-[-0.04em]">
              {dict.ring.line1}
              <br />
              <span className="serif-accent font-normal text-accent-2">{dict.ring.line2}</span>
            </p>
            <p data-ring-copy className="max-w-xs text-sm text-ink-2 sm:text-right">
              {dict.ring.caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

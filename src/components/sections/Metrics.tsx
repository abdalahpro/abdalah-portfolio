"use client";

import { useRef } from "react";
import { useDict } from "@/components/providers/I18nProvider";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { gsap, useGSAP } from "@/lib/gsap";

export function Metrics() {
  const dict = useDict();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const obj = { n: 0 };
        gsap.to(obj, {
          n: target,
          duration: 2.2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.n));
          },
        });
      });
      gsap.from("[data-metric]", {
        y: 60,
        autoAlpha: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative border-y border-line bg-bg-2 py-24 sm:py-32">
      <div className="container-x">
        <p className="eyebrow mb-6">
          <span className="h-px w-8 bg-accent" />
          {dict.metrics.eyebrow}
        </p>
        <SplitReveal className="max-w-3xl text-display text-[clamp(2.2rem,4.4vw,4.6rem)]">{dict.metrics.title}</SplitReveal>

        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
          {dict.metrics.items.map((m) => (
            <div key={m.label} data-metric className="flex flex-col justify-between gap-10 bg-bg-2 p-6 sm:p-10">
              <dt className="order-2 text-sm text-ink-2 sm:text-base">{m.label}</dt>
              <dd className="order-1 text-[clamp(3.2rem,7vw,7.5rem)] font-semibold leading-none tracking-[-0.06em]">
                <span data-count={m.value}>{m.value}</span>
                <span className="serif-accent text-accent">{m.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

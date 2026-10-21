"use client";

import { useState } from "react";
import { useDict } from "@/components/providers/I18nProvider";
import { HoverPreview } from "@/components/ui/HoverPreview";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";

export function Services({ images }: { images: string[] }) {
  const dict = useDict();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="services" className="relative py-28 sm:py-40">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">
              <span className="h-px w-8 bg-accent" />
              {dict.services.eyebrow}
            </p>
            <SplitReveal className="text-display text-[clamp(2.4rem,5vw,5.5rem)]">{dict.services.title}</SplitReveal>
          </div>
          <p className="self-end text-ink-2 sm:text-lg lg:col-span-4 lg:col-start-9">{dict.services.subtitle}</p>
        </div>

        <Reveal className="mt-16 border-b border-line sm:mt-24" y={30} stagger={0.06}>
          <ul onPointerLeave={() => setActive(null)}>
            {dict.services.items.map((item, i) => (
              <li
                key={item.title}
                data-reveal
                onPointerEnter={() => setActive(i % images.length)}
                className="group relative border-t border-line"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-y-100" />
                <div className="relative grid gap-3 py-8 transition-colors duration-500 group-hover:text-bg sm:py-10 lg:grid-cols-12 lg:items-baseline lg:gap-8">
                  <span className="font-mono text-xs tracking-[0.2em] text-muted transition-colors group-hover:text-bg/60 lg:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[clamp(1.5rem,2.6vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.035em] transition-transform duration-700 ease-[var(--ease-expo)] lg:col-span-6 lg:group-hover:translate-x-4">
                    {item.title}
                  </h3>
                  <p className="text-ink-2 transition-colors duration-500 group-hover:text-bg/75 lg:col-span-5">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <HoverPreview images={images} active={active} />
    </section>
  );
}

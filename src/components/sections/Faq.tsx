"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useDict } from "@/components/providers/I18nProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { cn } from "@/lib/utils";

export function Faq() {
  const dict = useDict();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-28 sm:py-40">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow mb-6">
              <span className="h-px w-8 bg-accent" />
              {dict.faq.eyebrow}
            </p>
            <SplitReveal className="text-display text-[clamp(2.2rem,4.2vw,4.6rem)]">{dict.faq.title}</SplitReveal>
          </div>
        </div>

        <Reveal className="border-b border-line lg:col-span-7" y={24} stagger={0.05}>
          {dict.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} data-reveal className="border-t border-line">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    id={`faq-q-${i}`}
                    className="group flex w-full items-center justify-between gap-6 py-7 text-left"
                  >
                    <span className="text-lg font-medium tracking-[-0.02em] transition-colors group-hover:text-accent-2 sm:text-2xl">
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500",
                        isOpen && "rotate-45 border-accent bg-accent text-bg"
                      )}
                    >
                      <Plus className="size-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-700 ease-[var(--ease-expo)]",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-8 pr-12 text-ink-2 sm:text-lg">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

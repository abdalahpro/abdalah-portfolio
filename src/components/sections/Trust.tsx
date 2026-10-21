"use client";

import { Code2, MessagesSquare, ShieldCheck, Timer } from "lucide-react";
import { useDict } from "@/components/providers/I18nProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";

const icons = [MessagesSquare, Timer, Code2, ShieldCheck];

/** Cartes avec halo lumineux qui suit le pointeur (variables CSS --x/--y). */
export function Trust() {
  const dict = useDict();

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <section className="relative py-28 sm:py-40">
      <div className="container-x">
        <div className="max-w-4xl">
          <p className="eyebrow mb-6">
            <span className="h-px w-8 bg-accent" />
            {dict.trust.eyebrow}
          </p>
          <SplitReveal className="text-display text-[clamp(2.2rem,4.6vw,5rem)]">{dict.trust.title}</SplitReveal>
          <p className="mt-6 text-ink-2 sm:text-lg">{dict.trust.subtitle}</p>
        </div>

        <Reveal className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dict.trust.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <article
                key={item.title}
                data-reveal
                onPointerMove={onMove}
                className="group relative overflow-hidden rounded-3xl border border-line bg-bg-2 p-8"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgba(201,169,110,0.16), transparent 60%)",
                  }}
                />
                <span className="relative flex size-12 items-center justify-center rounded-2xl border border-line bg-bg-3 text-accent">
                  <Icon className="size-5" />
                </span>
                <h3 className="relative mt-12 text-2xl font-semibold tracking-[-0.03em]">{item.title}</h3>
                <p className="relative mt-3 text-ink-2">{item.description}</p>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

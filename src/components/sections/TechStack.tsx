"use client";

import { useDict } from "@/components/providers/I18nProvider";
import { stack } from "@/data/stack";

export function TechStack() {
  const dict = useDict();
  const items = [...stack, ...stack];

  return (
    <section className="relative border-y border-line py-20 sm:py-28">
      <div className="container-x mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-4">
            <span className="h-px w-8 bg-accent" />
            {dict.techStack.eyebrow}
          </p>
          <h2 className="text-display text-[clamp(2rem,3.6vw,3.6rem)]">{dict.techStack.title}</h2>
        </div>
      </div>

      <div className="mask-fade-x group/stack flex overflow-hidden">
        <ul
          className="flex w-max animate-marquee gap-4 pr-4 group-hover/stack:[animation-play-state:paused]"
          style={{ ["--marquee-duration" as string]: "45s" }}
        >
          {items.map((s, i) => (
            <li
              key={`${s.name}-${i}`}
              aria-hidden={i >= stack.length}
              className="group flex items-center gap-4 rounded-full border border-line bg-bg-2 py-4 pl-4 pr-7 transition-colors duration-500 hover:border-line-strong"
            >
              <span
                className="flex size-12 items-center justify-center rounded-full bg-bg-3 transition-colors duration-500"
                style={{ ["--brand" as string]: s.hex }}
              >
                <svg viewBox="0 0 24 24" className="size-6 fill-ink-2 transition-[fill] duration-500 group-hover:fill-[var(--brand)]" aria-hidden>
                  <path d={s.path} />
                </svg>
              </span>
              <span className="whitespace-nowrap text-xl font-medium tracking-tight sm:text-2xl">{s.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

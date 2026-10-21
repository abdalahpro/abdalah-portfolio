"use client";

import Image from "next/image";
import { useDict } from "@/components/providers/I18nProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { testimonials } from "@/data/testimonials";

/** N'apparaît que lorsqu'au moins un vrai retour client est renseigné. */
export function Testimonials() {
  const dict = useDict();
  const locale = dict.locale as "fr" | "en";
  if (testimonials.length === 0) return null;

  return (
    <section className="relative py-28 sm:py-40">
      <div className="container-x">
        <p className="eyebrow mb-6">
          <span className="h-px w-8 bg-accent" />
          {dict.testimonials.eyebrow}
        </p>
        <SplitReveal className="text-display text-[clamp(2.4rem,5vw,5.5rem)]">{dict.testimonials.title}</SplitReveal>

        <Reveal className="mt-16 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {testimonials.map((t) => (
            <figure key={t.id} data-reveal className="mb-4 break-inside-avoid rounded-3xl border border-line bg-bg-2 p-7">
              {t.image && (
                <Image src={t.image} alt="" width={800} height={1000} className="mb-5 h-auto w-full rounded-2xl" />
              )}
              {t.quote[locale] && (
                <blockquote className="text-lg leading-relaxed text-ink">“{t.quote[locale]}”</blockquote>
              )}
              <figcaption className="mt-5 flex items-center justify-between text-sm">
                <span>
                  <span className="font-medium text-ink">{t.authorName}</span>
                  {t.authorRole && <span className="block text-muted">{t.authorRole[locale]}</span>}
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">{t.source}</span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

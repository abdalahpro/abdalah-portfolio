"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUp } from "lucide-react";
import { useDict, useLocale } from "@/components/providers/I18nProvider";
import { BrandIcon, type Brand } from "@/components/ui/BrandIcon";
import { fullName, site, whatsappUrl } from "@/data/site";
import { localePath } from "@/i18n/types";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/stores";

export function Footer() {
  const dict = useDict();
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);
  const home = localePath(locale, "/");
  const prefix = home === "/" ? "" : home;

  const socials = [
    { name: "github" as Brand, label: "GitHub", href: site.socials.github },
    { name: "linkedin" as Brand, label: "LinkedIn", href: site.socials.linkedin },
    { name: "instagram" as Brand, label: "Instagram", href: site.socials.instagram },
    { name: "whatsapp" as Brand, label: "WhatsApp", href: whatsappUrl },
  ].filter((s) => s.href);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-wordmark] span", {
          yPercent: 100,
          stagger: 0.05,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-wordmark]", start: "top 95%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-line bg-bg pt-20">
      <div className="container-x grid gap-12 pb-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="max-w-sm text-2xl leading-snug tracking-tight text-ink">{dict.footer.tagline}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-block border-b border-line-strong pb-1 text-lg text-ink-2 transition-colors hover:border-accent hover:text-ink"
          >
            {site.email}
          </a>
        </div>
        <div className="md:col-span-3 md:col-start-7">
          <p className="eyebrow mb-5">{dict.footer.explore}</p>
          <ul className="space-y-2 text-ink-2">
            <li><Link className="hover:text-ink" href={`${prefix}/#work`}>{dict.nav.work}</Link></li>
            <li><Link className="hover:text-ink" href={`${prefix}/#services`}>{dict.nav.services}</Link></li>
            <li><Link className="hover:text-ink" href={localePath(locale, "/realisations")}>{dict.workPage.title}</Link></li>
            <li><Link className="hover:text-ink" href={localePath(locale, "/cv")}>{dict.nav.cv}</Link></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow mb-5">{dict.footer.elsewhere}</p>
          <ul className="space-y-2 text-ink-2">
            {socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ink">
                  <BrandIcon name={s.name} className="size-4" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Taille en cqw (largeur du conteneur, pas de l'écran) : le prénom
          tient toujours en entier, même sur les très grands écrans. */}
      <div className="container-x [container-type:inline-size]">
        <p
          data-wordmark
          aria-hidden
          className="flex select-none overflow-hidden pb-[1cqw] text-[30cqw] font-semibold leading-[0.8] tracking-[-0.075em] text-ink"
        >
          {site.firstName.split("").map((c, i) => (
            <span key={i} className="inline-block">
              {c}
            </span>
          ))}
        </p>
      </div>

      <div className="container-x flex flex-col items-start justify-between gap-4 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center">
        <p>
          © {site.copyrightYear} {fullName}. {dict.footer.rights}
        </p>
        <p className="font-mono">{dict.footer.madeWith}</p>
        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-ink-2 transition-colors hover:border-accent hover:text-ink"
        >
          {dict.common.backToTop}
          <ArrowUp className="size-3.5" />
        </button>
      </div>
    </footer>
  );
}

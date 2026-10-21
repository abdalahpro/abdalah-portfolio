"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useDict, useLocale } from "@/components/providers/I18nProvider";
import { Magnetic } from "@/components/ui/Magnetic";
import { fullName, site } from "@/data/site";
import { localePath, switchLocalePath } from "@/i18n/types";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { lockScroll } from "@/lib/stores";
import { cn } from "@/lib/utils";

export function Nav() {
  const dict = useDict();
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  const home = localePath(locale, "/");
  const basePath = locale === "en" ? pathname.replace(/^\/en/, "") || "/" : pathname;
  const links = [
    { href: `${home === "/" ? "" : home}/#work`, label: dict.nav.work },
    { href: `${home === "/" ? "" : home}/#services`, label: dict.nav.services },
    { href: `${home === "/" ? "" : home}/#process`, label: dict.nav.process },
    { href: `${home === "/" ? "" : home}/#faq`, label: dict.nav.faq },
    { href: localePath(locale, "/cv"), label: dict.nav.cv },
  ];

  // Barre qui se cache en descendant, réapparaît en remontant + progression.
  useGSAP(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
        if (!bar.current) return;
        const scrolled = self.scroll() > 80;
        bar.current.dataset.scrolled = String(scrolled);
        gsap.to(bar.current, {
          yPercent: self.direction === 1 && scrolled ? -110 : 0,
          duration: 0.6,
          ease: "expo.out",
          overwrite: "auto",
        });
      },
    });
    return () => st.kill();
  });

  // Menu plein écran (mobile).
  useEffect(() => {
    const el = menu.current;
    if (!el) return;
    lockScroll(open);
    const items = el.querySelectorAll("[data-menu-item]");
    if (open) {
      gsap.set(el, { display: "flex" });
      gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" });
      gsap.fromTo(items, { yPercent: 120 }, { yPercent: 0, stagger: 0.06, delay: 0.35, duration: 1, ease: "expo.out" });
    } else {
      gsap.to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.7,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(el, { display: "none" });
        },
      });
    }
  }, [open]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
        <div ref={progress} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      </div>

      <header
        ref={bar}
        data-scrolled="false"
        className="group/nav fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500 data-[scrolled=true]:bg-bg/70 data-[scrolled=true]:backdrop-blur-xl"
      >
        <nav className="container-x flex h-[72px] items-center justify-between gap-6" aria-label="Navigation principale">
          <Link href={home} className="group flex items-center gap-3" aria-label={fullName}>
            <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-full bg-ink text-bg">
              <span className="serif-accent text-[1.35rem] leading-none transition-transform duration-500 group-hover:-translate-y-8">A</span>
              <span className="serif-accent absolute translate-y-8 text-[1.35rem] leading-none transition-transform duration-500 group-hover:translate-y-0">A</span>
            </span>
            <span className="text-[0.95rem] font-medium tracking-tight">
              {site.firstName}
              <span className="hidden text-muted sm:inline"> {site.lastName}</span>
              <sup className="ml-0.5 text-[0.6rem] text-muted">®</sup>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group block rounded-full px-4 py-2 text-sm text-ink-2 transition-colors hover:text-ink"
                >
                  <span className="relative block overflow-hidden">
                    <span className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full">
                      {l.label}
                    </span>
                    <span
                      aria-hidden
                      className="absolute left-0 top-full block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full"
                    >
                      {l.label}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={switchLocalePath(locale, basePath)}
              className="rounded-full border border-line px-3 py-2 font-mono text-[0.7rem] tracking-widest text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
              aria-label={dict.nav.switchLocaleLabel}
              hrefLang={locale === "fr" ? "en" : "fr"}
            >
              {dict.nav.switchLocale}
            </a>
            <Magnetic className="hidden sm:inline-block" strength={0.25}>
              <Link
                href={`${home === "/" ? "" : home}/#contact`}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink py-2.5 pl-5 pr-4 text-sm font-medium text-bg"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0" />
                <span className="relative">{dict.nav.cta}</span>
                <ArrowUpRight className="relative size-4 transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="relative z-[70] flex size-11 items-center justify-center rounded-full border border-line lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={dict.nav.menu}
            >
              <span className={cn("absolute h-px w-4 bg-ink transition-transform duration-500", open ? "rotate-45" : "-translate-y-[3px]")} />
              <span className={cn("absolute h-px w-4 bg-ink transition-transform duration-500", open ? "-rotate-45" : "translate-y-[3px]")} />
            </button>
          </div>
        </nav>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        className="fixed inset-0 z-[55] hidden flex-col justify-between bg-bg-2 px-6 pb-10 pt-28 lg:hidden"
        data-lenis-prevent
      >
        <ul className="flex flex-col gap-1">
          {[...links, { href: `${home === "/" ? "" : home}/#contact`, label: dict.nav.contact }].map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <Link
                href={l.href}
                data-menu-item
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 py-1 text-[13vw] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-7xl"
              >
                <span className="font-mono text-xs tracking-widest text-muted">0{i + 1}</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="overflow-hidden">
          <a data-menu-item href={`mailto:${site.email}`} className="block text-lg text-ink-2">
            {site.email}
          </a>
        </div>
      </div>
    </>
  );
}

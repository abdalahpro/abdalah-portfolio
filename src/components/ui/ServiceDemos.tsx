"use client";

import { useEffect, useState } from "react";
import { Check, Plus, ShoppingBag, Star, X } from "lucide-react";
import type { Dict } from "@/i18n";
import { cn } from "@/lib/utils";

/*
 * Mini-démos de la section Services : chacune illustre le service en action
 * (maquettes simplifiées, pas de vraies données). `play` coupe les boucles
 * quand la section n'est pas à l'écran.
 */

type Demo = Dict["services"]["demo"];

/** Index qui avance tout seul (0 → count-1) tant que `play` est vrai. */
function useCycle(count: number, ms: number, play: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => setI((v) => (v + 1) % count), ms);
    return () => clearInterval(id);
  }, [count, ms, play]);
  return i;
}

const pop = "animate-[demo-pop_4.8s_ease-out_infinite]";

/* 01 — L'ordre d'une page qui vend */
export function DemoFlow({ demo, play }: { demo: Demo; play: boolean }) {
  const active = useCycle(demo.flow.length, 900, play);
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="mb-2 flex items-center gap-3 rounded-xl border border-line bg-bg-3/60 px-3 py-2">
        <span className="flex gap-1">
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
        </span>
        <span className="flex-1 truncate rounded-md bg-bg-2 px-2 py-0.5 text-center font-mono text-[0.65rem] text-muted">
          {demo.url}
        </span>
      </div>
      {demo.flow.map((label, i) => {
        const on = i === active;
        const last = i === demo.flow.length - 1;
        return (
          <div
            key={label}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-500",
              on ? "translate-x-2 border-accent/60 bg-accent/10" : "border-line bg-bg-3/60",
              last && on && "bg-accent text-on-accent"
            )}
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[0.65rem]",
                on ? (last ? "bg-on-accent text-accent" : "bg-accent text-on-accent") : "bg-bg-2 text-muted"
              )}
            >
              {last ? <ShoppingBag className="size-3" /> : i + 1}
            </span>
            <span className={cn("text-sm font-medium", !on && "text-ink-2")}>{label}</span>
            <span className={cn("ml-auto h-1.5 rounded-full", on && !last ? "w-16 bg-accent/50" : "w-10 bg-line-strong")} />
          </div>
        );
      })}
    </div>
  );
}

/* 02 — Avis clients */
const ratingBars = [0.86, 0.09, 0.03, 0.01, 0.01];

export function DemoReviews({ demo }: { demo: Demo }) {
  return (
    <div className="flex h-full items-center gap-6">
      <div className="shrink-0">
        <p className="text-5xl font-semibold tracking-[-0.05em]">{demo.rating}</p>
        <div className="mt-2 flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={cn("size-4 fill-accent text-accent", pop)}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">{demo.reviewsNote}</p>
      </div>
      <div className="flex-1 space-y-1.5">
        {ratingBars.map((w, i) => (
          <div key={i} className="flex items-center gap-2 text-[0.65rem] text-muted">
            <span className="w-3 font-mono">{5 - i}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-3">
              <span
                className="block h-full origin-left rounded-full bg-accent animate-[demo-grow-x_4.8s_cubic-bezier(.16,1,.3,1)_infinite]"
                style={{ width: `${Math.max(w * 100, 3)}%`, animationDelay: `${i * 0.1}s` }}
              />
            </span>
          </div>
        ))}
        <p className="pt-1 text-xs text-ink-2">{demo.reviews}</p>
      </div>
    </div>
  );
}

/* 03 — Offre limitée avec compte à rebours */
export function DemoOffer({ demo, play }: { demo: Demo; play: boolean }) {
  const [left, setLeft] = useState(2 * 3600 + 14 * 60 + 59);
  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => setLeft((s) => (s <= 0 ? 2 * 3600 + 14 * 60 + 59 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [play]);
  const parts = [Math.floor(left / 3600), Math.floor((left % 3600) / 60), left % 60].map((n) =>
    String(n).padStart(2, "0")
  );
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">{demo.offer}</p>
      <div className="flex items-center gap-1.5">
        {parts.map((p, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="rounded-lg bg-bg-3 px-2.5 py-2 font-mono text-2xl tabular-nums">{p}</span>
            {i < 2 && <span className="text-muted">:</span>}
          </span>
        ))}
      </div>
      <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-on-accent animate-[demo-pulse_1.6s_ease-in-out_infinite]">
        {demo.bundle}
      </span>
    </div>
  );
}

/* 04 — Comparatif */
export function DemoCompare({ demo }: { demo: Demo }) {
  return (
    <div className="flex h-full flex-col justify-center text-xs">
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-line pb-2 text-muted">
        <span />
        <span className="font-semibold text-accent">{demo.compareUs}</span>
        <span>{demo.compareThem}</span>
      </div>
      {demo.compareRows.map((row, i) => (
        <div key={row} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-line py-2 last:border-0">
          <span className="text-ink-2">{row}</span>
          <span className={cn("flex w-8 justify-center", pop)} style={{ animationDelay: `${0.2 + i * 0.25}s` }}>
            <Check className="size-4 text-accent" />
          </span>
          <span className="flex w-10 justify-center">
            <X className="size-4 text-muted/60" />
          </span>
        </div>
      ))}
    </div>
  );
}

/* 05 — FAQ qui s'ouvre */
export function DemoFaq({ demo, play }: { demo: Demo; play: boolean }) {
  const active = useCycle(demo.faq.length, 2000, play);
  return (
    <div className="flex h-full flex-col justify-center">
      {demo.faq.map((q, i) => {
        const on = i === active;
        return (
          <div key={q} className="border-b border-line last:border-0">
            <div className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <span className={cn("transition-colors", on ? "text-ink" : "text-ink-2")}>{q}</span>
              <Plus className={cn("size-4 shrink-0 transition-transform duration-500", on ? "rotate-45 text-accent" : "text-muted")} />
            </div>
            <div className={cn("grid transition-[grid-template-rows] duration-500", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <p className="overflow-hidden text-xs text-muted">
                <span className="block pb-3">{demo.faqAnswer}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* 06 — Vitesse sur mobile */
export function DemoSpeed({ demo, play }: { demo: Demo; play: boolean }) {
  const [score, setScore] = useState(98);
  useEffect(() => {
    if (!play) return;
    let v = 0;
    let hold = 0;
    const id = setInterval(() => {
      if (v < 98) v = Math.min(98, v + 3);
      else if (++hold > 60) {
        v = 0;
        hold = 0;
      }
      setScore(v);
    }, 40);
    return () => clearInterval(id);
  }, [play]);
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex h-full items-center justify-center gap-6">
      <div className="relative h-36 w-[4.6rem] shrink-0 rounded-[1.1rem] border-2 border-line-strong bg-bg-3 p-1.5">
        <span className="absolute left-1/2 top-1 h-1 w-6 -translate-x-1/2 rounded-full bg-line-strong" />
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-bg-2">
          <span className="block h-full origin-left bg-accent animate-[demo-load_2.6s_ease-out_infinite]" />
        </div>
        <div className="mt-2 space-y-1.5">
          <span className="block h-10 rounded-md bg-accent/20" />
          <span className="block h-1.5 w-3/4 rounded-full bg-line-strong" />
          <span className="block h-1.5 w-1/2 rounded-full bg-line-strong" />
          <span className="block h-3 w-full rounded bg-accent/60" />
        </div>
      </div>
      <div className="text-center">
        <div className="relative size-24">
          <svg viewBox="0 0 80 80" className="size-full -rotate-90">
            <circle cx="40" cy="40" r={r} fill="none" stroke="var(--color-bg-3)" strokeWidth="6" />
            <circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              stroke="var(--color-emerald)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - score / 100)}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold tabular-nums">
            {score}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted">{demo.speed}</p>
      </div>
    </div>
  );
}

/* 07 — Choix du thème */
const themePalettes = [
  ["#f3e9df", "#c9a96e", "#2b2a28"],
  ["#ffffff", "#1f1f1f", "#d6d6d6"],
  ["#10201a", "#2f8f74", "#e7d7b1"],
];

export function DemoThemes({ demo, play }: { demo: Demo; play: boolean }) {
  const active = useCycle(demo.themes.length, 1600, play);
  return (
    <div className="flex h-full items-center justify-center gap-3">
      {demo.themes.map((name, i) => {
        const [bg, main, soft] = themePalettes[i];
        const on = i === active;
        return (
          <div key={name} className={cn("w-1/3 transition-all duration-500", on ? "-translate-y-2" : "opacity-50")}>
            <div
              className={cn("aspect-[3/4] overflow-hidden rounded-xl p-1.5 ring-2 transition-all", on ? "ring-accent" : "ring-transparent")}
              style={{ background: bg }}
            >
              <span className="block h-2/5 rounded-md" style={{ background: main }} />
              <span className="mt-1.5 block h-1.5 w-3/4 rounded-full" style={{ background: soft }} />
              <span className="mt-1 block h-1.5 w-1/2 rounded-full" style={{ background: soft }} />
              <span className="mt-2 block h-2.5 w-2/3 rounded" style={{ background: main }} />
            </div>
            <p className={cn("mt-2 text-center text-xs", on ? "text-ink" : "text-muted")}>{name}</p>
          </div>
        );
      })}
    </div>
  );
}

/* 08 — Gestion et suivi des ventes */
const salesBars = [0.32, 0.45, 0.38, 0.56, 0.5, 0.64, 0.58, 0.72, 0.66, 0.81, 0.77, 0.94];

export function DemoSales({ demo }: { demo: Demo }) {
  return (
    <div className="relative flex h-full flex-col justify-end gap-3">
      <div className="flex items-baseline justify-between">
        <p className="text-xs text-muted">{demo.sales}</p>
        <p className="text-sm font-semibold text-emerald">{demo.growth}</p>
      </div>
      <div className="flex h-28 items-end gap-1.5 sm:gap-2.5">
        {salesBars.map((h, i) => (
          <span
            key={i}
            className="flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-accent/30 to-accent animate-[demo-grow-y_4.8s_cubic-bezier(.16,1,.3,1)_infinite]"
            style={{ height: `${h * 100}%`, animationDelay: `${i * 0.06}s` }}
          />
        ))}
      </div>
      <div className="absolute right-0 top-6 flex items-center gap-2 rounded-xl border border-line bg-bg-3 px-3 py-2 text-xs shadow-lg animate-[demo-toast_4.8s_ease-out_infinite]">
        <span className="flex size-5 items-center justify-center rounded-full bg-emerald text-bg">
          <Check className="size-3" />
        </span>
        {demo.toast}
      </div>
    </div>
  );
}

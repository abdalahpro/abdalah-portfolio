"use client";

import type Lenis from "lenis";
import { useSyncExternalStore } from "react";

/* ---------- Instance Lenis partagée (stop/start depuis le menu, la lightbox…) ---------- */

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  } else {
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }
}

export function scrollToTarget(target: string | number | HTMLElement) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}

/* ---------- Fin de l'intro (preloader) : le hero attend ce signal ---------- */

let introDone = false;
const introListeners = new Set<() => void>();

export function markIntroDone() {
  if (introDone) return;
  introDone = true;
  introListeners.forEach((l) => l());
}

export function useIntroDone() {
  return useSyncExternalStore(
    (cb) => {
      introListeners.add(cb);
      return () => introListeners.delete(cb);
    },
    () => introDone,
    () => false
  );
}

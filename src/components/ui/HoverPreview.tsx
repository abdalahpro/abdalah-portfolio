"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Vignette flottante qui suit le pointeur et montre l'image de la ligne
 * survolée (les images glissent les unes sur les autres). Desktop uniquement.
 */
export function HoverPreview({ images, active }: { images: string[]; active: number | null }) {
  const box = useRef<HTMLDivElement>(null);
  const lastActive = useRef<number | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    gsap.set(el.querySelectorAll("[data-slide]"), { yPercent: (i: number) => (i === 0 ? 0 : 100) });
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const rTo = gsap.quickTo(el, "rotate", { duration: 0.9, ease: "power3.out" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    gsap.to(el, {
      scale: active === null ? 0 : 1,
      autoAlpha: active === null ? 0 : 1,
      duration: 0.6,
      ease: "expo.out",
    });
    if (active !== null) {
      const slides = el.querySelectorAll<HTMLElement>("[data-slide]");
      const from = lastActive.current;
      slides.forEach((s, i) => {
        if (i === active) {
          gsap.fromTo(
            s,
            { yPercent: from === null ? 0 : from < active ? 100 : -100 },
            { yPercent: 0, duration: 0.7, ease: "expo.out", zIndex: 2 }
          );
        } else {
          gsap.set(s, { zIndex: i === from ? 1 : 0 });
        }
      });
      lastActive.current = active;
    } else {
      lastActive.current = null;
    }
  }, [active]);

  return (
    <div
      ref={box}
      aria-hidden
      style={{ transform: "scale(0)" }}
      className="pointer-events-none invisible fixed left-0 top-0 z-40 hidden aspect-[4/5] w-[min(22vw,340px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl opacity-0 shadow-2xl lg:block"
    >
      {images.map((src, i) => (
        <div key={src + i} data-slide className="absolute inset-0">
          <Image src={src} alt="" fill sizes="340px" className="object-cover object-top" />
        </div>
      ))}
    </div>
  );
}

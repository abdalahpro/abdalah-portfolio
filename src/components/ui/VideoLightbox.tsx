"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useDict } from "@/components/providers/I18nProvider";
import type { Reel } from "@/data/reels";
import { gsap } from "@/lib/gsap";
import { lockScroll } from "@/lib/stores";

export function VideoLightbox({ reel, onClose }: { reel: Reel | null; onClose: () => void }) {
  const dict = useDict();
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!reel || !root.current) return;
    lockScroll(true);
    closeBtn.current?.focus();
    gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
    gsap.fromTo(
      root.current.querySelector("[data-lb-frame]"),
      { y: 80, scale: 0.92, rotate: -3 },
      { y: 0, scale: 1, rotate: 0, duration: 1, ease: "expo.out" }
    );
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      lockScroll(false);
    };
  }, [reel, onClose]);

  if (!reel) return null;

  return createPortal(
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={dict.common.play}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-bg/90 p-4 backdrop-blur-xl"
      onClick={onClose}
      data-lenis-prevent
    >
      <button
        ref={closeBtn}
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 flex size-12 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:bg-ink hover:text-bg"
        aria-label={dict.common.close}
      >
        <X className="size-5" />
      </button>
      <div
        data-lb-frame
        onClick={(e) => e.stopPropagation()}
        className="relative aspect-[384/708] h-[min(86vh,820px)] max-w-[92vw] overflow-hidden rounded-[2.2rem] border-[6px] border-bg-3 bg-black shadow-[0_40px_120px_-20px_rgba(201,169,110,0.3)]"
      >
        <video
          key={reel.id}
          src={reel.src}
          poster={reel.poster}
          className="size-full object-cover"
          autoPlay
          playsInline
          controls
          muted
          preload="auto"
        />
      </div>
    </div>,
    document.body
  );
}

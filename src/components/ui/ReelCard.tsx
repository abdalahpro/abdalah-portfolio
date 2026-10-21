"use client";

import Image from "next/image";
import { useRef } from "react";
import { Play } from "lucide-react";
import type { Reel } from "@/data/reels";
import { cn } from "@/lib/utils";

/** Téléphone : affiche l'affiche, lit la boucle muette au survol, ouvre la vidéo au clic. */
export function ReelCard({
  reel,
  caption,
  playLabel,
  onOpen,
  className,
}: {
  reel: Reel;
  caption: string;
  playLabel: string;
  onOpen: (reel: Reel) => void;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);

  const play = () => {
    const v = video.current;
    if (!v) return;
    if (!v.src) v.src = reel.loop;
    v.play().catch(() => {});
  };
  const pause = () => video.current?.pause();

  return (
    <button
      type="button"
      onClick={() => onOpen(reel)}
      onPointerEnter={play}
      onPointerLeave={pause}
      onFocus={play}
      onBlur={pause}
      data-cursor={playLabel}
      aria-label={`${playLabel} — ${caption}`}
      className={cn(
        "group relative block aspect-[384/708] shrink-0 overflow-hidden rounded-[1.6rem] border-[5px] border-bg-3 bg-bg-3 text-left shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-[var(--ease-expo)] hover:-translate-y-2",
        className
      )}
    >
      <Image src={reel.poster} alt="" fill sizes="240px" className="object-cover" />
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <span className="absolute inset-x-0 top-0 mx-auto mt-1.5 h-4 w-16 rounded-full bg-bg-3" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
        <span className="text-sm font-medium leading-tight text-white">{caption}</span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-colors group-hover:bg-accent">
          <Play className="size-3.5 fill-current text-white" />
        </span>
      </span>
    </button>
  );
}

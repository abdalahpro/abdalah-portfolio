"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Titre révélé ligne par ligne (chaque ligne remonte depuis un masque) quand
 * il entre dans l'écran. Re-découpe automatiquement au resize et au
 * chargement des polices.
 */
export function SplitReveal({
  as: Tag = "h2",
  children,
  className,
  delay = 0,
  stagger = 0.09,
  start = "top 85%",
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              rotate: 2,
              duration: 1.3,
              stagger,
              delay,
              ease: "expo.out",
              scrollTrigger: { trigger: ref.current, start, once: true },
            }),
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}

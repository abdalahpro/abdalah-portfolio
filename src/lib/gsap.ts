"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

gsap.defaults({ ease: "expo.out", duration: 1.2 });

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Les animations "décoratives" ne tournent que si l'utilisateur n'a pas
 * demandé à réduire les mouvements. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

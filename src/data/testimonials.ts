import type { Localized } from "@/i18n/types";

export interface Testimonial {
  id: string;
  authorName: string;
  authorRole?: Localized;
  quote: Localized;
  /** Plateforme d'origine du retour, affichée en petit sur la carte. */
  source: "whatsapp" | "instagram" | "email" | "agency" | "google";
  rating?: number;
  /** Capture d'écran du message d'origine (dans public/testimonials/). */
  image?: string;
}

/**
 * Uniquement de VRAIS retours clients adressés à Abdalah (capture à l'appui).
 * Tant que la liste est vide, la section n'apparaît pas sur le site.
 */
export const testimonials: Testimonial[] = [];

import { projects } from "@/data/projects";
import type { Locale } from "@/i18n/types";

/** Version "à plat" d'une boutique, dans une seule langue — c'est ce qui
 * transite vers les composants client (pas les deux langues à la fois). */
export interface ProjectView {
  id: string;
  url: string;
  host: string;
  niche: string;
  year: number;
  accent: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  image: string;
  ringImage: string;
  /** Texte alternatif descriptif (accessibilité + Google Images). */
  alt: string;
}

/** Seuil de qualité visuelle des captures mises en avant sur l'accueil. */
const HIGHLIGHT_MIN_RATING = 7.5;

/**
 * Ordre d'affichage inversé (permutation) par rapport au portfolio d'Erfero,
 * qui classe de la meilleure note à la moins bonne : ici les boutiques qu'il
 * montre en dernier passent en premier.
 */
export function getProjects(locale: Locale): ProjectView[] {
  return [...projects].sort((a, b) => b.rating - a.rating).reverse().map((p) => ({
    id: p.id,
    url: p.url,
    host: new URL(p.url).host.replace(/^www\./, ""),
    niche: p.niche,
    year: p.year,
    accent: p.accent,
    name: p.name,
    tagline: p.tagline[locale],
    description: p.description[locale],
    tags: p.tags[locale],
    image: `/work/${p.id}.webp`,
    ringImage: `/work/ring/${p.id}.webp`,
    alt:
      locale === "fr"
        ? `Boutique Shopify ${p.name} : ${p.tagline.fr}`
        : `${p.name} Shopify store: ${p.tagline.en}`,
  }));
}

/** Boutiques mises en avant sur l'accueil : même ordre inversé, limité aux
 * captures les plus abouties pour ne pas ouvrir sur une boutique plus faible. */
export function getHighlights(list: ProjectView[]) {
  const ratings = new Map(projects.map((p) => [p.id, p.rating]));
  return list.filter((p) => (ratings.get(p.id) ?? 0) >= HIGHLIGHT_MIN_RATING);
}

export function getNicheCounts() {
  const counts = new Map<string, number>();
  for (const p of projects) counts.set(p.niche, (counts.get(p.niche) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

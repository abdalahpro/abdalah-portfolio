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
}

export function getProjects(locale: Locale): ProjectView[] {
  return [...projects].sort((a, b) => b.rating - a.rating).map((p) => ({
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
  }));
}

export function getNicheCounts() {
  const counts = new Map<string, number>();
  for (const p of projects) counts.set(p.niche, (counts.get(p.niche) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

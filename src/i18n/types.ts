export type Locale = "fr" | "en";

export const locales: Locale[] = ["fr", "en"];

export interface Localized {
  fr: string;
  en: string;
}

/** "/realisations" → "/realisations" (fr) ou "/en/realisations" (en). */
export function localePath(locale: Locale, path = "/") {
  if (locale === "fr") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

/** Même page dans l'autre langue. */
export function switchLocalePath(locale: Locale, path = "/") {
  return localePath(locale === "fr" ? "en" : "fr", path);
}

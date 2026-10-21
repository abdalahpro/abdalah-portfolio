import fr, { type Dict } from "./fr";
import en from "./en";
import type { Locale } from "./types";

const dictionaries: Record<Locale, Dict> = { fr, en };

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale];
}

export type { Dict };

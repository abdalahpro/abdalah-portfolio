"use client";

import { createContext, use, type ReactNode } from "react";
import type { Dict } from "@/i18n";
import type { Locale } from "@/i18n/types";

const DictContext = createContext<Dict | null>(null);

export function I18nProvider({ dict, children }: { dict: Dict; children: ReactNode }) {
  return <DictContext value={dict}>{children}</DictContext>;
}

export function useDict() {
  const dict = use(DictContext);
  if (!dict) throw new Error("useDict must be used inside <I18nProvider>");
  return dict;
}

export function useLocale() {
  return useDict().locale as Locale;
}

import type { Metadata } from "next";
import { fullName, site } from "@/data/site";
import { getDictionary } from "@/i18n";
import { localePath, type Locale } from "@/i18n/types";

export function buildMetadata(
  locale: Locale,
  { title, description, path = "/" }: { title?: string; description?: string; path?: string } = {}
): Metadata {
  const dict = getDictionary(locale);
  const t = title ?? dict.meta.title;
  const d = description ?? dict.meta.description;
  const url = localePath(locale, path);

  return {
    metadataBase: new URL(site.url),
    title: t,
    description: d,
    authors: [{ name: fullName, url: site.url }],
    creator: fullName,
    alternates: {
      canonical: url,
      languages: { fr: localePath("fr", path), en: localePath("en", path), "x-default": localePath("fr", path) },
    },
    openGraph: {
      type: "website",
      url,
      siteName: fullName,
      title: t,
      description: d,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
    twitter: { card: "summary_large_image", title: t, description: d },
    robots: { index: true, follow: true },
  };
}

export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName,
    jobTitle: site.roleLong[locale],
    email: `mailto:${site.email}`,
    url: site.url,
    sameAs: Object.values(site.socials).filter(Boolean),
    knowsAbout: ["Shopify", "Liquid", "E-commerce", "CRO", "SEO", "React", "Next.js"],
  };
}

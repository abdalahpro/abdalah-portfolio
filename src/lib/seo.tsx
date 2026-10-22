import type { Metadata, Viewport } from "next";
import { fullName, site } from "@/data/site";
import { getDictionary } from "@/i18n";
import { localePath, type Locale } from "@/i18n/types";
import type { ProjectView } from "@/lib/projects";

export const viewport: Viewport = {
  themeColor: "#0b1310",
  colorScheme: "dark",
};

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
    applicationName: fullName,
    authors: [{ name: fullName, url: site.url }],
    creator: fullName,
    publisher: fullName,
    category: "technology",
    keywords:
      locale === "fr"
        ? ["développeur Shopify", "développeur Shopify freelance", "création boutique Shopify", "expert Shopify", "refonte boutique Shopify", "SEO Shopify", fullName]
        : ["Shopify developer", "freelance Shopify developer", "Shopify store design", "Shopify expert", "Shopify redesign", "Shopify SEO", fullName],
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
      alternateLocale: locale === "fr" ? ["en_US"] : ["fr_FR"],
    },
    twitter: { card: "summary_large_image", title: t, description: d },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

/* ---------- Données structurées (schema.org) ---------- */

const PERSON_ID = `${site.url}/#person`;
const WEBSITE_ID = `${site.url}/#website`;

function person(locale: Locale) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: fullName,
    givenName: site.firstName,
    familyName: site.lastName,
    jobTitle: site.roleLong[locale],
    email: `mailto:${site.email}`,
    telephone: site.phoneNumber ? `+${site.phoneNumber}` : undefined,
    url: site.url,
    sameAs: Object.values(site.socials).filter(Boolean),
    knowsAbout: ["Shopify", "Liquid", "E-commerce", "SEO", "Conversion rate optimization", "React", "Next.js", "WordPress"],
    knowsLanguage: ["fr", "en"],
  };
}

function breadcrumb(locale: Locale, items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${localePath(locale, it.path)}`,
    })),
  };
}

/** Accueil : site, personne, service proposé et FAQ (réponses visibles dans Google). */
export function homeJsonLd(locale: Locale) {
  const dict = getDictionary(locale);
  const fr = locale === "fr";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: site.url,
        name: fullName,
        description: dict.meta.description,
        inLanguage: locale,
        publisher: { "@id": PERSON_ID },
      },
      person(locale),
      {
        "@type": "Service",
        "@id": `${site.url}/#service`,
        name: fr ? "Création de boutique Shopify" : "Shopify store design and development",
        serviceType: fr
          ? ["Création de boutique Shopify", "Refonte de boutique Shopify", "SEO Shopify", "Gestion de boutique Shopify"]
          : ["Shopify store design", "Shopify store redesign", "Shopify SEO", "Shopify store management"],
        description: dict.meta.description,
        provider: { "@id": PERSON_ID },
        areaServed: { "@type": "Place", name: fr ? "Monde entier" : "Worldwide" },
        availableLanguage: ["French", "English"],
        url: `${site.url}${localePath(locale, "/")}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: dict.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

/** Page Réalisations : fil d'Ariane + liste des boutiques. */
export function workJsonLd(locale: Locale, projects: ProjectView[]) {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumb(locale, [
        { name: fullName, path: "/" },
        { name: dict.workPage.title, path: "/realisations" },
      ]),
      {
        "@type": "ItemList",
        name: dict.workPage.title,
        numberOfItems: projects.length,
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: p.name,
            description: p.description,
            url: p.url,
            image: `${site.url}${p.image}`,
            creator: { "@id": PERSON_ID },
          },
        })),
      },
    ],
  };
}

/** Page CV : page de profil de la personne. */
export function cvJsonLd(locale: Locale) {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumb(locale, [
        { name: fullName, path: "/" },
        { name: dict.nav.cv, path: "/cv" },
      ]),
      { "@type": "ProfilePage", mainEntity: person(locale), url: `${site.url}${localePath(locale, "/cv")}` },
    ],
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

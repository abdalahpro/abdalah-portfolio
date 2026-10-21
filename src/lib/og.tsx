import { ImageResponse } from "next/og";
import { fullName, site } from "@/data/site";
import type { Locale } from "@/i18n/types";

export const ogSize = { width: 1200, height: 630 };

/** Image de partage (liens LinkedIn, WhatsApp…) générée au build. */
export function renderOgImage(locale: Locale) {
  const tagline =
    locale === "fr" ? "Votre boutique Shopify, taillée pour déclencher l'achat." : "Your Shopify store, engineered to spark the sale.";
  const meta = locale === "fr"
      ? `${site.metrics.storesLaunched}+ boutiques livrées · ${site.metrics.yearsExperience} ans d'expérience`
      : `${site.metrics.storesLaunched}+ stores delivered · ${site.metrics.yearsExperience} years of experience`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0b1310",
          color: "#eee9dd",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -160,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(circle at 40% 40%, #f1e2bd 0%, #c9a96e 26%, #1e6b57 50%, rgba(30,107,87,0) 72%)",
            opacity: 0.85,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, color: "#c5c0b2" }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: "#c9a96e" }} />
          {site.role[locale]} · Freelance
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>{fullName}</div>
          <div style={{ fontSize: 44, marginTop: 24, color: "#e7d7b1", maxWidth: 900, lineHeight: 1.15 }}>{tagline}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#8b958e" }}>
          <span>{meta}</span>
          <span>{new URL(site.url).host}</span>
        </div>
      </div>
    ),
    ogSize
  );
}

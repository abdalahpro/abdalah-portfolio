import { ImageResponse } from "next/og";
import { fullName, site } from "@/data/site";
import type { Locale } from "@/i18n/types";

export const ogSize = { width: 1200, height: 630 };

/** Image de partage (liens LinkedIn, WhatsApp…) générée au build. */
export function renderOgImage(locale: Locale) {
  const tagline =
    locale === "fr" ? "Des boutiques Shopify qui donnent envie d'acheter." : "Shopify stores people want to buy from.";
  const meta = locale === "fr" ? "200+ boutiques livrées · 5 ans d'expérience" : "200+ stores delivered · 5 years of experience";

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
          background: "#09090b",
          color: "#f3f0ea",
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
            background: "radial-gradient(circle at 40% 40%, #ffc4a3 0%, #ff4d1c 30%, rgba(255,77,28,0) 70%)",
            opacity: 0.85,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, color: "#c9c5be" }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: "#ff4d1c" }} />
          {site.role[locale]} · Freelance
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>{fullName}</div>
          <div style={{ fontSize: 44, marginTop: 24, color: "#ffb38a", maxWidth: 900, lineHeight: 1.15 }}>{tagline}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#8d8982" }}>
          <span>{meta}</span>
          <span>{new URL(site.url).host}</span>
        </div>
      </div>
    ),
    ogSize
  );
}

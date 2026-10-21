import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "404 — Page introuvable",
  description: "Cette page n'existe pas ou a été déplacée.",
};

export default function GlobalNotFound() {
  return (
    <html lang="fr" className={fontVariables}>
      <body className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center font-sans text-ink">
        <p className="eyebrow mb-6">Erreur 404</p>
        <h1 className="text-display text-[clamp(6rem,24vw,18rem)]">
          4<span className="serif-accent text-accent">0</span>4
        </h1>
        <p className="mt-6 max-w-md text-ink-2">
          Cette page n&apos;existe pas ou a été déplacée. — This page doesn&apos;t exist or has moved.
        </p>
        <div className="mt-10 flex gap-3">
          <Link href="/" className="rounded-full bg-accent px-6 py-3 font-medium text-[#120703]">
            Accueil
          </Link>
          <Link href="/en" className="rounded-full border border-line-strong px-6 py-3">
            Home
          </Link>
        </div>
      </body>
    </html>
  );
}

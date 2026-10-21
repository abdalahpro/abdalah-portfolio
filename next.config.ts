import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Deux layouts racine (FR sur "/", EN sur "/en") : la 404 globale ne peut
    // pas se composer depuis un layout unique, voir app/global-not-found.tsx.
    globalNotFound: true,
  },
  images: {
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

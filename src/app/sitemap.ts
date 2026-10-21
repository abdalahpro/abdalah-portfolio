import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { localePath } from "@/i18n/types";

const paths = ["/", "/realisations", "/cv"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${site.url}${localePath("fr", path)}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
    alternates: {
      languages: {
        fr: `${site.url}${localePath("fr", path)}`,
        en: `${site.url}${localePath("en", path)}`,
      },
    },
  }));
}

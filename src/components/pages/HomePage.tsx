import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Preloader } from "@/components/layout/Preloader";
import { Catalog } from "@/components/sections/Catalog";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Metrics } from "@/components/sections/Metrics";
import { PainPoints } from "@/components/sections/PainPoints";
import { Process } from "@/components/sections/Process";
import { Reels } from "@/components/sections/Reels";
import { Services } from "@/components/sections/Services";
import { StoresRing } from "@/components/sections/StoresRing";
import { TechStack } from "@/components/sections/TechStack";
import { Testimonials } from "@/components/sections/Testimonials";
import { Trust } from "@/components/sections/Trust";
import { VelocityMarquee } from "@/components/sections/VelocityMarquee";
import { Work } from "@/components/sections/Work";
import type { Locale } from "@/i18n/types";
import { getHighlights, getNicheCounts, getProjects } from "@/lib/projects";
import { personJsonLd } from "@/lib/seo";

export function HomePage({ locale }: { locale: Locale }) {
  const projects = getProjects(locale);
  const highlights = getHighlights(projects);
  const featured = highlights.slice(0, 10);
  const ringImages = highlights.slice(0, 16).map((p) => p.ringImage);
  const serviceImages = highlights.slice(10, 18).map((p) => p.image);
  const niches = getNicheCounts().map(([niche, count]) => ({
    niche,
    count,
    image: projects.find((p) => p.niche === niche)!.image,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}
      />
      <Preloader />
      <Nav />
      <main id="main">
        <Hero />
        <VelocityMarquee />
        <PainPoints />
        <Work projects={featured} total={projects.length} />
        <StoresRing images={ringImages} />
        <Services images={serviceImages} />
        <Metrics />
        <Process />
        <Reels />
        <Catalog niches={niches} />
        <TechStack />
        <Trust />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

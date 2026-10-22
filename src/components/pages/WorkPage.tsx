import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { ReelWall } from "@/components/sections/ReelWall";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/types";
import { getNicheCounts, getProjects } from "@/lib/projects";
import { JsonLd, workJsonLd } from "@/lib/seo";

export function WorkPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const projects = getProjects(locale);
  const niches = getNicheCounts().map(([niche, count]) => ({ niche, count }));

  return (
    <>
      <JsonLd data={workJsonLd(locale, projects)} />
      <Nav />
      <main id="main">
        <header className="container-x pb-16 pt-36 sm:pb-24 sm:pt-48">
          <p className="eyebrow mb-8">
            <span className="h-px w-8 bg-accent" />
            {dict.workPage.eyebrow}
          </p>
          <SplitReveal as="h1" className="text-display text-[clamp(3.2rem,11vw,13rem)]" start="top 100%">
            {dict.workPage.title}
            <sup className="serif-accent ml-2 align-super text-[0.3em] text-accent">({projects.length})</sup>
          </SplitReveal>
          <p className="mt-8 max-w-xl text-ink-2 sm:text-lg">{dict.workPage.subtitle}</p>
        </header>
        <WorkGrid projects={projects} niches={niches} />
        <ReelWall />
      </main>
      <Footer />
    </>
  );
}

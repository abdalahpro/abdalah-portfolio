import Link from "next/link";
import { ArrowLeft, Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { PrintButton } from "@/components/ui/PrintButton";
import { cvName, phoneHref, site, whatsappUrl } from "@/data/site";
import { getDictionary } from "@/i18n";
import { localePath, switchLocalePath, type Locale } from "@/i18n/types";
import { getProjects } from "@/lib/projects";
import { splitBold } from "@/lib/utils";

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-[#c2380f]">
      <span className="h-px w-4 bg-[#c2380f]" />
      {children}
    </h2>
  );
}

export function CvPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const cv = dict.cvPage;
  const projects = getProjects(locale).slice(0, 8);
  const siteHost = new URL(site.url).host;

  const contacts = [
    { icon: <Mail className="size-3" />, value: site.email, href: `mailto:${site.email}` },
    phoneHref && { icon: <Phone className="size-3" />, value: `+${site.phoneNumber}`, href: phoneHref },
    whatsappUrl && { icon: <MessageCircle className="size-3" />, value: `WhatsApp +${site.whatsappNumber}`, href: whatsappUrl },
    { icon: <Globe className="size-3" />, value: siteHost, href: site.url },
    { icon: <BrandIcon name="github" className="size-3" />, value: site.socials.github.replace("https://", ""), href: site.socials.github },
    site.socials.linkedin && {
      icon: <BrandIcon name="linkedin" className="size-3" />,
      value: site.socials.linkedin.replace(/^https:\/\/(www\.)?/, ""),
      href: site.socials.linkedin,
    },
    { icon: <MapPin className="size-3" />, value: site.location[locale], href: "" },
  ].filter(Boolean) as { icon: React.ReactNode; value: string; href: string }[];

  return (
    <main id="main" className="min-h-screen bg-bg-2 py-6 sm:py-12">
      <div className="no-print container-x mb-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 !px-0 sm:mb-8">
        <Link
          href={localePath(locale, "/")}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-3 text-sm text-ink-2 transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          {cv.back}
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={switchLocalePath(locale, "/cv")}
            className="rounded-full border border-line px-4 py-3 font-mono text-xs tracking-widest text-ink-2 hover:text-ink"
          >
            {dict.nav.switchLocale}
          </a>
          <PrintButton label={cv.print} />
        </div>
      </div>

      <article className="print-sheet mx-auto w-full max-w-[210mm] overflow-hidden bg-paper text-paper-ink shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] sm:rounded-lg">
        <header className="relative overflow-hidden bg-paper-ink px-8 py-9 text-paper sm:px-12">
          <div aria-hidden className="absolute -right-16 -top-24 size-72 rounded-full bg-[radial-gradient(circle,#ff4d1c_0%,rgba(255,77,28,0)_65%)] opacity-60" />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#ffb38a]">Curriculum Vitae</p>
              <h1 className="mt-2 text-[40px] font-semibold leading-none tracking-[-0.04em]">{cvName}</h1>
              <p className="serif-accent mt-2 text-[22px] text-[#ffb38a]">{site.roleLong[locale]}</p>
            </div>
            <dl className="grid grid-cols-3 gap-5 text-right">
              {cv.stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block text-[22px] font-semibold leading-none tracking-[-0.03em]">{s.value}</span>
                    <span className="mt-1 block text-[9px] uppercase tracking-[0.12em] text-[#c9c5be]">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <div className="grid gap-8 px-8 py-9 text-[11.5px] leading-relaxed sm:grid-cols-[1fr_200px] sm:px-12">
          <div className="space-y-7">
            <section>
              <Heading>{cv.profileEyebrow}</Heading>
              <p className="text-[12.5px] leading-relaxed text-[#2a2930]">
                {splitBold(cv.profile).map((part, i) =>
                  part.bold ? (
                    <strong key={i} className="font-semibold text-paper-ink">
                      {part.text}
                    </strong>
                  ) : (
                    <span key={i}>{part.text}</span>
                  )
                )}
              </p>
            </section>

            <section>
              <Heading>{cv.experienceEyebrow}</Heading>
              <div className="space-y-5">
                {cv.experience.map((x) => (
                  <div key={x.title + x.company}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h3 className="text-[13.5px] font-semibold tracking-[-0.01em]">{x.title}</h3>
                      {x.period && <span className="font-mono text-[9.5px] text-[#6b6872]">{x.period}</span>}
                    </div>
                    <p className="text-[11px] font-medium text-[#c2380f]">{x.company}</p>
                    <ul className="mt-2 space-y-1 text-[#3a3940]">
                      {x.bullets.map((b) => (
                        <li key={b} className="relative pl-3.5 before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-[#c2380f]">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {cv.education.length > 0 && (
              <section>
                <Heading>{cv.educationEyebrow}</Heading>
                <div className="space-y-3">
                  {cv.education.map((e) => (
                    <div key={e.title}>
                      <h3 className="text-[13px] font-semibold">{e.title}</h3>
                      <p className="text-[#3a3940]">{e.school}</p>
                      <p className="font-mono text-[9.5px] text-[#6b6872]">{e.period}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <Heading>{cv.selectedWorkEyebrow}</Heading>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                {projects.map((p) => (
                  <li key={p.id} className="flex items-baseline justify-between gap-2 border-b border-[#e6e1d8] pb-1.5">
                    <span className="font-medium">{p.name}</span>
                    <span className="truncate font-mono text-[9px] text-[#6b6872]">{p.host}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-7 sm:border-l sm:border-[#e6e1d8] sm:pl-7">
            <section>
              <Heading>{cv.contactLabel}</Heading>
              <ul className="space-y-2 text-[10.5px]">
                {contacts.map((c) => (
                  <li key={c.value} className="flex items-start gap-2 [overflow-wrap:anywhere]">
                    <span className="mt-0.5 text-[#c2380f]">{c.icon}</span>
                    {c.href ? (
                      <a href={c.href} className="hover:underline">
                        {c.value}
                      </a>
                    ) : (
                      <span>{c.value}</span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[10px] text-[#6b6872]">
                <span className="font-semibold text-paper-ink">{cv.mobilityLabel} :</span> {cv.mobility}
              </p>
            </section>

            <section>
              <Heading>{cv.skillsEyebrow}</Heading>
              <div className="space-y-4">
                {cv.skillGroups.map((g) => (
                  <div key={g.title}>
                    <h3 className="mb-1.5 text-[10.5px] font-semibold">{g.title}</h3>
                    <ul className="flex flex-wrap gap-1">
                      {g.items.map((s) => (
                        <li
                          key={s.name}
                          className={
                            "highlight" in s && s.highlight
                              ? "rounded-full bg-paper-ink px-2 py-0.5 text-[9.5px] text-paper"
                              : "rounded-full border border-[#d9d3c8] px-2 py-0.5 text-[9.5px]"
                          }
                        >
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {cv.languages.length > 0 && (
              <section>
                <Heading>{cv.languagesEyebrow}</Heading>
                <ul className="space-y-1">
                  {cv.languages.map((l) => (
                    <li key={l.name} className="flex justify-between gap-2">
                      <span className="font-medium">{l.name}</span>
                      <span className="text-[#6b6872]">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <Heading>{cv.strengthsEyebrow}</Heading>
              <ul className="space-y-1 text-[#3a3940]">
                {cv.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}

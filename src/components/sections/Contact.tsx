"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, LoaderCircle, Mail, Phone } from "lucide-react";
import { useDict } from "@/components/providers/I18nProvider";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { phoneHref, site, whatsappUrl } from "@/data/site";

type Status = "idle" | "sending" | "success" | "error";

export function Contact() {
  const dict = useDict();
  const c = dict.contact;
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  const channels = [
    { href: `mailto:${site.email}`, label: c.emailCta, sub: site.email, icon: <Mail className="size-5" /> },
    whatsappUrl && { href: whatsappUrl, label: c.whatsappCta, sub: site.whatsappLabel, icon: <BrandIcon name="whatsapp" className="size-5" /> },
    phoneHref && { href: phoneHref, label: c.phoneCta, sub: site.phoneLabel, icon: <Phone className="size-5" /> },
    site.calendlyUrl && { href: site.calendlyUrl, label: c.calendlyCta, sub: "Calendly · 30 min", icon: <BrandIcon name="calendly" className="size-5" /> },
  ].filter(Boolean) as { href: string; label: string; sub: string; icon: React.ReactNode }[];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Sans Formspree configuré : on ouvre le client mail pré-rempli.
    if (!site.formspreeId) {
      const body = `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})${
        data.get("budget") ? `\nBudget : ${data.get("budget")}` : ""
      }`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Projet Shopify — ${data.get("name")}`)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const field =
    "w-full border-b border-line-strong bg-transparent py-4 text-lg text-ink placeholder:text-muted outline-none transition-colors focus:border-accent";

  return (
    <section id="contact" className="relative overflow-hidden py-28 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20vw] top-0 size-[70vw] rounded-full bg-[radial-gradient(circle,rgba(47,143,116,0.22),transparent_60%)] blur-3xl"
      />
      <div className="container-x relative">
        <p className="eyebrow mb-8">
          <span className="size-2 animate-pulse-dot rounded-full bg-accent" />
          {dict.common.available}
        </p>
        <SplitReveal as="h2" className="text-display text-[clamp(3.2rem,10vw,12rem)]" stagger={0.12}>
          {c.titleLine1}
          <br />
          <span className="serif-accent text-accent-2">{c.titleLine2}</span>
        </SplitReveal>

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p data-reveal className="max-w-md text-ink-2 sm:text-lg">
              {c.subtitle}
            </p>

            <div data-reveal className="mt-10">
              <Magnetic strength={0.4}>
                <a
                  href={`mailto:${site.email}`}
                  data-cursor="Mail"
                  className="group relative flex size-40 items-center justify-center overflow-hidden rounded-full bg-accent text-center text-on-accent sm:size-48"
                >
                  <span className="absolute inset-0 scale-0 rounded-full bg-ink transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-100" />
                  <span className="relative flex flex-col items-center gap-2 font-medium">
                    <ArrowUpRight className="size-7 transition-transform duration-500 group-hover:rotate-45" />
                    {c.emailCta}
                  </span>
                </a>
              </Magnetic>
            </div>

            <ul className="mt-12 space-y-3">
              {channels.map((ch) => (
                <li key={ch.href} data-reveal>
                  <a
                    href={ch.href}
                    target={ch.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-bg-2 p-5 transition-colors hover:border-line-strong"
                  >
                    <span className="flex items-center gap-4">
                      <span className="flex size-11 items-center justify-center rounded-full bg-bg-3 text-accent">{ch.icon}</span>
                      <span>
                        <span className="block font-medium">{ch.label}</span>
                        <span className="block text-sm text-muted">{ch.sub}</span>
                      </span>
                    </span>
                    <ArrowUpRight className="size-5 text-muted transition-all duration-500 group-hover:rotate-45 group-hover:text-ink" />
                  </a>
                </li>
              ))}
              <li data-reveal>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 px-1 py-2 font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
                >
                  {copied ? <Check className="size-3.5 text-accent" /> : <Copy className="size-3.5" />}
                  {copied ? c.copied : `${c.copy} ${site.email}`}
                </button>
              </li>
            </ul>
          </Reveal>

          <form onSubmit={onSubmit} className="space-y-2 lg:col-span-6 lg:col-start-7">
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-8">
              <label className="block">
                <span className="sr-only">{c.formName}</span>
                <input name="name" required autoComplete="name" placeholder={c.formName} className={field} />
              </label>
              <label className="block">
                <span className="sr-only">{c.formEmail}</span>
                <input name="email" type="email" required autoComplete="email" placeholder={c.formEmail} className={field} />
              </label>
            </div>
            <label className="block">
              <span className="sr-only">{c.formBudget}</span>
              <input name="budget" placeholder={c.formBudget} className={field} />
            </label>
            <label className="block">
              <span className="sr-only">{c.formMessage}</span>
              <textarea name="message" required rows={5} placeholder={c.formMessage} className={`${field} resize-none`} />
            </label>
            <div className="flex flex-wrap items-center gap-6 pt-8">
              <button
                type="submit"
                disabled={status === "sending"}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-line-strong py-4 pl-7 pr-5 font-medium transition-colors hover:border-ink disabled:opacity-60"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-500 group-hover:text-bg">
                  {status === "sending" ? c.formSending : c.formSubmit}
                </span>
                {status === "sending" ? (
                  <LoaderCircle className="relative size-4 animate-spin" />
                ) : (
                  <ArrowUpRight className="relative size-4 transition-all duration-500 group-hover:rotate-45 group-hover:text-bg" />
                )}
              </button>
              <p role="status" className="text-sm">
                {status === "success" && <span className="text-accent-2">{c.formSuccess}</span>}
                {status === "error" && <span className="text-accent">{c.formError}</span>}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

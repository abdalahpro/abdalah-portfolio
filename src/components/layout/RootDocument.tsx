import "@/app/globals.css";
import type { ReactNode } from "react";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/types";
import { fontVariables } from "@/lib/fonts";

/* Exécuté avant le premier rendu : évite le flash du hero avant l'animation et
   masque le préchargeur s'il a déjà été vu pendant cette session. */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('ab-intro'))d.classList.add('intro-seen')}catch(e){}})();`;

export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dict = getDictionary(locale);
  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <body className="bg-bg font-sans text-ink antialiased">
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <I18nProvider dict={dict}>
          <a
            href="#main"
            className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-ink px-4 py-2 text-sm text-bg transition-transform focus:translate-y-0"
          >
            {dict.common.skipToContent}
          </a>
          <SmoothScroll>{children}</SmoothScroll>
          <Cursor />
          <div className="grain" aria-hidden />
        </I18nProvider>
      </body>
    </html>
  );
}

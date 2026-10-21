/**
 * Infos personnelles d'Abdalah — c'est LE fichier à compléter en premier.
 * Un champ laissé vide ("") masque automatiquement le bouton ou la ligne
 * correspondante sur le site et dans le CV (rien ne casse).
 */
export const site = {
  firstName: "Abdalah",
  lastName: "Adoï",
  role: { fr: "Développeur Shopify", en: "Shopify Developer" },
  roleLong: {
    fr: "Développeur Shopify & Web FullStack",
    en: "Shopify & Full-Stack Web Developer",
  },
  url: "https://abdalah-portfolio.vercel.app",
  /** Année affichée dans le pied de page (le site est pré-rendu, donc figé). */
  copyrightYear: 2026,
  email: "abdalahprox@gmail.com",
  // TODO(abdalah): numéros au format international, sans espaces ni "+".
  // Ex. "22912345678" → WhatsApp wa.me/22912345678 et appel tel:+22912345678.
  whatsappNumber: "",
  phoneNumber: "",
  // TODO(abdalah): lien Calendly (ou Cal.com) pour l'appel découverte.
  calendlyUrl: "",
  location: {
    fr: "À distance, partout dans le monde",
    en: "Remote, worldwide",
  },
  socials: {
    github: "https://github.com/abdalahpro",
    // TODO(abdalah): ajoute les URLs quand elles existent.
    linkedin: "",
    instagram: "",
    malt: "",
    upwork: "",
    fiverr: "",
  },
  /** Formspree (formulaire de contact). Sans ID, le formulaire ouvre l'email. */
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "",
  // TODO(abdalah): vérifie que ces chiffres correspondent à TON parcours.
  metrics: {
    yearsExperience: 5,
    storesLaunched: 200,
    avgDeliveryDays: 3,
  },
};

export const fullName = [site.firstName, site.lastName].filter(Boolean).join(" ");

/** Convention CV française : NOM en capitales. */
export const cvName = [site.firstName, site.lastName.toUpperCase()].filter(Boolean).join(" ");

export const whatsappUrl = site.whatsappNumber
  ? `https://wa.me/${site.whatsappNumber}`
  : "";

export const phoneHref = site.phoneNumber ? `tel:+${site.phoneNumber}` : "";

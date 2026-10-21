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
  // Numéros au format international, sans espaces ni "+".
  whatsappNumber: "22969272595",
  phoneNumber: "2290169272595",
  // Mêmes numéros, mis en forme pour l'affichage.
  whatsappLabel: "+229 69 27 25 95",
  phoneLabel: "+229 01 69 27 25 95",
  // Pas de Calendly pour l'instant : le bouton "Réserver un appel" est masqué.
  calendlyUrl: "",
  location: {
    fr: "À distance, partout dans le monde",
    en: "Remote, worldwide",
  },
  socials: {
    github: "https://github.com/abdalahpro",
    // Laissés vides volontairement pour l'instant (boutons masqués).
    linkedin: "",
    instagram: "",
    malt: "",
    upwork: "",
    fiverr: "",
  },
  /** Formspree (formulaire de contact). Sans ID, le formulaire ouvre l'email. */
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "",
  metrics: {
    yearsExperience: 4,
    storesLaunched: 165,
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

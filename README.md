# Portfolio immersif — Abdalah ADOÏ

Portfolio et CV d'**Abdalah ADOÏ**, développeur Shopify freelance.
Site bilingue (FR sur `/`, EN sur `/en`), entièrement statique, pensé pour Vercel.

**Stack :** Next.js 16 (App Router, Turbopack, Cache Components) · React 19 · TypeScript · Tailwind CSS v4 · Three.js via React Three Fiber (shaders GLSL) · GSAP 3 (ScrollTrigger, SplitText) · Lenis (smooth scroll).

## Ce qui rend le site « immersif »

| Effet | Où | Fichier |
| --- | --- | --- |
| Préchargeur (compteur 0→100, rideau) | Accueil, 1 fois par session | `src/components/layout/Preloader.tsx` |
| Sphère liquide WebGL (bruit simplex, liseré iridescent, suit la souris et le scroll) | Hero | `src/components/three/HeroScene.tsx` |
| Bandeau géant qui accélère et s'incline avec la vitesse de scroll | Sous le hero | `src/components/sections/VelocityMarquee.tsx` |
| Manifeste révélé mot à mot + cartes empilées | « Vous vous reconnaissez ? » | `src/components/sections/PainPoints.tsx` |
| Galerie horizontale épinglée, captures qui défilent au survol | Projets | `src/components/sections/Work.tsx` |
| Anneau 3D de boutiques piloté par le scroll (courbure + décalage RGB selon la vitesse) | « 165+ » | `src/components/three/RingScene.tsx` |
| Aperçu d'image qui suit le curseur | Expertise, secteurs | `src/components/ui/HoverPreview.tsx` |
| Vidéos verticales en défilement, lecture au survol, lecteur plein écran | En coulisses | `src/components/sections/Reels.tsx` |
| Curseur personnalisé, boutons magnétiques, halo lumineux | Partout | `src/components/ui/` |

Tout respecte `prefers-reduced-motion` : les animations décoratives sont coupées pour les personnes qui le demandent. Le rendu WebGL se met en pause quand il n'est pas à l'écran.

## Lancer en local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production (à lancer avant chaque mise en ligne)
```

## Modifier le contenu

| Quoi | Fichier |
| --- | --- |
| Nom, email, WhatsApp, Calendly, réseaux, chiffres | `src/data/site.ts` (**à compléter en premier**) |
| Tous les textes du site et du CV (FR / EN) | `src/i18n/fr.ts` et `src/i18n/en.ts` |
| Boutiques (URL, univers, descriptions) | `src/data/projects.ts` |
| Vidéos « En coulisses » | `src/data/reels.ts` + fichiers dans `public/reels/` |
| Témoignages clients (section masquée tant que la liste est vide) | `src/data/testimonials.ts` |

Un champ vide dans `site.ts` (WhatsApp, téléphone, LinkedIn…) masque automatiquement le bouton correspondant, sur le site comme dans le CV.

### Ajouter une boutique

1. Capture pleine page en `1350 × 2100` px environ → `public/work/<id>.webp`.
2. Version texture 3D en `640 × 860` px → `public/work/ring/<id>.webp`.
3. Ajoute une entrée dans `src/data/projects.ts` (la `rating` sur 10 décide de l'ordre d'affichage).

## Formulaire de contact

Sans configuration, le formulaire ouvre le logiciel de mail avec le message pré-rempli.
Pour recevoir les messages directement : crée un formulaire gratuit sur [formspree.io](https://formspree.io), puis ajoute la variable `NEXT_PUBLIC_FORMSPREE_ID` (voir `.env.example`) en local et dans Vercel.

## Le CV

Page `/cv` (et `/en/cv`) au format A4 : bouton **Imprimer / Enregistrer en PDF** pour obtenir un PDF propre à joindre aux candidatures.

## Mise en ligne sur Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → importer ce dépôt GitHub.
2. Garder les réglages par défaut (Next.js est détecté) et déployer.
3. Si l'URL finale diffère de `abdalah-portfolio.vercel.app`, mettre à jour `url` dans `src/data/site.ts` (SEO, sitemap, image de partage).

Chaque `git push` redéploie automatiquement le site.

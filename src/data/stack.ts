import {
  siFirebase,
  siLaravel,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siReact,
  siShopify,
  siTailwindcss,
  siVuedotjs,
  siGooglesearchconsole,
  siJavascript,
} from "simple-icons";

export interface StackItem {
  name: string;
  path: string;
  hex: string;
}

const icon = (name: string, si: { path: string; hex: string }): StackItem => ({
  name,
  path: si.path,
  hex: `#${si.hex}`,
});

export const stack: StackItem[] = [
  icon("Shopify", siShopify),
  // Liquid n'a pas d'icône officielle : on réutilise le sac Shopify.
  icon("Liquid", siShopify),
  icon("JavaScript", siJavascript),
  icon("React", siReact),
  icon("Next.js", siNextdotjs),
  icon("Vue.js", siVuedotjs),
  icon("Tailwind CSS", siTailwindcss),
  icon("Node.js", siNodedotjs),
  icon("Laravel", siLaravel),
  icon("PHP", siPhp),
  icon("MongoDB", siMongodb),
  icon("Firebase", siFirebase),
  icon("SEO", siGooglesearchconsole),
];

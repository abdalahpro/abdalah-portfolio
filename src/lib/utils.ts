import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "**gras**" → <strong>, utilisé pour les textes du CV. */
export function splitBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part) =>
    part.startsWith("**") ? { bold: true, text: part.slice(2, -2) } : { bold: false, text: part }
  );
}

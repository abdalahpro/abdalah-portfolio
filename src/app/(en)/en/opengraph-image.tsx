import { getDictionary } from "@/i18n";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = getDictionary("en").meta.title;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage("en");
}

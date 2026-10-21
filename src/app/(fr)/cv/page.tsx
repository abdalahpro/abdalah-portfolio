import { CvPage } from "@/components/pages/CvPage";
import { getDictionary } from "@/i18n";
import { buildMetadata } from "@/lib/seo";

const dict = getDictionary("fr");

export const metadata = buildMetadata("fr", {
  title: dict.meta.cvTitle,
  description: dict.meta.cvDescription,
  path: "/cv",
});

export default function Page() {
  return <CvPage locale="fr" />;
}

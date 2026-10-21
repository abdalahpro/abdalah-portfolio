import { WorkPage } from "@/components/pages/WorkPage";
import { getDictionary } from "@/i18n";
import { buildMetadata } from "@/lib/seo";

const dict = getDictionary("fr");

export const metadata = buildMetadata("fr", {
  title: dict.meta.workTitle,
  description: dict.meta.workDescription,
  path: "/realisations",
});

export default function Page() {
  return <WorkPage locale="fr" />;
}

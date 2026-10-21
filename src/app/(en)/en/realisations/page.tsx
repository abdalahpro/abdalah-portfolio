import { WorkPage } from "@/components/pages/WorkPage";
import { getDictionary } from "@/i18n";
import { buildMetadata } from "@/lib/seo";

const dict = getDictionary("en");

export const metadata = buildMetadata("en", {
  title: dict.meta.workTitle,
  description: dict.meta.workDescription,
  path: "/realisations",
});

export default function Page() {
  return <WorkPage locale="en" />;
}

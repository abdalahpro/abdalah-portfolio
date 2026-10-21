import { CvPage } from "@/components/pages/CvPage";
import { getDictionary } from "@/i18n";
import { buildMetadata } from "@/lib/seo";

const dict = getDictionary("en");

export const metadata = buildMetadata("en", {
  title: dict.meta.cvTitle,
  description: dict.meta.cvDescription,
  path: "/cv",
});

export default function Page() {
  return <CvPage locale="en" />;
}

import type { ReactNode } from "react";
import { RootDocument } from "@/components/layout/RootDocument";
import { buildMetadata } from "@/lib/seo";

export { viewport } from "@/lib/seo";

export const metadata = buildMetadata("en");

export default function Layout({ children }: { children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}

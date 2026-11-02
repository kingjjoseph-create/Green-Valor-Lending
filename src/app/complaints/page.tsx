import { PageHero } from "@/components/layout/page-hero";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Consumer Complaints",
  description: "How to share a concern or file a complaint about Green Valor Lending LLC.",
  path: "/complaints",
});

export default function Page() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ title: "Consumer Complaints", href: "/complaints" }]}
        eyebrow="Legal"
        title="Consumer Complaints"
        description="How to share a concern or file a complaint about Green Valor Lending LLC."
      />
      <PhasePlaceholder note="Draft legal content is being prepared for compliance review before launch." />
    </>
  );
}

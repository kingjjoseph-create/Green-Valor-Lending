import { PageHero } from "@/components/layout/page-hero";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Licensing",
  description: "Licensing information and required disclosures for Green Valor Lending LLC.",
  path: "/licensing",
});

export default function Page() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ title: "Licensing", href: "/licensing" }]}
        eyebrow="Legal"
        title="Licensing & Disclosures"
        description="Licensing information and required disclosures for Green Valor Lending LLC."
      />
      <PhasePlaceholder note="Draft legal content is being prepared for compliance review before launch." />
    </>
  );
}

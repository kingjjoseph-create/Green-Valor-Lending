import { PageIntro } from "@/components/layout/page-intro";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Licensing & Disclosures",
  description: "Licensing information and required disclosures for Green Valor Lending LLC.",
  path: "/licensing",
});

export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Licensing & Disclosures"
        description="Licensing information and required disclosures for Green Valor Lending LLC."
      />
      <PhasePlaceholder note="Draft legal content is being prepared for compliance review before launch." />
    </>
  );
}

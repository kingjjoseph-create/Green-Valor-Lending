import { company } from "@/config/company";
import { PageIntro } from "@/components/layout/page-intro";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Reach the Green Valor Lending team with questions about Florida mortgage options.",
  path: "/contact",
});

export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow={company.brand.tagline}
        title="Contact Green Valor Lending"
        description="Reach the Green Valor Lending team with questions about Florida mortgage options."
      />
      <PhasePlaceholder />
    </>
  );
}

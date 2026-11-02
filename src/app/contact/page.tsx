import { company } from "@/config/company";
import { PageHero } from "@/components/layout/page-hero";
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
      <PageHero
        breadcrumbs={[{ title: "Contact", href: "/contact" }]}
        eyebrow={company.brand.tagline}
        title="Contact Green Valor Lending"
        description="Reach the Green Valor Lending team with questions about Florida mortgage options."
      />
      <PhasePlaceholder />
    </>
  );
}

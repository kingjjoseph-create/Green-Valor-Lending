import { company } from "@/config/company";
import { PageHero } from "@/components/layout/page-hero";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About Us",
  description: "A veteran-owned wholesale mortgage brokerage serving Florida.",
  path: "/about",
});

export default function Page() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ title: "About Us", href: "/about" }]}
        eyebrow={company.brand.positioning}
        title="About Green Valor Lending"
        description="A veteran-owned wholesale mortgage brokerage serving Florida."
      />
      <PhasePlaceholder />
    </>
  );
}

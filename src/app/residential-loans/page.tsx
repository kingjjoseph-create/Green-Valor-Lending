import { company } from "@/config/company";
import { PageHero } from "@/components/layout/page-hero";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Residential Loans",
  description:
    "Purchase and refinance mortgage options for Florida properties, arranged through wholesale lending partners.",
  path: "/residential-loans",
});

export default function Page() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ title: "Residential Loans", href: "/residential-loans" }]}
        eyebrow={company.brand.borrowerMessage}
        title="Residential Mortgage Loans"
        description="Purchase and refinance mortgage options for Florida properties, arranged through wholesale lending partners."
      />
      <PhasePlaceholder />
    </>
  );
}

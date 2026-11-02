import { company } from "@/config/company";
import { PageHero } from "@/components/layout/page-hero";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Non-QM Loans",
  description:
    "Alternative documentation mortgage options for Florida borrowers whose income or property does not fit a traditional profile.",
  path: "/non-qm",
});

export default function Page() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ title: "Non-QM Loans", href: "/non-qm" }]}
        eyebrow={company.brand.borrowerMessage}
        title="Non-QM Mortgage Loans"
        description="Alternative documentation mortgage options for Florida borrowers whose income or property does not fit a traditional profile."
      />
      <PhasePlaceholder />
    </>
  );
}

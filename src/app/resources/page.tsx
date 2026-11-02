import { company } from "@/config/company";
import { PageHero } from "@/components/layout/page-hero";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Resources",
  description: "Educational guides to help Florida borrowers understand the mortgage process.",
  path: "/resources",
});

export default function Page() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ title: "Resources", href: "/resources" }]}
        eyebrow={company.brand.borrowerMessage}
        title="Borrower Resources"
        description="Educational guides to help Florida borrowers understand the mortgage process."
      />
      <PhasePlaceholder />
    </>
  );
}

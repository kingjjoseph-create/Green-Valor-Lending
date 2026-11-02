import { company } from "@/config/company";
import { PageIntro } from "@/components/layout/page-intro";
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
      <PageIntro
        eyebrow={company.brand.borrowerMessage}
        title="Borrower Resources"
        description="Educational guides to help Florida borrowers understand the mortgage process."
      />
      <PhasePlaceholder />
    </>
  );
}

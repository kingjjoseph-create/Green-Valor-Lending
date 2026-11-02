import { company } from "@/config/company";
import { PageIntro } from "@/components/layout/page-intro";
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
      <PageIntro
        eyebrow={company.brand.borrowerMessage}
        title="Non-QM Mortgage Loans"
        description="Alternative documentation mortgage options for Florida borrowers whose income or property does not fit a traditional profile."
      />
      <PhasePlaceholder />
    </>
  );
}

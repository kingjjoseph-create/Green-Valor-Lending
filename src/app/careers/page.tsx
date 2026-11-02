import { company } from "@/config/company";
import { PageIntro } from "@/components/layout/page-intro";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Careers",
  description: "Loan officer opportunities with training, development, and marketing support.",
  path: "/careers",
});

export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow={company.brand.recruitmentMessage}
        title="Careers for Loan Officers"
        description="Loan officer opportunities with training, development, and marketing support."
      />
      <PhasePlaceholder />
    </>
  );
}

import { company } from "@/config/company";
import { PageHero } from "@/components/layout/page-hero";
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
      <PageHero
        breadcrumbs={[{ title: "Careers", href: "/careers" }]}
        eyebrow={company.brand.recruitmentMessage}
        title="Careers for Loan Officers"
        description="Loan officer opportunities with training, development, and marketing support."
      />
      <PhasePlaceholder />
    </>
  );
}

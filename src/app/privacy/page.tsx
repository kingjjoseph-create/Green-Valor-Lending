import { PageHero } from "@/components/layout/page-hero";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Green Valor Lending LLC collects, uses, and protects personal information.",
  path: "/privacy",
});

export default function Page() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ title: "Privacy Policy", href: "/privacy" }]}
        eyebrow="Legal"
        title="Privacy Policy"
        description="How Green Valor Lending LLC collects, uses, and protects personal information."
      />
      <PhasePlaceholder note="Draft legal content is being prepared for compliance review before launch." />
    </>
  );
}

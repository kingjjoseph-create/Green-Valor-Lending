import { PageHero } from "@/components/layout/page-hero";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "Terms governing use of the Green Valor Lending website.",
  path: "/terms",
});

export default function Page() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ title: "Terms of Use", href: "/terms" }]}
        eyebrow="Legal"
        title="Terms of Use"
        description="Terms governing use of the Green Valor Lending website."
      />
      <PhasePlaceholder note="Draft legal content is being prepared for compliance review before launch." />
    </>
  );
}

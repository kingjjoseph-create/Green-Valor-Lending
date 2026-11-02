import { PageIntro } from "@/components/layout/page-intro";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Accessibility",
  description: "Our commitment to an accessible website for all visitors.",
  path: "/accessibility",
});

export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Accessibility Statement"
        description="Our commitment to an accessible website for all visitors."
      />
      <PhasePlaceholder note="Draft legal content is being prepared for compliance review before launch." />
    </>
  );
}

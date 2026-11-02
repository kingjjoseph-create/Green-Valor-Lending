import { company } from "@/config/company";
import { PageIntro } from "@/components/layout/page-intro";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Get Started",
  description: "Begin a conversation about your Florida mortgage goals.",
  path: "/get-started",
});

export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow={company.brand.borrowerMessage}
        title="Get Started"
        description="Begin a conversation about your Florida mortgage goals."
      />
      <PhasePlaceholder />
    </>
  );
}

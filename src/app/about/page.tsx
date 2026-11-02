import { company } from "@/config/company";
import { PageIntro } from "@/components/layout/page-intro";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About Us",
  description: "A veteran-owned wholesale mortgage brokerage serving Florida.",
  path: "/about",
});

export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow={company.brand.positioning}
        title="About Green Valor Lending"
        description="A veteran-owned wholesale mortgage brokerage serving Florida."
      />
      <PhasePlaceholder />
    </>
  );
}

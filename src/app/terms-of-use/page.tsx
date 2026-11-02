import { termsContent as c } from "@/content/legal/terms";
import { PageHero } from "@/components/layout/page-hero";
import { SectionContainer } from "@/components/layout/section-container";
import { LegalDocument } from "@/components/legal/legal-document";
import { ContactDetails } from "@/components/legal/contact-details";
import { legalContentApprovedOn } from "@/lib/compliance";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: c.title, description: c.description, path: "/terms-of-use" });

export default function TermsOfUsePage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ title: c.title, href: "/terms-of-use" }]}
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
      />
      <SectionContainer spacing="compact" reveal={false}>
        <LegalDocument
          sections={c.sections}
          approvedOn={legalContentApprovedOn}
          draftNote={c.draftNote}
          slots={{ contact: <ContactDetails /> }}
        />
      </SectionContainer>
    </>
  );
}

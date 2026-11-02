import { privacyContent as c } from "@/content/legal/privacy";
import { PageHero } from "@/components/layout/page-hero";
import { SectionContainer } from "@/components/layout/section-container";
import { LegalDocument } from "@/components/legal/legal-document";
import { ContactDetails } from "@/components/legal/contact-details";
import { legalContentApprovedOn } from "@/lib/compliance";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: c.title, description: c.description, path: "/privacy-policy" });

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ title: c.title, href: "/privacy-policy" }]}
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

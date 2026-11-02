import { Briefcase, Building2, House } from "lucide-react";

import { company } from "@/config/company";
import { PageHero } from "@/components/layout/page-hero";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { SectionContainer } from "@/components/layout/section-container";
import { ServiceCard } from "@/components/shared/cards";
import { CTAButton } from "@/components/shared/cta-button";
import { SectionHeading } from "@/components/shared/section-heading";
import { getPublishedProducts } from "@/lib/company";

const productIcons = { residential: House, "non-qm": Building2 } as const;

/**
 * Home shell built from the shared components. Full home page content
 * (photography, value sections, process, education, recruiting) comes with
 * the page-content phase.
 */
export default function HomePage() {
  const products = getPublishedProducts();

  return (
    <>
      <PageHero
        size="home"
        tone="green"
        eyebrow={company.identity}
        title={company.brand.borrowerMessage}
        description={`${company.brand.tagline} A Florida wholesale mortgage brokerage helping you compare residential and Non-QM options from wholesale lending partners.`}
        actions={
          <>
            <CTAButton href="/get-started">Get Started</CTAButton>
            <CTAButton href="/careers" variant="outlineInverse" arrow={false}>
              Loan Officer Careers
            </CTAButton>
          </>
        }
      />

      <SectionContainer aria-labelledby="home-options">
        <SectionHeading
          id="home-options"
          eyebrow="Florida mortgage options"
          title="Options matched to your goals"
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {products.map((p) => (
            <li key={p.id}>
              <ServiceCard icon={productIcons[p.id]} title={p.name} description={p.summary} href={p.href} />
            </li>
          ))}
          <li className="md:col-span-2">
            <ServiceCard
              icon={Briefcase}
              title="Careers for Loan Officers"
              description={`${company.brand.loanOfficerMessage} Training, development, and marketing support for loan officers building their business in Florida.`}
              href="/careers"
              linkLabel="Explore careers"
            />
          </li>
        </ul>
      </SectionContainer>

      <PhasePlaceholder note="Additional home page sections are scheduled for the page-content phase." />
    </>
  );
}

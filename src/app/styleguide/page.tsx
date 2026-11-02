import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Award, GraduationCap, Handshake, House, Megaphone, ShieldCheck } from "lucide-react";

import { company } from "@/config/company";
import { brand, contrastPairs, contrastRatio, support } from "@/config/design-tokens";
import { images } from "@/content/images";
import { PageHero } from "@/components/layout/page-hero";
import { SectionContainer } from "@/components/layout/section-container";
import { FeatureCard, ServiceCard, ValueCard } from "@/components/shared/cards";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";
import { ProcessTimeline } from "@/components/shared/process-timeline";
import { ResponsiveImage } from "@/components/shared/responsive-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { FormField } from "@/components/forms/form-field";
import { FormStatus } from "@/components/forms/form-status";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

/**
 * Internal component gallery used for design QA. Returns 404 unless
 * NEXT_PUBLIC_ENABLE_STYLEGUIDE=true. Sample text below is illustrative UI
 * copy only, not published marketing content.
 */
export default function StyleguidePage() {
  if (!company.features.styleguide) notFound();

  const swatches = [
    ["Primary Green", brand.green],
    ["Gold", brand.gold],
    ["Forest Green", brand.forest],
    ["Warm Ivory", brand.ivory],
    ["Charcoal", brand.charcoal],
    ["White", brand.white],
    ["Gold Deep (text on light)", support.goldDeep],
    ["Gold Bright (text on green)", support.goldBright],
    ["Muted text", support.mutedText],
  ] as const;

  return (
    <>
      <PageHero
        breadcrumbs={[{ title: "Styleguide", href: "/styleguide" }]}
        eyebrow="Internal"
        title="Design system"
        description="Every global component, typography level and color token in one place for review."
        actions={
          <>
            <CTAButton href="/get-started">Primary action</CTAButton>
            <CTAButton href="/contact" variant="outline" arrow={false}>
              Secondary action
            </CTAButton>
          </>
        }
        image={images.homeHero}
      />

      <SectionContainer aria-labelledby="sg-type">
        <SectionHeading id="sg-type" eyebrow="Typography" title="Type scale" />
        <div className="mt-10 space-y-6">
          <p className="type-hero text-heading">Hero headline</p>
          <p className="type-page-title text-heading">Page heading</p>
          <p className="type-section-title text-heading">Section heading</p>
          <p className="type-card-title text-heading">Card heading</p>
          <p className="type-eyebrow">Eyebrow label</p>
          <p className="max-w-2xl type-lead">Lead copy introduces a section in a sentence or two.</p>
          <p className="max-w-2xl type-body">
            Body copy is set in Inter at 16px with generous line height for comfortable reading on every
            screen.
          </p>
          <p className="max-w-2xl type-support text-muted-foreground">
            Supporting copy for secondary details.
          </p>
          <p className="max-w-2xl type-legal text-muted-foreground">
            Legal text for disclosures and fine print.
          </p>
        </div>
      </SectionContainer>

      <SectionContainer tone="ivory" aria-labelledby="sg-color">
        <SectionHeading id="sg-color" eyebrow="Color" title="Tokens and verified contrast" />
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {swatches.map(([name, hex]) => (
            <li key={hex} className="overflow-hidden rounded-lg border border-border bg-white">
              <span className="block h-16" style={{ backgroundColor: hex }} aria-hidden="true" />
              <span className="block px-3 py-2 text-xs">
                <span className="font-semibold">{name}</span>
                <br />
                {hex}
              </span>
            </li>
          ))}
        </ul>
        <table className="mt-10 w-full max-w-3xl text-left text-sm">
          <caption className="sr-only">Contrast ratios</caption>
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-4 font-semibold">Pairing</th>
              <th className="py-2 pr-4 font-semibold">Ratio</th>
              <th className="py-2 font-semibold">Target</th>
            </tr>
          </thead>
          <tbody>
            {contrastPairs.map((p) => (
              <tr key={p.name} className="border-b border-border/60">
                <td className="py-2 pr-4">{p.name}</td>
                <td className="py-2 pr-4">{contrastRatio(p.fg, p.bg).toFixed(2)}:1</td>
                <td className="py-2">{p.min}:1</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionContainer>

      <SectionContainer aria-labelledby="sg-cards">
        <SectionHeading id="sg-cards" eyebrow="Cards" title="Service, feature and value cards" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ServiceCard
            icon={House}
            title="Service card"
            description="Links to a service page."
            href="/residential-loans"
          />
          <ServiceCard
            icon={GraduationCap}
            title="Another service"
            description="The whole card is one link."
            href="/careers"
          />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={ShieldCheck}
            title="Feature card"
            description="Describes a benefit; not interactive."
          />
          <FeatureCard icon={Handshake} title="Feature card" description="Icon, heading, supporting copy." />
          <FeatureCard icon={Megaphone} title="Feature card" description="Equal-height cards in a grid." />
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <ValueCard marker="01" title="Value card" description="Editorial treatment for principles." />
          <ValueCard marker="02" title="Value card" description="Gold rule above each value." />
          <ValueCard marker="03" title="Value card" description="Works on white and ivory." />
        </div>
      </SectionContainer>

      <SectionContainer tone="green" aria-labelledby="sg-dark">
        <SectionHeading
          id="sg-dark"
          eyebrow="On green"
          title="Components on the dark surface"
          description="Tokens re-map automatically inside green sections."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <FeatureCard
            tone="dark"
            icon={Award}
            title="Dark feature"
            description="White text on primary green."
          />
          <FeatureCard
            tone="dark"
            icon={Handshake}
            title="Dark feature"
            description="Gold icons for accents."
          />
          <FeatureCard
            tone="dark"
            icon={ShieldCheck}
            title="Dark feature"
            description="Muted copy at 80% white."
          />
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <CTAButton href="/get-started">Accent</CTAButton>
          <CTAButton href="/about" variant="inverse">
            Inverse
          </CTAButton>
          <CTAButton href="/contact" variant="outlineInverse" arrow={false}>
            Outline inverse
          </CTAButton>
        </div>
      </SectionContainer>

      <SectionContainer aria-labelledby="sg-process">
        <SectionHeading id="sg-process" eyebrow="Process" title="Process timeline" />
        <ProcessTimeline
          className="mt-12"
          steps={[
            { title: "Step title", description: "Short description of this step." },
            { title: "Step title", description: "Short description of this step." },
            { title: "Step title", description: "Short description of this step." },
            { title: "Step title", description: "Short description of this step." },
          ].map((s, i) => ({ ...s, title: `${s.title} ${i + 1}` }))}
        />
      </SectionContainer>

      <SectionContainer tone="ivory" aria-labelledby="sg-faq">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading
            id="sg-faq"
            eyebrow="FAQ"
            title="FAQ accordion"
            description="Native details/summary: keyboard accessible, no JavaScript."
          />
          <FAQAccordion
            items={[
              { question: "Sample question one?", answer: "Sample answer text." },
              { question: "Sample question two?", answer: "Sample answer text." },
              { question: "Sample question three?", answer: "Sample answer text." },
            ]}
          />
        </div>
      </SectionContainer>

      <SectionContainer aria-labelledby="sg-forms">
        <SectionHeading id="sg-forms" eyebrow="Forms" title="Form fields and status" />
        <form className="mt-10 grid max-w-2xl gap-6 sm:grid-cols-2" aria-label="Sample form" action="#">
          <FormField label="First name" name="sg-first" required autoComplete="given-name" />
          <FormField label="Last name" name="sg-last" required autoComplete="family-name" />
          <FormField
            label="Email"
            name="sg-email"
            type="email"
            required
            error="Enter a valid email address."
            className="sm:col-span-2"
          />
          <FormField
            as="select"
            label="Topic"
            name="sg-topic"
            options={[
              { value: "a", label: "Option A" },
              { value: "b", label: "Option B" },
            ]}
            className="sm:col-span-2"
          />
          <FormField
            as="textarea"
            label="Message"
            name="sg-message"
            hint="Please do not include sensitive financial information."
            className="sm:col-span-2"
          />
          <FormStatus status="success" className="sm:col-span-2" />
          <FormStatus status="error" className="sm:col-span-2" />
        </form>
      </SectionContainer>

      <SectionContainer tone="ivory" aria-labelledby="sg-media">
        <SectionHeading id="sg-media" eyebrow="Media & legal" title="Responsive image and legal disclaimer" />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <ResponsiveImage image={images.officeSetting} aspect="3/2" />
          <LegalDisclaimer
            variant="boxed"
            title="Important information"
            include={["brokerStatement", "noCommitment"]}
          />
        </div>
      </SectionContainer>

      <CTASection
        eyebrow="Call to action"
        title="CTA section"
        description="Closing band with a primary and secondary action."
        primary={{ label: "Get Started", href: "/get-started" }}
        secondary={{ label: "Contact", href: "/contact" }}
      />
    </>
  );
}

import {
  BookOpen,
  Building2,
  ClipboardList,
  FileCheck2,
  FileSearch,
  House,
  KeyRound,
  MessagesSquare,
} from "lucide-react";

import { company } from "@/config/company";
import { resourcesContent } from "@/content/resources";
import { PageHero } from "@/components/layout/page-hero";
import { SectionContainer } from "@/components/layout/section-container";
import { MortgageCalculator } from "@/components/resources/mortgage-calculator";
import { SearchableFaq } from "@/components/resources/searchable-faq";
import { ServiceCard } from "@/components/shared/cards";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { ProcessTimeline } from "@/components/shared/process-timeline";
import { SectionHeading } from "@/components/shared/section-heading";
import { keepTogether } from "@/lib/keep-together";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Borrower Resources",
  description:
    "Mortgage education for Florida borrowers: a payment calculator, mortgage basics, an overview of the loan process, and answers to common questions.",
  path: "/resources",
});

const optionIcons = { residential: House, "non-qm": Building2 } as const;
const stepIcons = [MessagesSquare, ClipboardList, FileSearch, FileCheck2, KeyRound];

export default function ResourcesPage() {
  const { hero, calculator, basics, loanOptions, process, faq, cta } = resourcesContent;

  return (
    <>
      <PageHero
        breadcrumbs={[{ title: "Resources", href: "/resources" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        actions={hero.links.map((link, i) => (
          <CTAButton
            key={link.href}
            href={link.href}
            variant={i === 0 ? "default" : "outline"}
            arrow={i === 0}
            size="default"
          >
            {link.label}
          </CTAButton>
        ))}
      />

      {/* 1. Calculator (no entrance animation: it sits at the fold and is interactive) */}
      <SectionContainer
        id="calculator"
        aria-labelledby="res-calculator"
        reveal={false}
        className="scroll-mt-20"
      >
        <SectionHeading
          id="res-calculator"
          eyebrow={calculator.eyebrow}
          title={calculator.title}
          description={calculator.description}
        />
        <div className="mt-12">
          {company.features.calculators ? (
            <MortgageCalculator />
          ) : (
            <p className="type-body text-muted-foreground">
              The payment calculator is temporarily unavailable.
            </p>
          )}
        </div>
      </SectionContainer>

      {/* 2. Mortgage basics */}
      <SectionContainer
        id="mortgage-basics"
        aria-labelledby="res-basics"
        tone="ivory"
        className="scroll-mt-20"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <SectionHeading id="res-basics" eyebrow={basics.eyebrow} title={basics.title} />
            <BookOpen
              className="mt-10 size-10 text-gv-gold-deep max-lg:hidden"
              strokeWidth={1.25}
              aria-hidden="true"
            />
          </div>
          <FAQAccordion
            items={basics.items.map((item) => ({ question: item.question, answer: <p>{item.answer}</p> }))}
          />
        </div>
      </SectionContainer>

      {/* 3. Loan options */}
      <SectionContainer aria-labelledby="res-options">
        <SectionHeading id="res-options" eyebrow={loanOptions.eyebrow} title={loanOptions.title} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {loanOptions.cards.map((card) => (
            <ServiceCard
              key={card.id}
              icon={optionIcons[card.id]}
              title={keepTogether(card.title)}
              description={card.description}
              href={card.href}
              linkLabel={card.linkLabel}
            />
          ))}
        </div>
      </SectionContainer>

      {/* 4. Process */}
      <SectionContainer aria-labelledby="res-process" tone="ivory">
        <SectionHeading id="res-process" eyebrow={process.eyebrow} title={process.title} />
        <ProcessTimeline
          className="mt-14"
          steps={process.steps.map((step, i) => ({ ...step, icon: stepIcons[i] }))}
        />
        <p className="mt-12 max-w-2xl border-l-2 border-gv-gold pl-4 type-support text-muted-foreground">
          {process.note}
        </p>
      </SectionContainer>

      {/* 5. FAQ */}
      <SectionContainer id="faq" aria-labelledby="res-faq" className="scroll-mt-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <SectionHeading id="res-faq" eyebrow={faq.eyebrow} title={faq.title} />
            <p className="mt-6 type-lead text-muted-foreground">{faq.description}</p>
          </div>
          <SearchableFaq items={faq.items} categories={faq.categories} />
        </div>
      </SectionContainer>

      {/* 6. CTA */}
      <CTASection title={cta.title} description={cta.description} primary={cta.primary} />
    </>
  );
}

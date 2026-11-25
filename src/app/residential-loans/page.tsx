import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Briefcase,
  ClipboardList,
  CreditCard,
  FileSearch,
  House,
  KeyRound,
  Landmark,
  PiggyBank,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { residentialContent } from "@/content/residential";
import { images } from "@/content/images";
import { PageHero } from "@/components/layout/page-hero";
import { SectionContainer } from "@/components/layout/section-container";
import { ProgramCard } from "@/components/loans/program-card";
import { PurposeCard } from "@/components/loans/purpose-card";
import { RoleComparison } from "@/components/loans/role-comparison";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { IconListItem } from "@/components/shared/icon-list-item";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";
import { SectionHeading } from "@/components/shared/section-heading";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Residential Loans",
  description:
    "Learn about conventional, FHA, and VA home loans for Florida properties, and how Green Valor Lending, a mortgage broker, helps you explore purchase and refinance options.",
  path: "/residential-loans",
});

const programIcons = { conventional: Landmark, fha: ShieldCheck, va: BadgeCheck } as const;
const purposeIcons = { purchase: KeyRound, refinance: RefreshCw } as const;
const reviewIcons = [CreditCard, Briefcase, Scale, PiggyBank, Banknote, House, FileSearch];

export default function ResidentialLoansPage() {
  const { hero, financing, programs, purposes, review, faq, disclaimer, cta } = residentialContent;

  return (
    <>
      <PageHero
        breadcrumbs={[{ title: "Residential Loans", href: "/residential-loans" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        image={images.residentialHero}
        actions={<CTAButton href={hero.cta.href}>{hero.cta.label}</CTAButton>}
      />

      {/* 1. Residential financing: broker vs. lender */}
      {/* No entrance animation: this section can sit at the fold on load. */}
      <SectionContainer aria-labelledby="res-financing" reveal={false}>
        <SectionHeading
          id="res-financing"
          eyebrow={financing.eyebrow}
          title={financing.title}
          description={financing.description}
        />
        <RoleComparison roles={financing.roles} className="mt-12" />
      </SectionContainer>

      {/* 2. Loan programs */}
      <SectionContainer aria-labelledby="res-programs" tone="ivory">
        <SectionHeading
          id="res-programs"
          eyebrow={programs.eyebrow}
          title={programs.title}
          description={programs.description}
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {programs.cards.map((card) => (
            <ProgramCard
              key={card.id}
              icon={programIcons[card.id]}
              title={card.title}
              description={card.description}
              points={card.points}
              note={"note" in card ? card.note : undefined}
              finePrint={"affiliation" in card ? card.affiliation : undefined}
            />
          ))}
        </div>
        <article
          aria-labelledby="res-other"
          className="mt-6 flex flex-col gap-6 rounded-2xl border border-dashed border-input/60 p-6 min-[380px]:p-8 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex gap-4">
            <span
              className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-gv-gold/60 text-gv-gold-deep"
              aria-hidden="true"
            >
              <Sparkles className="size-[1.125rem]" strokeWidth={1.75} />
            </span>
            <div className="max-w-2xl">
              <h3 id="res-other" className="font-serif text-2xl font-semibold">
                {programs.other.title}
              </h3>
              <p className="mt-2 type-support text-muted-foreground">{programs.other.description}</p>
              {programs.other.verifiedPrograms.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {programs.other.verifiedPrograms.map((p) => (
                    <li key={p} className="rounded-full border border-border px-3 py-1 text-sm">
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <Link
            href={programs.other.link.href}
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-sm font-semibold text-gv-green underline decoration-gv-gold/60 underline-offset-4 hover:decoration-gv-green lg:self-center"
          >
            {programs.other.link.label}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </article>
      </SectionContainer>

      {/* 3. Purchase vs. refinance */}
      <SectionContainer aria-labelledby="res-purposes">
        <SectionHeading id="res-purposes" eyebrow={purposes.eyebrow} title={purposes.title} />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {purposes.cards.map((card) => (
            <PurposeCard
              key={card.id}
              icon={purposeIcons[card.id]}
              title={card.title}
              description={card.description}
              points={card.points}
            />
          ))}
        </div>
      </SectionContainer>

      {/* 4. What lenders generally review */}
      <SectionContainer aria-labelledby="res-review" tone="ivory">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <SectionHeading id="res-review" eyebrow={review.eyebrow} title={review.title} />
            <p className="mt-6 type-lead text-muted-foreground">{review.description}</p>
            <div className="mt-8 flex items-start gap-3 rounded-lg border border-border bg-card p-5">
              <ClipboardList className="mt-0.5 size-5 shrink-0 text-gv-gold-deep" aria-hidden="true" />
              <p className="type-support text-muted-foreground">
                Meeting these factors is not a guarantee of approval. The lender makes the final credit
                decision.
              </p>
            </div>
          </div>
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {review.items.map((item, i) => (
              <IconListItem
                key={item.title}
                icon={reviewIcons[i]}
                title={item.title}
                description={item.description}
              />
            ))}
          </ul>
        </div>
      </SectionContainer>

      {/* 5. Borrower education */}
      <SectionContainer aria-labelledby="res-faq">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <SectionHeading id="res-faq" eyebrow={faq.eyebrow} title={faq.title} />
            <p className="mt-6 type-lead text-muted-foreground">{faq.description}</p>
          </div>
          <FAQAccordion
            items={faq.items.map((item) => ({
              question: item.question,
              answer: (
                <>
                  <p>{item.answer}</p>
                  {"link" in item && item.link && (
                    <CTAButton href={item.link.href} variant="default" size="default" className="mt-5">
                      {item.link.label}
                    </CTAButton>
                  )}
                </>
              ),
            }))}
          />
        </div>
        <LegalDisclaimer label="Program information" variant="boxed" className="mt-16">
          <p>{disclaimer}</p>
        </LegalDisclaimer>
      </SectionContainer>

      {/* 6. CTA */}
      <CTASection title={cta.title} description={cta.description} primary={cta.primary} />
    </>
  );
}

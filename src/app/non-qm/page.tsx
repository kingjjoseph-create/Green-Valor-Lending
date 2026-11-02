import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  ClipboardCheck,
  FileCheck2,
  FileSearch,
  FileText,
  Files,
  Layers,
  ListChecks,
  MessagesSquare,
  ReceiptText,
  ScanSearch,
  Scale,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";

import { nonQmContent } from "@/content/non-qm";
import { PageHero } from "@/components/layout/page-hero";
import { SectionContainer } from "@/components/layout/section-container";
import { ComparisonTable } from "@/components/loans/comparison-table";
import { ProgramCard } from "@/components/loans/program-card";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { IconListItem } from "@/components/shared/icon-list-item";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";
import { ProcessTimeline } from "@/components/shared/process-timeline";
import { SectionHeading } from "@/components/shared/section-heading";
import { keepTogether as kt } from "@/lib/keep-together";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Non-QM Loans",
  description:
    "Learn how Non-QM mortgages such as bank statement, DSCR, and 1099 programs work for Florida borrowers with self-employment, investment, or alternative income documentation.",
  path: "/non-qm",
});

const factIcons = [ScanSearch, Layers, Files, FileCheck2];
const programIcons = { "bank-statement": ReceiptText, dscr: Building2, "1099": FileText } as const;
const scenarioIcons = [Store, Briefcase, UserRound, Building2, FileSearch];
const stepIcons = [MessagesSquare, Scale, ListChecks, ClipboardCheck, FileCheck2];

export default function NonQmPage() {
  const { hero, overview, programs, scenarios, comparison, process, faq, disclaimer, cta } = nonQmContent;

  return (
    <>
      <PageHero
        tone="green"
        breadcrumbs={[{ title: "Non-QM Loans", href: "/non-qm" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        actions={<CTAButton href={hero.cta.href}>{hero.cta.label}</CTAButton>}
      />

      {/* 1. What is Non-QM? (no entrance animation: may sit at the fold) */}
      <SectionContainer aria-labelledby="nqm-overview" reveal={false}>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading id="nqm-overview" eyebrow={overview.eyebrow} title={kt(overview.title)} />
            <div className="mt-8 space-y-5 type-lead text-muted-foreground">
              {overview.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <ul className="space-y-7 rounded-2xl border border-border bg-surface-alt p-6 min-[380px]:p-8 sm:p-10">
            {overview.facts.map((fact, i) => (
              <IconListItem
                key={fact.title}
                icon={factIcons[i]}
                title={fact.title}
                description={kt(fact.description)}
              />
            ))}
          </ul>
        </div>
      </SectionContainer>

      {/* 2. Programs */}
      <SectionContainer aria-labelledby="nqm-programs" tone="ivory">
        <SectionHeading
          id="nqm-programs"
          eyebrow={programs.eyebrow}
          title={kt(programs.title)}
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
            />
          ))}
        </div>
        <article
          aria-labelledby="nqm-other"
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
              <h3 id="nqm-other" className="font-serif text-2xl font-semibold">
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

      {/* 3. Who may benefit */}
      <SectionContainer aria-labelledby="nqm-scenarios" tone="green">
        <SectionHeading
          id="nqm-scenarios"
          eyebrow={scenarios.eyebrow}
          title={kt(scenarios.title)}
          description={scenarios.description}
        />
        <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.items.map((item, i) => (
            <IconListItem
              key={item.title}
              icon={scenarioIcons[i]}
              title={item.title}
              description={item.description}
            />
          ))}
        </ul>
      </SectionContainer>

      {/* 4. Traditional vs. Non-QM */}
      <SectionContainer aria-labelledby="nqm-compare">
        <SectionHeading
          id="nqm-compare"
          eyebrow={comparison.eyebrow}
          title={kt(comparison.title)}
          description={comparison.description}
        />
        <ComparisonTable
          caption="Traditional (QM) and Non-QM mortgages compared"
          columns={comparison.columns}
          rows={comparison.rows}
          className="mt-12"
        />
      </SectionContainer>

      {/* 5. Process */}
      <SectionContainer aria-labelledby="nqm-process" tone="ivory">
        <SectionHeading id="nqm-process" eyebrow={process.eyebrow} title={kt(process.title)} />
        <ProcessTimeline
          className="mt-14"
          steps={process.steps.map((step, i) => ({ ...step, icon: stepIcons[i] }))}
        />
      </SectionContainer>

      {/* 6. FAQ */}
      <SectionContainer aria-labelledby="nqm-faq">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <SectionHeading id="nqm-faq" eyebrow={faq.eyebrow} title={kt(faq.title)} />
            <p className="mt-6 type-lead text-muted-foreground">{faq.description}</p>
          </div>
          <FAQAccordion
            items={faq.items.map((item) => ({ question: kt(item.question), answer: <p>{item.answer}</p> }))}
          />
        </div>
        <LegalDisclaimer label="Program information" variant="boxed" className="mt-16">
          <p>{disclaimer}</p>
        </LegalDisclaimer>
      </SectionContainer>

      {/* 7. CTA */}
      <CTASection title={cta.title} description={cta.description} primary={cta.primary} />
    </>
  );
}

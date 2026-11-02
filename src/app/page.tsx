import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calculator,
  ClipboardCheck,
  Compass,
  GraduationCap,
  HandHeart,
  House,
  Landmark,
  Lightbulb,
  ListChecks,
  Megaphone,
  MessagesSquare,
  Scale,
  ShieldCheck,
  Target,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

import { company } from "@/config/company";
import { homeContent } from "@/content/home";
import { images } from "@/content/images";
import { HomeHero } from "@/components/home/home-hero";
import { IconListItem } from "@/components/home/icon-list-item";
import { RecruitmentBand } from "@/components/home/recruitment-band";
import { SolutionCard } from "@/components/home/solution-card";
import { SectionContainer } from "@/components/layout/section-container";
import { FeatureCard } from "@/components/shared/cards";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";
import { ProcessTimeline } from "@/components/shared/process-timeline";
import { ResponsiveImage } from "@/components/shared/responsive-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

const highlightIcons = [HandHeart, MessagesSquare, UserRound, BookOpen, Scale];
const solutionIcons = { residential: House, "non-qm": Building2 } as const;
const benefitIcons = [ShieldCheck, Compass, Lightbulb, GraduationCap];
const stepIcons = [MessagesSquare, Target, ListChecks, ClipboardCheck];
const topicIcons = {
  basics: Landmark,
  programs: BookOpen,
  terms: Lightbulb,
  calculator: Calculator,
} as const;
const loIcons = [GraduationCap, Megaphone, TrendingUp, Users];

export default function HomePage() {
  const { whoWeAre, solutions, why, process, education, loanOfficers, finalCta } = homeContent;

  return (
    <>
      {/* 1. Hero */}
      <HomeHero />

      {/* 2. Who we are */}
      {/* No entrance animation: this section sits at the fold on load and must be fully legible without scrolling. */}
      <SectionContainer aria-labelledby="home-who" spacing="spacious" reveal={false}>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading id="home-who" eyebrow={whoWeAre.eyebrow} title={whoWeAre.title} />
            <div className="mt-8 max-w-xl space-y-5 type-lead text-muted-foreground">
              {whoWeAre.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Link
              href={whoWeAre.link.href}
              className="group mt-8 inline-flex items-center gap-2 rounded-sm font-semibold text-gv-green underline decoration-gv-gold/60 underline-offset-4 transition-colors hover:decoration-gv-green"
            >
              {whoWeAre.link.label}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
          <ul className="space-y-7 self-center rounded-2xl border border-border bg-surface-alt/60 p-8 sm:p-10">
            {whoWeAre.highlights.map((h, i) => (
              <IconListItem
                key={h.title}
                icon={highlightIcons[i]}
                title={h.title}
                description={h.description}
              />
            ))}
          </ul>
        </div>
      </SectionContainer>

      {/* 3. Mortgage solutions */}
      <SectionContainer
        id="mortgage-solutions"
        tone="ivory"
        aria-labelledby="home-solutions"
        className="scroll-mt-20"
      >
        <SectionHeading
          id="home-solutions"
          eyebrow={solutions.eyebrow}
          title={solutions.title}
          description={solutions.description}
          align="center"
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {solutions.cards.map((card) => (
            <SolutionCard
              key={card.id}
              icon={solutionIcons[card.id]}
              title={card.title}
              description={card.description}
              listLabel={solutions.listLabel}
              features={card.features}
              cta={card.cta}
            />
          ))}
        </div>
        <LegalDisclaimer label="Program availability" className="mx-auto mt-10 max-w-4xl text-center">
          <p>{solutions.disclaimer}</p>
        </LegalDisclaimer>
      </SectionContainer>

      {/* 4. Why Green Valor */}
      <SectionContainer aria-labelledby="home-why" spacing="spacious">
        <SectionHeading id="home-why" eyebrow={why.eyebrow} title={why.title} />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {why.benefits.map((b, i) => (
            <li key={b.title}>
              <FeatureCard icon={benefitIcons[i]} title={b.title} description={b.description} />
            </li>
          ))}
        </ul>
      </SectionContainer>

      {/* 5. How it works */}
      <SectionContainer tone="ivory" aria-labelledby="home-process">
        <SectionHeading id="home-process" eyebrow={process.eyebrow} title={process.title} />
        <ProcessTimeline
          className="mt-14"
          steps={process.steps.map((s, i) => ({ ...s, icon: stepIcons[i] }))}
        />
        <LegalDisclaimer
          label="Broker disclosure"
          className="mt-12 max-w-3xl"
          include={["brokerStatement"]}
        />
      </SectionContainer>

      {/* 6. Borrower education */}
      <SectionContainer aria-labelledby="home-education" spacing="spacious">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <ResponsiveImage
            image={images.businessMeeting}
            aspect="4/3"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className={cn("order-last lg:order-first", !images.businessMeeting && "max-lg:hidden")}
          />
          <div>
            <SectionHeading
              id="home-education"
              eyebrow={education.eyebrow}
              title={education.title}
              description={education.description}
            />
            <ul className="mt-10 grid gap-7 sm:grid-cols-2">
              {education.topics.map((t) => (
                <IconListItem
                  key={t.id}
                  icon={topicIcons[t.id]}
                  title={t.title}
                  description={t.description}
                  badge={t.id === "calculator" && !company.features.calculators ? "Coming soon" : undefined}
                />
              ))}
            </ul>
            <CTAButton href={education.cta.href} variant="default" className="mt-10">
              {education.cta.label}
            </CTAButton>
          </div>
        </div>
      </SectionContainer>

      {/* 7. Loan officer support */}
      <SectionContainer tone="ivory" aria-labelledby="home-lo" spacing="spacious">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              id="home-lo"
              eyebrow={loanOfficers.eyebrow}
              title={loanOfficers.title}
              description={loanOfficers.description}
            />
            <p className="mt-6 font-serif text-2xl text-heading">{loanOfficers.message}</p>
            <ul className="mt-10 grid gap-7 sm:grid-cols-2">
              {loanOfficers.features.map((f, i) => (
                <IconListItem key={f.title} icon={loIcons[i]} title={f.title} description={f.description} />
              ))}
            </ul>
            <CTAButton href={loanOfficers.cta.href} variant="default" className="mt-10">
              {loanOfficers.cta.label}
            </CTAButton>
          </div>
          <ResponsiveImage
            image={images.teamTraining}
            aspect="4/3"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className={cn(!images.teamTraining && "max-lg:hidden")}
          />
        </div>
      </SectionContainer>

      {/* 8. Recruitment */}
      <RecruitmentBand />

      {/* 9. Final CTA */}
      <CTASection
        tone="ivory"
        title={finalCta.title}
        description={finalCta.description}
        primary={finalCta.primary}
        secondary={finalCta.secondary}
      />
    </>
  );
}

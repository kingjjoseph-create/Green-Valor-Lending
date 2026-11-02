import { Suspense } from "react";
import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  Check,
  Compass,
  Flag,
  Handshake,
  HeartHandshake,
  Info,
  Lightbulb,
  LockKeyhole,
  Medal,
  Megaphone,
  MessagesSquare,
  Repeat,
  Rocket,
  Scale,
  ShieldCheck,
  Sprout,
  Target,
  TrendingUp,
  UserRoundCheck,
  Users,
} from "lucide-react";

import { company } from "@/config/company";
import { featureFlags } from "@/config/features";
import { careersContent } from "@/content/careers";
import { images } from "@/content/images";
import { RecruitmentForm } from "@/components/careers/recruitment-form";
import { RecruitmentFormWithParams } from "@/components/careers/recruitment-form-section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { SectionContainer } from "@/components/layout/section-container";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { IconListItem } from "@/components/shared/icon-list-item";
import { ProcessTimeline } from "@/components/shared/process-timeline";
import { ResponsiveImage } from "@/components/shared/responsive-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Careers",
  description:
    "Explore a career with Green Valor Lending, a veteran-owned Florida mortgage brokerage. Opportunities for licensed loan officers and driven professionals exploring the mortgage industry.",
  path: "/careers",
});

const audienceIcons = [Briefcase, Rocket, TrendingUp, Medal];
const growthIcons = [BookOpen, Megaphone, Users];
const valueIcons = [Target, Scale, Lightbulb, BadgeCheck, Handshake, Sprout, HeartHandshake];
const cultureIcons = [Flag, ShieldCheck, Users, Repeat, MessagesSquare];
const processIcons = [Compass, MessagesSquare, UserRoundCheck, TrendingUp];

export default function CareersPage() {
  const { hero, audience, growth, standard, pathways, culture, apply, process, cta } = careersContent;
  const heroImage = images.careersHero;

  return (
    <>
      {/* Hero: green surface. Shows the licensed workplace photo once supplied; until then, the reversed mark. */}
      <section aria-labelledby="careers-hero-title" className="surface-inverse relative overflow-hidden">
        <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-24 xl:py-28">
          <div className="gv-fade-in">
            <Breadcrumbs items={[{ title: "Careers", href: "/careers" }]} className="mb-8" />
            <p className="type-eyebrow">{hero.eyebrow}</p>
            <h1 id="careers-hero-title" className="mt-6 type-hero">
              {hero.title}
            </h1>
            <span className="mt-7 block h-0.5 w-14 rounded-full bg-gv-gold" aria-hidden="true" />
            <p className="mt-7 max-w-xl type-lead text-muted-foreground">{hero.description}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CTAButton href={hero.primary.href} variant="accent">
                {hero.primary.label}
              </CTAButton>
              <CTAButton href={hero.secondary.href} variant="outlineInverse" arrow={false}>
                {hero.secondary.label}
              </CTAButton>
            </div>
          </div>
          {heroImage ? (
            <ResponsiveImage
              image={heroImage}
              aspect="4/3"
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="gv-fade-in-delay shadow-[0_24px_60px_-28px_rgb(0_0_0/0.6)]"
            />
          ) : (
            <div
              className="gv-fade-in-delay hidden flex-col items-center justify-center gap-10 rounded-2xl border border-white/10 bg-white/[0.03] px-10 py-14 lg:flex"
              aria-hidden="true"
            >
              <Logo variant="mark-reversed" height={200} link={false} />
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                {hero.pillars.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2 text-sm font-semibold tracking-[0.14em] text-white/85 uppercase"
                  >
                    <span className="size-1.5 rounded-full bg-gv-gold" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>

      {/* 1. Who we're looking for */}
      <SectionContainer aria-labelledby="careers-audience" reveal={false}>
        <SectionHeading
          id="careers-audience"
          eyebrow={audience.eyebrow}
          title={audience.title}
          description={audience.description}
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {audience.cards.map((card, i) => {
            const Icon = audienceIcons[i]!;
            return (
              <li
                key={card.title}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 transition-[border-color,box-shadow] duration-300 hover:border-gv-gold hover:shadow-[0_12px_32px_-16px_rgb(2_51_29/0.3)]"
              >
                <span className="absolute inset-x-0 top-0 h-1 bg-gv-green" aria-hidden="true" />
                <span
                  className="inline-flex size-12 items-center justify-center rounded-full bg-gv-green text-gv-gold"
                  aria-hidden="true"
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-6 type-card-title">{card.title}</h3>
                <p className="mt-3 type-support text-muted-foreground">{card.description}</p>
              </li>
            );
          })}
        </ul>
        <p
          className="mt-8 flex items-start gap-3 rounded-lg border border-gv-gold/40 bg-gv-gold/[0.06] px-5 py-4 type-support text-gv-charcoal"
          data-testid="military-note"
        >
          <Info className="mt-0.5 size-4 shrink-0 text-gv-green" aria-hidden="true" />
          {audience.militaryNote}
        </p>
      </SectionContainer>

      {/* 2. Why Green Valor */}
      <SectionContainer aria-labelledby="careers-growth" tone="ivory" className="border-y border-border">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.9fr] lg:gap-16">
          <SectionHeading
            id="careers-growth"
            eyebrow={growth.eyebrow}
            title={growth.title}
            description={growth.description}
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <ul className="grid gap-6 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {growth.cards.map((card, i) => {
              const Icon = growthIcons[i]!;
              return (
                <li
                  key={card.title}
                  className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-[0_1px_2px_rgb(2_51_29/0.04)]"
                >
                  <span
                    className="inline-flex size-12 items-center justify-center rounded-full border border-gv-gold text-gv-green"
                    aria-hidden="true"
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-6 type-card-title">{card.title}</h3>
                  <ul className="mt-5 space-y-3">
                    {card.points.map((point) => (
                      <li key={point} className="flex gap-3 type-support text-gv-charcoal">
                        <Check
                          className="mt-1 size-4 shrink-0 text-gv-gold"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </SectionContainer>

      {/* 3. The Green Valor standard */}
      <SectionContainer aria-labelledby="careers-standard" spacing="spacious">
        <SectionHeading
          id="careers-standard"
          eyebrow={standard.eyebrow}
          title={standard.title}
          description={standard.description}
          align="center"
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {standard.values.map((value, i) => {
            const Icon = valueIcons[i]!;
            const last = i === standard.values.length - 1;
            return (
              <li
                key={value.title}
                className={cn("flex flex-col bg-card p-7", last && "surface-inverse sm:col-span-2")}
              >
                <div className="flex items-center gap-3">
                  <Icon className="size-5 text-(--eyebrow)" strokeWidth={1.75} aria-hidden="true" />
                  <span className="font-serif text-sm text-muted-foreground lining-nums" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 type-card-title text-[1.375rem]">{value.title}</h3>
                <p className="mt-2 type-support text-muted-foreground">{value.description}</p>
              </li>
            );
          })}
        </ul>
      </SectionContainer>

      {/* 4. Two career pathways */}
      <SectionContainer aria-labelledby="careers-pathways" tone="ivory" className="border-y border-border">
        <SectionHeading id="careers-pathways" eyebrow={pathways.eyebrow} title={pathways.title} />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {pathways.items.map((path) => {
            const primary = path.id === "licensed";
            return (
              <section
                key={path.id}
                aria-labelledby={`pathway-${path.id}`}
                className={cn(
                  "flex flex-col rounded-2xl border p-7 min-[380px]:p-8 sm:p-10",
                  primary ? "surface-inverse border-transparent" : "border-border bg-card",
                )}
                data-testid={`pathway-${path.id}`}
              >
                <p className="type-eyebrow">{path.label}</p>
                <h3
                  id={`pathway-${path.id}`}
                  className="mt-3 type-section-title text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)]"
                >
                  {path.title}
                </h3>
                <p className="mt-4 font-semibold text-heading">{path.audience}</p>
                <p className="mt-3 type-body text-muted-foreground">{path.description}</p>
                <ul className="mt-6 space-y-3">
                  {path.points.map((point) => (
                    <li key={point} className="flex gap-3 type-support">
                      <Check
                        className="mt-1 size-4 shrink-0 text-gv-gold"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <p
                  className={cn(
                    "mt-6 flex gap-3 rounded-lg border px-4 py-3 type-legal",
                    primary
                      ? "border-white/15 bg-white/5 text-white/85"
                      : "border-border bg-surface-alt text-gv-charcoal",
                  )}
                  data-testid={`pathway-note-${path.id}`}
                >
                  <Info
                    className={cn("mt-0.5 size-4 shrink-0", primary ? "text-gv-gold" : "text-gv-green")}
                    aria-hidden="true"
                  />
                  <span>{path.note}</span>
                </p>
                <div className="flex-1" />
                <CTAButton
                  href={path.cta.href}
                  variant={primary ? "accent" : "default"}
                  className="mt-8 self-start"
                >
                  {path.cta.label}
                </CTAButton>
              </section>
            );
          })}
        </div>
      </SectionContainer>

      {/* 5. Culture */}
      <SectionContainer id="culture" aria-labelledby="careers-culture" tone="green" spacing="spacious">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <SectionHeading
              id="careers-culture"
              eyebrow={culture.eyebrow}
              title={culture.title}
              description={culture.description}
            />
            <div
              className="mt-10 flex items-center gap-5 max-sm:flex-col max-sm:items-start"
              aria-hidden="true"
            >
              <Logo variant="mark-reversed" height={88} link={false} />
              <p className="font-serif text-xl text-white/90">{culture.motto}</p>
            </div>
          </div>
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {culture.points.map((point, i) => (
              <IconListItem
                key={point.title}
                icon={cultureIcons[i]!}
                title={point.title}
                description={point.description}
              />
            ))}
          </ul>
        </div>
      </SectionContainer>

      {/* 6. Recruitment inquiry form */}
      <SectionContainer id="apply" aria-labelledby="careers-apply" reveal={false}>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="careers-apply"
              eyebrow={apply.eyebrow}
              title={apply.title}
              description={apply.description}
            />
            <ul className="mt-8 space-y-4">
              {apply.privacy.map((line) => (
                <li key={line} className="flex gap-3 type-support text-muted-foreground">
                  <LockKeyhole className="mt-0.5 size-4 shrink-0 text-gv-green" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div>
            {featureFlags.careersApplication ? (
              <Suspense fallback={<RecruitmentForm />}>
                <RecruitmentFormWithParams />
              </Suspense>
            ) : (
              <div
                className="rounded-2xl border border-border bg-surface-alt p-8"
                data-testid="recruitment-unavailable"
              >
                <p className="type-body text-gv-charcoal">{apply.unavailable}</p>
                {company.recruitingEmail && (
                  <p className="mt-4 type-body">
                    <a
                      href={`mailto:${company.recruitingEmail}`}
                      className="font-semibold text-gv-green underline underline-offset-4"
                    >
                      {company.recruitingEmail}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </SectionContainer>

      {/* 7. Process */}
      <SectionContainer aria-labelledby="careers-process" tone="ivory" className="border-t border-border">
        <SectionHeading id="careers-process" eyebrow={process.eyebrow} title={process.title} />
        <ProcessTimeline
          className="mt-14"
          steps={process.steps.map((s, i) => ({ ...s, icon: processIcons[i] }))}
        />
        <p className="mt-12 max-w-3xl type-legal text-muted-foreground" data-testid="process-note">
          {process.note}
        </p>
      </SectionContainer>

      {/* 8. Final CTA */}
      <CTASection title={cta.title} description={cta.description} primary={cta.primary} />
    </>
  );
}

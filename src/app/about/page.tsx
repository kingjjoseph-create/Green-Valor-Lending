import {
  BookOpen,
  Building2,
  Compass,
  Eye,
  GraduationCap,
  HandHeart,
  House,
  Lightbulb,
  Medal,
  Megaphone,
  MessagesSquare,
  Scale,
  ShieldCheck,
  Sprout,
  Target,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

import { aboutContent } from "@/content/about";
import { images } from "@/content/images";
import { TeamSection } from "@/components/about/team-section";
import { Logo } from "@/components/layout/logo";
import { PageHero } from "@/components/layout/page-hero";
import { SectionContainer } from "@/components/layout/section-container";
import { CTAButton } from "@/components/shared/cta-button";
import { CTASection } from "@/components/shared/cta-section";
import { IconListItem } from "@/components/shared/icon-list-item";
import { SectionHeading } from "@/components/shared/section-heading";
import { keepTogether } from "@/lib/keep-together";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Green Valor Lending is a veteran-owned and operated Florida mortgage brokerage focused on residential and Non-QM financing, borrower education, and loan officer support.",
  path: "/about",
});

const focusIcons = [House, Building2, BookOpen, GraduationCap, TrendingUp];
const valueIcons = [Scale, HandHeart, Users, ShieldCheck, Sprout];
const leadershipIcons = [Target, Compass, Medal, UserRound, Users];
const borrowerIcons = [BookOpen, Lightbulb, UserRound, MessagesSquare, Eye];
const loIcons = [GraduationCap, Users, Megaphone, TrendingUp, Sprout];

export default function AboutPage() {
  const { hero, whoWeAre, mission, values, leadership, borrowers, loanOfficers, team, cta } = aboutContent;

  return (
    <>
      <PageHero
        breadcrumbs={[{ title: "About Us", href: "/about" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        image={images.aboutHero}
      />

      {/* 1. Who we are (no entrance animation: may sit at the fold) */}
      <SectionContainer aria-labelledby="about-who" reveal={false}>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading id="about-who" eyebrow={whoWeAre.eyebrow} title={whoWeAre.title} />
            <div className="mt-8 space-y-5 type-lead text-muted-foreground">
              {whoWeAre.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface-alt p-6 min-[380px]:p-8 sm:p-10">
            <p className="type-eyebrow">{whoWeAre.focusLabel}</p>
            <ul className="mt-6 space-y-6">
              {whoWeAre.focus.map((item, i) => (
                <IconListItem
                  key={item.title}
                  icon={focusIcons[i]}
                  title={item.title}
                  description={keepTogether(item.description)}
                />
              ))}
            </ul>
          </div>
        </div>
      </SectionContainer>

      {/* 2. Mission */}
      <section aria-labelledby="about-mission" className="border-y border-border bg-surface-alt">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center min-[380px]:px-5 sm:px-8 sm:py-24 lg:py-28">
          <h2 id="about-mission" className="type-eyebrow">
            {mission.eyebrow}
          </h2>
          <span className="mx-auto mt-6 block h-0.5 w-12 rounded-full bg-gv-gold" aria-hidden="true" />
          <p className="mt-8 font-serif text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)] leading-[1.25] font-semibold text-balance text-heading">
            {mission.statement}
          </p>
        </div>
      </section>

      {/* 3. Values */}
      <SectionContainer aria-labelledby="about-values">
        <SectionHeading id="about-values" eyebrow={values.eyebrow} title={values.title} />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {values.items.map((value, i) => {
            const Icon = valueIcons[i]!;
            return (
              <li
                key={value.title}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6"
              >
                <span
                  className="inline-flex size-11 items-center justify-center rounded-full bg-gv-green text-gv-gold"
                  aria-hidden="true"
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 type-card-title text-[1.5rem]">{value.title}</h3>
                <p className="mt-2 type-support text-muted-foreground">{value.description}</p>
              </li>
            );
          })}
        </ul>
      </SectionContainer>

      {/* 4. Veteran-owned leadership */}
      <SectionContainer aria-labelledby="about-leadership" tone="green" spacing="spacious">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <SectionHeading
              id="about-leadership"
              eyebrow={leadership.eyebrow}
              title={leadership.title}
              description={leadership.description}
            />
            <div
              className="mt-10 flex items-center gap-5 max-sm:flex-col max-sm:items-start"
              aria-hidden="true"
            >
              <Logo variant="mark-reversed" height={88} link={false} />
              <p className="font-serif text-xl text-white/90">{leadership.motto}</p>
            </div>
          </div>
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {leadership.qualities.map((q, i) => (
              <IconListItem
                key={q.title}
                icon={leadershipIcons[i]}
                title={q.title}
                description={q.description}
              />
            ))}
          </ul>
        </div>
      </SectionContainer>

      {/* 5 & 6. Commitments */}
      <SectionContainer aria-label="Our commitments" spacing="spacious">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {[
            { id: "about-borrowers", data: borrowers, icons: borrowerIcons, variant: "outline" as const },
            { id: "about-loan-officers", data: loanOfficers, icons: loIcons, variant: "default" as const },
          ].map(({ id, data, icons, variant }) => (
            <section key={id} aria-labelledby={id} className="flex flex-col">
              <SectionHeading
                id={id}
                eyebrow={data.eyebrow}
                title={data.title}
                description={data.description}
              />
              <ul className="mt-10 flex-1 space-y-6">
                {data.items.map((item, i) => (
                  <IconListItem
                    key={item.title}
                    icon={icons[i]}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </ul>
              <CTAButton href={data.cta.href} variant={variant} className="mt-10 self-start">
                {data.cta.label}
              </CTAButton>
            </section>
          ))}
        </div>
      </SectionContainer>

      {/* 7. Team: renders only when approved profiles exist (src/content/team.ts) */}
      <TeamSection eyebrow={team.eyebrow} title={team.title} />

      {/* Final CTA */}
      <CTASection title={cta.title} primary={cta.primary} secondary={cta.secondary} />
    </>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { homeContent } from "@/content/home";
import { Container } from "@/components/layout/container";
import { CTAButton } from "@/components/shared/cta-button";
import { HeroVideo } from "./hero-video";

/**
 * Full-width hero over a looping, muted brand video. A Deep Green (#02331D)
 * overlay tints the whole frame lightly, and deepens behind the copy so white
 * text keeps AA contrast on even the brightest frames.
 */
export function HomeHero() {
  const { hero } = homeContent;
  return (
    <section
      aria-labelledby="home-hero-title"
      className="surface-inverse relative isolate overflow-hidden border-b border-gv-gold/30"
    >
      <HeroVideo />
      {/* Light brand tint over the whole video */}
      <div className="absolute inset-0 -z-10 bg-gv-green/35" aria-hidden="true" />
      {/* Legibility scrim: stronger behind the text column, lighter toward the open side */}
      <div
        className="absolute inset-0 -z-10 bg-gv-green/55 lg:bg-transparent lg:bg-linear-to-r lg:from-gv-green/85 lg:via-gv-green/55 lg:via-50% lg:to-transparent"
        aria-hidden="true"
      />

      <Container className="flex min-h-[34rem] items-center py-16 sm:min-h-[38rem] sm:py-20 lg:min-h-[min(86vh,46rem)] lg:py-24">
        <div className="gv-fade-in max-w-2xl">
          {/* White eyebrow (gold text drops below AA on the brightest video frames); gold rule keeps the accent. */}
          <p className="flex items-center gap-3 type-eyebrow [--eyebrow:var(--gv-white)]">
            <span className="h-px w-8 shrink-0 bg-gv-gold" aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <h1 id="home-hero-title" className="mt-6 type-hero">
            {hero.title}
          </h1>
          <span className="mt-7 block h-0.5 w-14 rounded-full bg-gv-gold" aria-hidden="true" />
          <p className="mt-7 max-w-xl type-lead text-white/90">{hero.description}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <CTAButton href={hero.primaryCta.href} variant="inverse">
              {hero.primaryCta.label}
            </CTAButton>
            <CTAButton href={hero.secondaryCta.href} variant="accent" arrow={false}>
              {hero.secondaryCta.label}
            </CTAButton>
          </div>
          <p className="mt-8 type-support text-white/90">
            {hero.careersLink.lead}{" "}
            <Link
              href={hero.careersLink.href}
              className="group inline-flex items-center gap-1 rounded-sm font-semibold text-white underline decoration-gv-gold underline-offset-4 transition-colors hover:decoration-white"
            >
              {hero.careersLink.label}
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}

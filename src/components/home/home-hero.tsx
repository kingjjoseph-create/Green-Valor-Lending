import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { images } from "@/content/images";
import { homeContent } from "@/content/home";
import { Container } from "@/components/layout/container";
import { CTAButton } from "@/components/shared/cta-button";
import { ResponsiveImage } from "@/components/shared/responsive-image";
import { cn } from "@/lib/utils";

/** Editorial split hero: copy left, Florida residential photo right (stacks on mobile). */
export function HomeHero() {
  const { hero } = homeContent;
  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative overflow-hidden border-b border-border bg-surface-alt"
    >
      <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24 xl:py-28">
        <div className="gv-fade-in">
          <p className="type-eyebrow">{hero.eyebrow}</p>
          <h1 id="home-hero-title" className="mt-6 type-hero">
            {hero.title}
          </h1>
          <span className="mt-7 block h-0.5 w-14 rounded-full bg-gv-gold" aria-hidden="true" />
          <p className="mt-7 max-w-xl type-lead text-muted-foreground">{hero.description}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <CTAButton href={hero.primaryCta.href} variant="default">
              {hero.primaryCta.label}
            </CTAButton>
            <CTAButton href={hero.secondaryCta.href} variant="accent" arrow={false}>
              {hero.secondaryCta.label}
            </CTAButton>
          </div>
          <p className="mt-8 type-support text-muted-foreground">
            {hero.careersLink.lead}{" "}
            <Link
              href={hero.careersLink.href}
              className="group inline-flex items-center gap-1 rounded-sm font-semibold text-gv-green underline decoration-gv-gold/60 underline-offset-4 transition-colors hover:decoration-gv-green"
            >
              {hero.careersLink.label}
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </p>
        </div>
        <ResponsiveImage
          image={images.homeHero}
          aspect="4/3"
          priority
          sizes="(min-width: 1024px) 48vw, 100vw"
          className={cn(
            "gv-fade-in-delay shadow-[0_24px_60px_-28px_rgb(2_51_29/0.45)] lg:aspect-[4/5]",
            // Until a licensed photo exists, skip the empty panel on small screens.
            !images.homeHero && "max-lg:hidden",
          )}
        />
      </Container>
    </section>
  );
}

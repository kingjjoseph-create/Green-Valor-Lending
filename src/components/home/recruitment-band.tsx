import { homeContent } from "@/content/home";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { CTAButton } from "@/components/shared/cta-button";

/** Distinctive green recruiting section. */
export function RecruitmentBand() {
  const { recruitment } = homeContent;
  return (
    <section aria-labelledby="home-recruitment" className="surface-inverse relative overflow-hidden">
      <Container className="relative grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-[1.4fr_1fr] lg:py-32">
        <div className="gv-reveal">
          <p className="type-eyebrow">{recruitment.eyebrow}</p>
          <h2 id="home-recruitment" className="mt-6 type-hero">
            {recruitment.title}
          </h2>
          <p className="mt-7 max-w-xl type-lead text-muted-foreground">{recruitment.description}</p>
          <CTAButton href={recruitment.cta.href} variant="accent" className="mt-10">
            {recruitment.cta.label}
          </CTAButton>
        </div>
        <div className="hidden justify-center lg:flex" aria-hidden="true">
          <Logo variant="mark-reversed" height={260} link={false} className="opacity-95" />
        </div>
      </Container>
    </section>
  );
}

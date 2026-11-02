import { SectionContainer } from "@/components/layout/section-container";
import { CTAButton } from "./cta-button";

type CTALink = { label: string; href: string };

type CTASectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  primary: CTALink;
  secondary?: CTALink;
  tone?: "green" | "ivory";
};

/** Closing call-to-action band. */
export function CTASection({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  tone = "green",
}: CTASectionProps) {
  const dark = tone === "green";
  return (
    <SectionContainer tone={tone} spacing="default">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <p className="mb-4 type-eyebrow">{eyebrow}</p>}
          <h2 className="type-section-title">{title}</h2>
          {description && <p className="mt-5 type-lead text-muted-foreground">{description}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <CTAButton href={primary.href} variant="accent">
            {primary.label}
          </CTAButton>
          {secondary && (
            <CTAButton href={secondary.href} variant={dark ? "outlineInverse" : "outline"} arrow={false}>
              {secondary.label}
            </CTAButton>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}

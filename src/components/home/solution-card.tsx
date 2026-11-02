import { Check, type LucideIcon } from "lucide-react";

import { CTAButton } from "@/components/shared/cta-button";

type SolutionCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  listLabel: string;
  features: string[];
  cta: { label: string; href: string };
};

/** Large product card with example programs and its own CTA. */
export function SolutionCard({
  icon: Icon,
  title,
  description,
  listLabel,
  features,
  cta,
}: SolutionCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgb(2_51_29/0.04)] transition-[border-color,box-shadow] duration-300 hover:border-gv-gold hover:shadow-[0_18px_44px_-20px_rgb(2_51_29/0.28)] min-[380px]:p-8 sm:p-10">
      <span
        className="inline-flex size-14 items-center justify-center rounded-full bg-gv-green text-gv-gold"
        aria-hidden="true"
      >
        <Icon className="size-6" strokeWidth={1.75} />
      </span>
      <h3 className="mt-7 type-section-title text-[clamp(1.875rem,1.6rem+1vw,2.375rem)]">{title}</h3>
      <p className="mt-4 type-body text-muted-foreground">{description}</p>
      <div className="mt-7 flex-1 border-t border-border pt-6">
        <p className="type-support font-medium text-gv-charcoal">{listLabel}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 type-support">
              <Check className="mt-0.5 size-4 shrink-0 text-gv-gold-deep" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <CTAButton href={cta.href} variant="default" className="mt-9 self-start">
        {cta.label}
      </CTAButton>
    </article>
  );
}

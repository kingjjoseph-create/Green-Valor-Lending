import { Check, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ProgramCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
  /** Short highlighted note, e.g. the veteran-owned connection on VA loans. */
  note?: string;
  /** Fine print shown at the bottom of the card. */
  finePrint?: string;
  className?: string;
};

/** Educational loan program card: what it is, key considerations, optional note. */
export function ProgramCard({
  icon: Icon,
  title,
  description,
  points,
  note,
  finePrint,
  className,
}: ProgramCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgb(2_51_29/0.04)] min-[380px]:p-8",
        className,
      )}
    >
      <span
        className="inline-flex size-12 items-center justify-center rounded-full bg-gv-green text-gv-gold"
        aria-hidden="true"
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <h3 className="mt-6 type-card-title text-[1.75rem]">{title}</h3>
      <p className="mt-3 type-body text-muted-foreground">{description}</p>
      <div className="mt-6 border-t border-border pt-5">
        <p className="type-support font-medium text-gv-charcoal">Key considerations</p>
        <ul className="mt-3 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2.5 type-support text-muted-foreground">
              <Check className="mt-1 size-4 shrink-0 text-gv-gold-deep" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
      {note && (
        <p className="mt-6 border-l-2 border-gv-gold pl-4 font-serif text-lg leading-snug text-heading">
          {note}
        </p>
      )}
      {finePrint && <p className="mt-auto pt-6 type-legal text-muted-foreground">{finePrint}</p>}
    </article>
  );
}

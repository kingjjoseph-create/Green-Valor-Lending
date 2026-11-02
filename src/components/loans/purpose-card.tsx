import type { LucideIcon } from "lucide-react";

type Point = { title: string; description: string };

/** Comparison card (e.g. Purchase vs. Refinance) with titled points. */
export function PurposeCard({
  icon: Icon,
  title,
  description,
  points,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  points: Point[];
}) {
  return (
    <article className="h-full rounded-2xl border border-border bg-card p-6 min-[380px]:p-8 sm:p-10">
      <div className="flex items-center gap-4">
        <span
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-gv-green text-gv-gold"
          aria-hidden="true"
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="type-card-title text-[1.875rem]">{title}</h3>
          <p className="type-support text-muted-foreground">{description}</p>
        </div>
      </div>
      <ul className="mt-8 divide-y divide-border border-t border-border">
        {points.map((point) => (
          <li key={point.title} className="py-5">
            <p className="font-sans font-semibold text-gv-green">{point.title}</p>
            <p className="mt-1.5 type-support text-muted-foreground">{point.description}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}

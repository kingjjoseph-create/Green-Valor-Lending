import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** Compact icon + title + one-line description, used in homepage feature lists. */
export function IconListItem({
  icon: Icon,
  title,
  description,
  badge,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  className?: string;
}) {
  return (
    <li className={cn("flex gap-4", className)}>
      <span
        className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-gv-gold/60 text-(--eyebrow)"
        aria-hidden="true"
      >
        <Icon className="size-[1.125rem]" strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-serif text-xl leading-snug font-semibold text-heading">
          {title}
          {badge && (
            <span className="ml-2 inline-block translate-y-[-2px] rounded-full border border-border px-2 py-0.5 align-middle font-sans text-[0.6875rem] font-semibold tracking-wide text-muted-foreground uppercase">
              {badge}
            </span>
          )}
        </p>
        <p className="mt-1 type-support text-muted-foreground">{description}</p>
      </div>
    </li>
  );
}

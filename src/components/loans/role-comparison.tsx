import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type Role = { id: string; label: string; title: string; points: string[] };

/** Side-by-side "who does what": the broker's role next to the lender's. */
export function RoleComparison({ roles, className }: { roles: Role[]; className?: string }) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      {roles.map((role, i) => {
        const primary = i === 0;
        return (
          <article
            key={role.id}
            aria-labelledby={`role-${role.id}`}
            className={cn(
              "rounded-2xl p-6 min-[380px]:p-8 sm:p-10",
              primary ? "surface-inverse" : "border border-border bg-card",
            )}
          >
            <p className="type-eyebrow">{role.label}</p>
            <h3 id={`role-${role.id}`} className="mt-3 type-card-title">
              {role.title}
            </h3>
            <ul className="mt-6 space-y-4">
              {role.points.map((point) => (
                <li key={point} className="flex items-start gap-3 type-body">
                  <Check className="mt-1 size-4 shrink-0 text-(--eyebrow)" aria-hidden="true" />
                  <span className={primary ? "text-foreground" : "text-muted-foreground"}>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

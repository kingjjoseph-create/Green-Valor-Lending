import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ProcessStep = { title: string; description: string; icon?: LucideIcon };

/**
 * Numbered steps: vertical on small screens, horizontal from lg. With icons,
 * the circle shows the icon and a "Step N" label sits above the title.
 */
export function ProcessTimeline({ steps, className }: { steps: ProcessStep[]; className?: string }) {
  return (
    <ol
      className={cn(
        "relative grid gap-10 lg:grid-cols-[repeat(var(--steps),minmax(0,1fr))] lg:gap-8",
        className,
      )}
      style={{ "--steps": steps.length } as React.CSSProperties}
    >
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <li key={step.title} className="relative flex gap-5 lg:flex-col lg:gap-0">
            {/* connector */}
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute top-12 bottom-[-2.5rem] left-6 w-px bg-gv-gold/50 lg:top-6 lg:right-[-2rem] lg:bottom-auto lg:left-14 lg:h-px lg:w-auto"
              />
            )}
            <span
              aria-hidden="true"
              className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-gv-gold bg-background font-serif text-xl font-semibold text-heading lining-nums"
            >
              {Icon ? <Icon className="size-5 text-(--eyebrow)" strokeWidth={1.75} /> : i + 1}
            </span>
            <div className="lg:mt-6">
              {Icon && (
                <p className="type-eyebrow lining-nums" aria-hidden="true">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
              )}
              <h3 className={cn("type-card-title text-[1.375rem]", Icon && "mt-2")}>
                <span className="sr-only">Step {i + 1}:</span> {step.title}
              </h3>
              <p className="mt-2 type-support text-muted-foreground">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

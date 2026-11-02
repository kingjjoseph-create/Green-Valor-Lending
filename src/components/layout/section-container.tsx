import * as React from "react";

import { cn } from "@/lib/utils";
import { Container } from "./container";

type Tone = "default" | "ivory" | "green";
type Spacing = "default" | "compact" | "spacious";

const toneClass: Record<Tone, string> = {
  default: "bg-background",
  ivory: "bg-surface-alt",
  green: "surface-inverse",
};

const spacingClass: Record<Spacing, string> = {
  compact: "py-12 sm:py-16",
  default: "py-16 sm:py-20 lg:py-24",
  spacious: "py-20 sm:py-24 lg:py-32",
};

type SectionContainerProps = React.ComponentProps<"section"> & {
  tone?: Tone;
  spacing?: Spacing;
  /** Wrap children in the max-width Container (default true). */
  contained?: boolean;
  /** Subtle entrance animation as the section scrolls into view (default true). */
  reveal?: boolean;
  innerClassName?: string;
};

/** Standard page section: background tone, vertical rhythm, max width, entrance motion. */
export function SectionContainer({
  tone = "default",
  spacing = "default",
  contained = true,
  reveal = true,
  className,
  innerClassName,
  children,
  ...props
}: SectionContainerProps) {
  const inner = contained ? (
    <Container className={cn(reveal && "gv-reveal", innerClassName)}>{children}</Container>
  ) : (
    <div className={cn(reveal && "gv-reveal", innerClassName)}>{children}</div>
  );
  return (
    <section className={cn(toneClass[tone], spacingClass[spacing], className)} {...props}>
      {inner}
    </section>
  );
}

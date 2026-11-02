import * as React from "react";

import { disclosures, type DisclosureKey } from "@/content/disclosures";
import { cn } from "@/lib/utils";

type LegalDisclaimerProps = {
  /** Standard disclosure blocks to include, in order. */
  include?: DisclosureKey[];
  /** Page-specific fine print, rendered after the standard blocks. */
  children?: React.ReactNode;
  title?: string;
  /** "plain" for running fine print; "boxed" for a bordered note inside page content. */
  variant?: "plain" | "boxed";
  className?: string;
};

/** Fine print. Always at least 12px and AA contrast against its surface. */
export function LegalDisclaimer({
  include = [],
  children,
  title,
  variant = "plain",
  className,
}: LegalDisclaimerProps) {
  return (
    <aside
      aria-label={title ?? "Disclosures"}
      className={cn(
        "space-y-3 type-legal text-muted-foreground",
        variant === "boxed" && "rounded-lg border border-border bg-surface-alt/60 p-5 sm:p-6",
        className,
      )}
    >
      {title && (
        <p className="font-sans text-xs font-semibold tracking-wide text-foreground uppercase">{title}</p>
      )}
      {include.map((key) => (
        <p key={key}>{disclosures[key]}</p>
      ))}
      {children}
    </aside>
  );
}

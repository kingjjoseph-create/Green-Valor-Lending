import * as React from "react";
import { cn } from "@/lib/utils";

/** Decorative rule. Uses a plain element (no client JS) since it carries no semantics. */
function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="none"
      data-slot="separator"
      className={cn("h-px w-full shrink-0 bg-border", className)}
      {...props}
    />
  );
}

export { Separator };

import * as React from "react";
import { cn } from "@/lib/utils";

/** Site-wide max-width wrapper with consistent gutters. */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 min-[380px]:px-5 sm:px-8 lg:px-10", className)}
      {...props}
    />
  );
}

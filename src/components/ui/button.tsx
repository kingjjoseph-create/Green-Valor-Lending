import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md font-semibold tracking-wide whitespace-nowrap",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring",
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Primary Green, white text (14:1). */
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-gv-forest",
        /** Gold fill, charcoal text (4.8:1). Never white text on gold. */
        accent: "bg-accent text-accent-foreground shadow-sm hover:bg-[#cf9a22]",
        outline:
          "border border-primary/30 bg-transparent text-primary hover:border-primary hover:bg-primary/5",
        /** For dark green surfaces. */
        inverse: "bg-white text-gv-green shadow-sm hover:bg-gv-ivory",
        outlineInverse:
          "border border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10",
        ghost: "text-primary hover:bg-primary/5",
        link: "h-auto px-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-9 px-4 text-[0.8125rem]",
        lg: "h-12 px-7 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };

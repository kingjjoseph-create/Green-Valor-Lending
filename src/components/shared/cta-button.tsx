import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CTAButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  /** Show a trailing arrow that nudges on hover (default true for internal links). */
  arrow?: boolean;
  className?: string;
};

/** Link styled as a button. External URLs open in a new tab with an accessible hint. */
export function CTAButton({
  href,
  children,
  variant = "accent",
  size = "lg",
  arrow,
  className,
}: CTAButtonProps) {
  const external = /^https?:\/\//.test(href);
  const showArrow = arrow ?? !external;
  const classes = cn(buttonVariants({ variant, size }), className);
  const icon = external ? (
    <ExternalLink aria-hidden="true" />
  ) : showArrow ? (
    <ArrowRight
      className="transition-transform duration-200 group-hover/button:translate-x-0.5"
      aria-hidden="true"
    />
  ) : null;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        {icon}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
      {icon}
    </Link>
  );
}

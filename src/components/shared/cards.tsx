import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function IconBadge({ icon: Icon, tone = "light" }: { icon: LucideIcon; tone?: "light" | "dark" }) {
  return (
    <span
      className={cn(
        "inline-flex size-12 items-center justify-center rounded-full",
        tone === "light" ? "bg-gv-green text-gv-gold" : "bg-white/10 text-gv-gold",
      )}
      aria-hidden="true"
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </span>
  );
}

type ServiceCardProps = {
  icon?: LucideIcon;
  title: React.ReactNode;
  description: string;
  href: string;
  linkLabel?: string;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** A service/product entry point. The whole card is one link. */
export function ServiceCard({
  icon,
  title,
  description,
  href,
  linkLabel = "Learn more",
  headingLevel: Heading = "h3",
  className,
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col rounded-xl border border-border bg-card p-7 shadow-[0_1px_2px_rgb(2_51_29/0.04)] transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-gv-gold hover:shadow-[0_12px_32px_-12px_rgb(2_51_29/0.25)] sm:p-8",
        className,
      )}
    >
      {icon && <IconBadge icon={icon} />}
      <Heading className={cn("type-card-title", icon && "mt-6")}>{title}</Heading>
      <p className="mt-3 flex-1 type-body text-muted-foreground">{description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gv-green">
        {linkLabel}
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}

type FeatureCardProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  tone?: "light" | "dark";
  className?: string;
};

/** A benefit or capability. Not interactive. */
export function FeatureCard({ icon, title, description, tone = "light", className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "h-full rounded-xl p-7",
        tone === "light" ? "border border-border bg-card" : "border border-white/15 bg-white/[0.04]",
        className,
      )}
    >
      {icon && <IconBadge icon={icon} tone={tone} />}
      <h3 className={cn("type-card-title text-[1.375rem]", icon && "mt-5")}>{title}</h3>
      <p className="mt-3 type-support text-muted-foreground">{description}</p>
    </div>
  );
}

type ValueCardProps = {
  /** Short marker such as "01" or a single word. */
  marker?: string;
  title: string;
  description: string;
  className?: string;
};

/** A company value or principle, editorial style with a gold rule. */
export function ValueCard({ marker, title, description, className }: ValueCardProps) {
  return (
    <div className={cn("h-full border-t-2 border-gv-gold pt-6", className)}>
      {marker && <p className="type-eyebrow">{marker}</p>}
      <h3 className={cn("type-card-title", marker && "mt-3")}>{title}</h3>
      <p className="mt-3 type-body text-muted-foreground">{description}</p>
    </div>
  );
}

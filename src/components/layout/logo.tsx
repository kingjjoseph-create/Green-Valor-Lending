import Image from "next/image";
import Link from "next/link";

import { brandAssets, type LogoVariant } from "@/config/brand-assets";
import { company } from "@/config/company";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: LogoVariant;
  /** Rendered height in px. Width follows the file's aspect ratio. */
  height?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  /** Wrap in a link to the home page (default true). */
  link?: boolean;
};

/**
 * Official logo. Falls back to a text wordmark (marked data-placeholder)
 * only if the requested variant is not registered in brand-assets.ts.
 */
export function Logo({
  variant = "horizontal",
  height = 44,
  className,
  imageClassName,
  priority,
  link = true,
}: LogoProps) {
  const asset = brandAssets.available ? brandAssets.logos[variant] : undefined;

  const content = asset ? (
    <Image
      src={asset.src}
      alt={link ? "" : company.displayName}
      width={asset.width}
      height={asset.height}
      priority={priority}
      sizes={`${Math.ceil((height * asset.width) / asset.height)}px`}
      className={cn("w-auto max-w-none", imageClassName)}
      style={{ height }}
    />
  ) : (
    <span data-placeholder="logo" className="flex flex-col leading-none text-gv-green">
      <span className="font-serif text-[1.45rem] font-semibold tracking-tight">Green Valor</span>
      <span className="mt-0.5 text-[0.62rem] font-semibold tracking-[0.32em] text-gv-gold-deep uppercase">
        Lending
      </span>
    </span>
  );

  if (!link) return <span className={cn("inline-flex items-center", className)}>{content}</span>;

  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center rounded-sm", className)}
      aria-label={`${company.displayName} home`}
    >
      {content}
    </Link>
  );
}

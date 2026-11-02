import Image from "next/image";
import Link from "next/link";

import { brandAssets, type LogoVariant } from "@/config/brand-assets";
import { company } from "@/config/company";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: LogoVariant;
  /** Rendered height in px. Width follows the file's aspect ratio. */
  height?: number;
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
};

/**
 * Official logo when available; otherwise a text wordmark PLACEHOLDER.
 * The placeholder is plain typography, not a designed mark, and carries
 * data-placeholder so it is easy to find before launch.
 */
export function Logo({ variant = "horizontal", height = 40, tone = "dark", className, priority }: LogoProps) {
  const asset = brandAssets.available ? brandAssets.logos[variant] : undefined;

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center rounded-sm", className)}
      aria-label={`${company.displayName} home`}
    >
      {asset ? (
        <Image
          src={asset.src}
          alt={company.displayName}
          width={asset.width}
          height={asset.height}
          priority={priority}
          style={{ height, width: "auto" }}
        />
      ) : (
        <span
          data-placeholder="logo"
          className={cn("flex flex-col leading-none", tone === "dark" ? "text-gv-green" : "text-white")}
        >
          <span className="font-serif text-[1.45rem] font-semibold tracking-tight">Green Valor</span>
          <span
            className={cn(
              "mt-0.5 text-[0.62rem] font-semibold tracking-[0.32em] uppercase",
              tone === "dark" ? "text-gv-gold-deep" : "text-gv-gold-bright",
            )}
          >
            Lending
          </span>
        </span>
      )}
    </Link>
  );
}

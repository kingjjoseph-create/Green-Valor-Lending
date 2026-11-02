import Image from "next/image";

import type { ImageAsset } from "@/content/images";
import { cn } from "@/lib/utils";

const aspectClass = {
  "16/9": "aspect-video",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "4/5": "aspect-[4/5]",
} as const;

type ResponsiveImageProps = {
  image: ImageAsset | null | undefined;
  aspect?: keyof typeof aspectClass;
  /** Rendered widths per breakpoint, e.g. "(min-width: 1024px) 50vw, 100vw". */
  sizes?: string;
  priority?: boolean;
  /** Override the registry alt text; pass "" for a purely decorative image. */
  alt?: string;
  className?: string;
};

/**
 * Locally stored, licensed photo via next/image (responsive sizes, modern
 * formats, lazy loading). With no licensed photo yet, renders a neutral,
 * decorative brand panel instead of a stock or hotlinked image.
 */
export function ResponsiveImage({
  image,
  aspect = "4/3",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  alt,
  className,
}: ResponsiveImageProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-surface-alt", aspectClass[aspect], className)}>
      {image ? (
        <Image
          src={image.src}
          alt={alt ?? image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          data-placeholder="image"
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(135deg,var(--gv-ivory)_0%,#ebe3cf_55%,#e2d6bb_100%)]"
        >
          <div className="absolute inset-6 rounded-lg border border-gv-gold/30" />
          <div className="absolute right-6 bottom-6 left-6 h-px bg-gv-gold/40" />
        </div>
      )}
    </div>
  );
}

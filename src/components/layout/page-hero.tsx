import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/content/images";
import { ResponsiveImage } from "@/components/shared/responsive-image";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { Container } from "./container";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Breadcrumb trail after "Home". Omit on the home page. */
  breadcrumbs?: Crumb[];
  /** Buttons or links under the description. */
  actions?: React.ReactNode;
  /** Optional licensed photo; pass `null` to reserve the image column before a photo exists. */
  image?: ImageAsset | null;
  tone?: "ivory" | "green";
  /** "home" uses the larger hero type scale. */
  size?: "page" | "home";
};

/** Top-of-page hero: breadcrumbs, H1, supporting copy, CTAs, optional photo. */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  image,
  tone = "ivory",
  size = "page",
}: PageHeroProps) {
  const hasImage = image !== undefined;
  return (
    <div className={cn(tone === "green" ? "surface-inverse" : "border-b border-border bg-surface-alt")}>
      <Container
        className={cn(
          "py-14 sm:py-20",
          size === "home" && "py-20 sm:py-28 lg:py-32",
          hasImage && "grid items-center gap-12 lg:grid-cols-2 lg:gap-16",
        )}
      >
        <div className={cn("gv-fade-in", !hasImage && "max-w-3xl")}>
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-8" />}
          {eyebrow && <p className="mb-5 type-eyebrow">{eyebrow}</p>}
          <h1 className={size === "home" ? "type-hero" : "type-page-title"}>{title}</h1>
          {description && <p className="mt-6 max-w-2xl type-lead text-muted-foreground">{description}</p>}
          {actions && <div className="mt-9 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {hasImage && (
          <ResponsiveImage
            image={image}
            aspect="4/3"
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            // Until a licensed photo exists, the empty frame is shown on large screens only.
            className={cn("gv-fade-in-delay", !image && "max-lg:hidden")}
          />
        )}
      </Container>
    </div>
  );
}

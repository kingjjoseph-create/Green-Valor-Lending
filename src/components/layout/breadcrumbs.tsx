import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { getSiteUrl } from "@/lib/company";
import { cn } from "@/lib/utils";

export type Crumb = { title: string; href: string };

/**
 * Breadcrumb trail with BreadcrumbList structured data. "Home" is added
 * automatically; the last crumb is the current page.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const trail = [{ title: "Home", href: "/" }, ...items];
  const base = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      item: new URL(c.href, base).toString(),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={cn("type-support", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-muted-foreground">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={crumb.href} className="inline-flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {crumb.title}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.href}
                    className="rounded-sm underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {crumb.title}
                  </Link>
                  <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}

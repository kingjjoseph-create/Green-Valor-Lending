import type { MetadataRoute } from "next";

import { company } from "@/config/company";
import { getSiteUrl } from "@/lib/company";

/** Blocks all crawling until NEXT_PUBLIC_ALLOW_INDEXING=true at launch. */
export default function robots(): MetadataRoute.Robots {
  if (!company.features.allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", getSiteUrl()).toString(),
  };
}

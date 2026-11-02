import type { MetadataRoute } from "next";

import { indexingAllowed } from "@/lib/compliance";
import { getSiteUrl } from "@/lib/company";

/** Blocks all crawling until launch sign-off is complete AND NEXT_PUBLIC_ALLOW_INDEXING=true. */
export default function robots(): MetadataRoute.Robots {
  if (!indexingAllowed) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", getSiteUrl()).toString(),
  };
}

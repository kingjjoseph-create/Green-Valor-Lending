import type { MetadataRoute } from "next";

import { allRoutes } from "@/config/navigation";
import { getSiteUrl } from "@/lib/company";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return allRoutes.map((route) => ({
    url: new URL(route, base).toString(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}

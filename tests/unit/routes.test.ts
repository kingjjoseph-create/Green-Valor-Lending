import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { allRoutes, footerNav, mainNav, primaryCta } from "@/config/navigation";

const appDir = path.resolve(__dirname, "../../src/app");
const pageFor = (route: string) => path.join(appDir, route === "/" ? "" : route, "page.tsx");

describe("routes", () => {
  it("includes the eight required pages", () => {
    for (const r of [
      "/",
      "/residential-loans",
      "/non-qm",
      "/resources",
      "/about",
      "/careers",
      "/contact",
      "/get-started",
    ]) {
      expect(allRoutes).toContain(r);
    }
  });

  it("has a page file for every navigation link", () => {
    const links = [...mainNav, primaryCta, ...footerNav.flatMap((g) => g.items)].map((i) => i.href);
    for (const href of new Set([...links, ...allRoutes])) {
      expect(existsSync(pageFor(href)), `missing page for ${href}`).toBe(true);
    }
  });
});

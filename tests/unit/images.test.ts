import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { imageBriefs, images } from "@/content/images";

describe("image registry", () => {
  it("has a brief for every slot", () => {
    expect(Object.keys(imageBriefs).sort()).toEqual(Object.keys(images).sort());
  });

  it("only uses local, licensed images", () => {
    for (const [slot, img] of Object.entries(images)) {
      if (!img) continue;
      expect(img.src.startsWith("/images/"), slot).toBe(true);
      expect(img.alt.length, `${slot} alt`).toBeGreaterThan(0);
      expect(
        img.license.source && img.license.licenseName && img.license.acquired,
        `${slot} license`,
      ).toBeTruthy();
    }
  });

  it("does not allow remote image hosts (no hotlinking)", () => {
    const config = readFileSync(path.resolve(__dirname, "../../next.config.ts"), "utf8");
    expect(config).not.toMatch(/remotePatterns|domains\s*:/);
  });
});

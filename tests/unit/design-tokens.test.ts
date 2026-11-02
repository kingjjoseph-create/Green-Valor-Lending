import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { brand, contrastPairs, contrastRatio, forbiddenTextPairs, support } from "@/config/design-tokens";

const css = readFileSync(path.resolve(__dirname, "../../src/styles/globals.css"), "utf8").toLowerCase();

describe("design tokens", () => {
  it("globals.css declares every palette and support color", () => {
    for (const hex of [...Object.values(brand), ...Object.values(support)]) {
      expect(css, hex).toContain(hex.toLowerCase());
    }
  });

  it("keeps the official brand palette exactly", () => {
    expect(brand).toEqual({
      green: "#02331D",
      gold: "#BD870B",
      forest: "#14452F",
      ivory: "#F5F0E4",
      charcoal: "#202824",
      white: "#FFFFFF",
    });
  });

  it.each(contrastPairs)("$name meets $min:1", ({ fg, bg, min }) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
  });

  it.each(forbiddenTextPairs)("$name is correctly flagged as failing AA text contrast", ({ fg, bg }) => {
    expect(contrastRatio(fg, bg)).toBeLessThan(4.5);
  });

  it("computes known reference ratios", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
  });
});

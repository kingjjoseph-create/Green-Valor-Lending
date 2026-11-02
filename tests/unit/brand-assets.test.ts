import { existsSync } from "node:fs";
import path from "node:path";
import { imageSize } from "./image-size";
import { describe, expect, it } from "vitest";

import { brandAssets } from "@/config/brand-assets";

const publicDir = path.resolve(__dirname, "../../public");

describe("brand assets", () => {
  it("registers the official horizontal logo for navigation", () => {
    expect(brandAssets.available).toBe(true);
    expect(brandAssets.logos.horizontal).toBeDefined();
  });

  it("declares each logo's true intrinsic size so it is never distorted", () => {
    for (const [variant, asset] of Object.entries(brandAssets.logos)) {
      const file = path.join(publicDir, asset!.src);
      expect(existsSync(file), `${variant} file missing`).toBe(true);
      expect(imageSize(file), variant).toEqual({ width: asset!.width, height: asset!.height });
    }
  });
});

import { describe, expect, it } from "vitest";

import { isActive } from "@/components/layout/main-nav";

describe("isActive", () => {
  it("matches exact and nested paths but not prefixes of other words", () => {
    expect(isActive("/careers", "/careers")).toBe(true);
    expect(isActive("/resources/guide", "/resources")).toBe(true);
    expect(isActive("/non-qm-extra", "/non-qm")).toBe(false);
    expect(isActive("/about", "/")).toBe(false);
    expect(isActive("/", "/")).toBe(true);
  });
});

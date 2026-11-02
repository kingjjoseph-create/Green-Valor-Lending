import { describe, expect, it } from "vitest";

import { formatPhone, getContactChannels, getNmlsLine, hasValue, phoneHref } from "@/lib/company";

describe("company helpers", () => {
  it("hasValue rejects null, undefined and blank strings", () => {
    expect(hasValue(null)).toBe(false);
    expect(hasValue(undefined)).toBe(false);
    expect(hasValue("   ")).toBe(false);
    expect(hasValue("x")).toBe(true);
  });

  it("formats US phone numbers", () => {
    expect(formatPhone("3055550100")).toBe("(305) 555-0100");
    expect(formatPhone("+1 305 555 0100")).toBe("(305) 555-0100");
    expect(formatPhone("123")).toBe("123");
    expect(phoneHref("305-555-0100")).toBe("tel:+13055550100");
  });

  it("hides the NMLS line while the ID is pending", () => {
    expect(getNmlsLine()).toBeNull();
  });

  it("returns no contact channels when none are configured", () => {
    expect(getContactChannels()).toEqual([]);
  });
});

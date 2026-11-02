import { describe, expect, it } from "vitest";

import { CONTACT_FIELD_ORDER, CONTACT_LIMITS, CONTACT_REASONS, validateContact } from "@/lib/contact/schema";
import { fillTimeOk } from "@/lib/contact/spam";
import { validContact } from "./fixtures/contact";

const errorsFor = (input: Record<string, unknown>) => {
  const r = validateContact(input);
  return r.ok ? {} : r.errors;
};

describe("validateContact", () => {
  it("rejects a blank form with a message for every field", () => {
    expect(Object.keys(errorsFor({})).sort()).toEqual([...CONTACT_FIELD_ORDER].sort());
  });

  it("accepts a valid inquiry and normalizes it", () => {
    const r = validateContact({ ...validContact, email: " Pat@Example.com " });
    expect(r.ok && r.data.email).toBe("pat@example.com");
  });

  it.each(["pat", "pat@", "pat@example", "pat @example.com", "@example.com"])(
    "rejects invalid email %s",
    (email) => {
      expect(errorsFor({ ...validContact, email }).email).toMatch(/valid email/i);
    },
  );

  it.each(["555-0100", "813-555-01", "call me", "813 555 0100 ext 5", "1".repeat(16), "(813) 555-0100x"])(
    "rejects invalid phone %s",
    (phone) => {
      expect(errorsFor({ ...validContact, phone }).phone).toMatch(/valid phone/i);
    },
  );

  it.each(["8135550100", "+1 (813) 555-0100", "813.555.0100"])("accepts phone %s", (phone) => {
    expect(validateContact({ ...validContact, phone }).ok).toBe(true);
  });

  it("rejects extremely long and too-short messages", () => {
    expect(
      errorsFor({ ...validContact, message: "x".repeat(CONTACT_LIMITS.messageMax + 1) }).message,
    ).toMatch(/2,000 characters or fewer/);
    expect(errorsFor({ ...validContact, message: "x".repeat(100_000) }).message).toBeDefined();
    expect(errorsFor({ ...validContact, message: "Hi" }).message).toMatch(/at least/);
    expect(validateContact({ ...validContact, message: "x".repeat(CONTACT_LIMITS.messageMax) }).ok).toBe(
      true,
    );
  });

  it("offers the five reasons and refuses career inquiries here", () => {
    expect(CONTACT_REASONS.map((r) => r.label)).toEqual([
      "Residential Mortgage Inquiry",
      "Non-QM Mortgage Inquiry",
      "General Question",
      "Career Opportunity",
      "Other",
    ]);
    expect(errorsFor({ ...validContact, reason: "career" }).reason).toMatch(/Careers page/);
    expect(errorsFor({ ...validContact, reason: "refinance-now" }).reason).toBeDefined();
  });

  it("requires consent", () => {
    expect(errorsFor({ ...validContact, consent: false }).consent).toBeDefined();
  });
});

describe("fillTimeOk", () => {
  it("rejects instant, missing, or absurd fill times", () => {
    expect(fillTimeOk(undefined)).toBe(false);
    expect(fillTimeOk(200)).toBe(false);
    expect(fillTimeOk("abc")).toBe(false);
    expect(fillTimeOk(10 * 24 * 60 * 60 * 1000)).toBe(false);
    expect(fillTimeOk(5000)).toBe(true);
  });
});

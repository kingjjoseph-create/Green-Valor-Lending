import { describe, expect, it } from "vitest";

import {
  FLORIDA_ONLY_MESSAGE,
  GOALS,
  looksSensitive,
  parseAmount,
  STEPS,
  validateFields,
  validateInquiry,
} from "@/lib/inquiry/schema";
import { validInquiryBody as valid } from "./fixtures/inquiry";

const errorsFor = (input: Record<string, unknown>) => {
  const r = validateInquiry(input);
  return r.ok ? {} : r.errors;
};

describe("Get Started inquiry validation", () => {
  it("has the five financing goals and four steps", () => {
    expect(GOALS.map((g) => g.label)).toEqual([
      "Purchase a Home",
      "Refinance an Existing Mortgage",
      "Explore a Non-QM Mortgage",
      "Finance an Investment Property",
      "Other Mortgage Inquiry",
    ]);
    expect(STEPS.map((s) => s.title)).toEqual([
      "Financing goal",
      "Property details",
      "Financing details",
      "Contact information",
    ]);
  });

  it.each(GOALS.map((g) => g.value))("accepts goal %s", (goal) => {
    expect(validateInquiry({ ...valid, goal }).ok).toBe(true);
  });

  it("parses amounts", () => {
    expect(
      validateInquiry(valid).ok &&
        (validateInquiry(valid) as { data: { estimatedValue: number } }).data.estimatedValue,
    ).toBe(425000);
    expect(parseAmount("$1,250,000")).toBe(1250000);
    expect(parseAmount("")).toBeNull();
    expect(parseAmount("12abc")).toBeNaN();
  });

  it("requires every required field on each step", () => {
    const empty = {};
    expect(Object.keys(validateFields(empty, STEPS[0]!.fields))).toEqual(["goal"]);
    expect(Object.keys(validateFields(empty, STEPS[1]!.fields)).sort()).toEqual(
      ["location", "occupancy", "propertyState", "propertyType"].sort(),
    );
    expect(Object.keys(validateFields(empty, STEPS[2]!.fields))).toEqual(["timeline"]);
    expect(Object.keys(validateFields(empty, STEPS[3]!.fields)).sort()).toEqual(
      ["consent", "contactMethod", "email", "fullName", "phone"].sort(),
    );
  });

  it("treats price, financing amount, notes and message as optional", () => {
    const r = validateInquiry({ ...valid, estimatedValue: "", loanAmount: "", notes: "", message: "" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.estimatedValue).toBeNull();
      expect(r.data.loanAmount).toBeNull();
    }
  });

  it("accepts Florida only", () => {
    expect(errorsFor({ ...valid, propertyState: "GA" }).propertyState).toBe(FLORIDA_ONLY_MESSAGE);
    expect(errorsFor({ ...valid, propertyState: "TX" }).propertyState).toMatch(/Florida only/);
    expect(errorsFor({ ...valid, propertyState: "ZZ" }).propertyState).toMatch(/from the list/);
    expect(validateInquiry({ ...valid, propertyState: "fl" }).ok).toBe(true);
  });

  it.each([
    ["estimatedValue", "abc", /dollar amount/],
    ["estimatedValue", "-5000", /dollar amount/],
    ["estimatedValue", "1e6", /dollar amount/],
    ["estimatedValue", "500", /at least/],
    ["estimatedValue", "999999999999", /too high/],
    ["loanAmount", "12.345", /dollar amount/],
    ["loanAmount", "Infinity", /dollar amount/],
  ])("rejects invalid %s %s", (field, value, message) => {
    expect((errorsFor({ ...valid, [field]: value }) as Record<string, string>)[field]).toMatch(message);
  });

  it("rejects a financing amount above the price or value", () => {
    expect(errorsFor({ ...valid, estimatedValue: "300000", loanAmount: "350000" }).loanAmount).toMatch(
      /can't be more/,
    );
  });

  it("rejects invalid email and phone, and requires consent", () => {
    const e = errorsFor({ ...valid, email: "morgan@", phone: "555-0142", consent: false });
    expect(e.email).toMatch(/valid email/);
    expect(e.phone).toMatch(/valid phone/);
    expect(e.consent).toBeDefined();
  });

  it("refuses sensitive numbers in free text", () => {
    expect(looksSensitive("SSN 123-45-6789")).toBe(true);
    expect(looksSensitive("acct 000123456789")).toBe(true);
    expect(looksSensitive("call me at 813-555-0142 about a $450,000 condo")).toBe(false);
    expect(errorsFor({ ...valid, notes: "my ssn is 123456789" }).notes).toMatch(/Social Security/);
    expect(errorsFor({ ...valid, message: "card 4111 1111 1111 1111" }).message).toMatch(/card number/);
  });

  it("ignores unknown keys and enforces length limits", () => {
    expect(validateInquiry({ ...valid, ssn: "123-45-6789", dob: "1990-01-01" }).ok).toBe(true);
    expect(errorsFor({ ...valid, notes: "x".repeat(1001) }).notes).toMatch(/or fewer/);
  });
});

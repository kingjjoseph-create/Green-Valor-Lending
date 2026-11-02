import { describe, expect, it } from "vitest";

import { FIELD_ORDER, LIMITS, PATHWAYS, validateRecruitment } from "@/lib/recruitment/schema";
import { validInquiry } from "./fixtures/recruitment";

const errorsFor = (input: Record<string, unknown>) => {
  const r = validateRecruitment(input);
  return r.ok ? {} : r.errors;
};

describe("validateRecruitment", () => {
  it("rejects an empty submission with a message for every required field", () => {
    const errors = errorsFor({});
    expect(Object.keys(errors).sort()).toEqual(FIELD_ORDER.filter((f) => f !== "nmlsId").sort());
  });

  it("accepts a complete inquiry and normalizes values", () => {
    const r = validateRecruitment({
      ...validInquiry,
      email: "  Jordan@Example.COM ",
      fullName: " Jordan   Rivera ",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.email).toBe("jordan@example.com");
      expect(r.data.fullName).toBe("Jordan Rivera");
    }
  });

  it.each(["jordan", "jordan@", "jordan@example", "jordan @example.com", "@example.com", "a@b.c"])(
    "rejects invalid email %s",
    (email) => {
      expect(errorsFor({ ...validInquiry, email }).email).toMatch(/valid email/i);
    },
  );

  it("keeps NMLS ID optional but numeric when given", () => {
    expect(validateRecruitment({ ...validInquiry, nmlsId: "" }).ok).toBe(true);
    expect(validateRecruitment({ ...validInquiry, nmlsId: undefined }).ok).toBe(true);
    const r = validateRecruitment({ ...validInquiry, nmlsId: "#1234567" });
    expect(r.ok && r.data.nmlsId).toBe("1234567");
    expect(errorsFor({ ...validInquiry, nmlsId: "ABC123" }).nmlsId).toMatch(/numbers only/i);
    expect(errorsFor({ ...validInquiry, nmlsId: "1".repeat(LIMITS.nmlsId + 1) }).nmlsId).toBeDefined();
  });

  it("validates phone numbers", () => {
    expect(validateRecruitment({ ...validInquiry, phone: "+1 813.555.0142" }).ok).toBe(true);
    expect(errorsFor({ ...validInquiry, phone: "555-0142" }).phone).toBeDefined();
    expect(errorsFor({ ...validInquiry, phone: "call me maybe" }).phone).toBeDefined();
  });

  it("accepts only the four career pathways", () => {
    expect(PATHWAYS.map((p) => p.label)).toEqual([
      "Licensed Mortgage Loan Originator",
      "Aspiring Mortgage Loan Originator",
      "Entrepreneur / Career Transition",
      "Other Professional Opportunity",
    ]);
    for (const p of PATHWAYS)
      expect(validateRecruitment({ ...validInquiry, pathway: p.value }).ok).toBe(true);
    expect(errorsFor({ ...validInquiry, pathway: "borrower" }).pathway).toBeDefined();
  });

  it("rejects unknown select values", () => {
    const e = errorsFor({ ...validInquiry, experience: "10", licensingStatus: "x", contactMethod: "fax" });
    expect(Object.keys(e).sort()).toEqual(["contactMethod", "experience", "licensingStatus"]);
  });

  it("requires consent", () => {
    expect(errorsFor({ ...validInquiry, consent: false }).consent).toBeDefined();
    expect(errorsFor({ ...validInquiry, consent: "yes please" }).consent).toBeDefined();
    expect(validateRecruitment({ ...validInquiry, consent: "on" }).ok).toBe(true);
  });

  it("enforces length limits", () => {
    expect(errorsFor({ ...validInquiry, why: "Too short" }).why).toMatch(/at least/);
    expect(errorsFor({ ...validInquiry, why: "x".repeat(LIMITS.whyMax + 1) }).why).toMatch(/or fewer/);
    expect(errorsFor({ ...validInquiry, fullName: "x".repeat(LIMITS.fullName + 1) }).fullName).toBeDefined();
  });

  it("ignores non-string values and strips control characters", () => {
    expect(errorsFor({ ...validInquiry, fullName: { $ne: "" } }).fullName).toBeDefined();
    const r = validateRecruitment({ ...validInquiry, location: "Tampa\u0000\u0007 FL" });
    expect(r.ok && r.data.location).toBe("Tampa FL");
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";

import approvals from "@/config/compliance-approvals.json";
import {
  getReleaseBlockers,
  isApproved,
  isIsoDate,
  isLicenseVerified,
  isNmlsId,
  type Approvals,
} from "@/lib/release-blockers.mjs";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

const ok = { approved: true, reviewer: "Jane Doe, compliance counsel", date: "2026-12-01" };
const allApproved: Approvals = {
  licenseVerification: { status: "active", verifiedOn: "2026-12-01", reviewer: "Jane Doe" },
  legalContent: ok,
  privacyPractices: ok,
  formConsent: ok,
  loanProducts: ok,
  disclosures: ok,
  advertisingReview: ok,
};
const allFacts = { nmlsId: "1234567", stateLicenseNumber: "MBR1234", phone: "8135550100", email: null };

describe("release blocker rules", () => {
  it("treats only numeric values as NMLS IDs", () => {
    for (const bad of ["Pending", "pending", "TBD", "", "  ", "NMLS #123", null, undefined])
      expect(isNmlsId(bad)).toBe(false);
    expect(isNmlsId("1234567")).toBe(true);
  });

  it("requires a real YYYY-MM-DD date", () => {
    expect(isIsoDate("2026-11-02")).toBe(true);
    for (const bad of ["2026-02-30", "11/02/2026", "2026-1-2", "", null]) expect(isIsoDate(bad)).toBe(false);
  });

  it("counts an approval only with a named reviewer and a date", () => {
    expect(isApproved(ok)).toBe(true);
    expect(isApproved({ ...ok, reviewer: null })).toBe(false);
    expect(isApproved({ ...ok, reviewer: " " })).toBe(false);
    expect(isApproved({ ...ok, date: null })).toBe(false);
    expect(isApproved({ ...ok, approved: false })).toBe(false);
  });

  it("never treats a pending NMLS ID or pending status as an active license", () => {
    const lv = allApproved.licenseVerification!;
    expect(isLicenseVerified(lv, allFacts)).toBe(true);
    expect(isLicenseVerified({ ...lv, status: "pending" }, allFacts)).toBe(false);
    expect(isLicenseVerified(lv, { ...allFacts, nmlsId: "Pending" })).toBe(false);
    expect(isLicenseVerified(lv, { ...allFacts, stateLicenseNumber: null })).toBe(false);
    expect(isLicenseVerified({ ...lv, verifiedOn: null }, allFacts)).toBe(false);
    expect(isLicenseVerified({ ...lv, reviewer: null }, allFacts)).toBe(false);
  });

  it("covers every launch blocker the business listed, and clears only when all are met", () => {
    const ids = getReleaseBlockers({}, {}).map((b) => b.id);
    expect(ids).toEqual([
      "license-unverified",
      "identification-missing",
      "company-contact-missing",
      "legalContent-unapproved",
      "privacyPractices-unapproved",
      "formConsent-unapproved",
      "loanProducts-unapproved",
      "disclosures-unapproved",
      "advertisingReview-unapproved",
    ]);
    expect(getReleaseBlockers(allApproved, allFacts)).toEqual([]);
    expect(getReleaseBlockers(allApproved, { ...allFacts, phone: null }).map((b) => b.id)).toEqual([
      "company-contact-missing",
    ]);
  });

  it("ships with every sign-off still open (nothing is pre-approved in the repo)", () => {
    expect(getReleaseBlockers(approvals as Approvals, allFacts).length).toBe(7);
    expect(approvals.licenseVerification.status).toBe("pending");
  });
});

describe("publication guard", () => {
  it("keeps the site unindexed and the license unverified, even with the indexing flag on", async () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    vi.stubEnv("NEXT_PUBLIC_COMPANY_NMLS_ID", "1234567");
    vi.stubEnv("NEXT_PUBLIC_FL_LICENSE_NUMBER", "MBR1234");
    const c = await import("@/lib/compliance");
    expect(c.licenseVerified).toBe(false);
    expect(c.launchReady).toBe(false);
    expect(c.indexingAllowed).toBe(false);
    const robots = (await import("@/app/robots")).default();
    expect(robots.rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("fails a public-launch build while blockers remain", async () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    await expect(import("../../next.config")).rejects.toThrow(/Public launch blocked by 9 release blocker/);
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "");
    vi.stubEnv("LAUNCH_CHECK", "strict");
    await expect(import("../../next.config")).rejects.toThrow(/Public launch blocked/);
  });

  it("lets preview builds through, with redirects from the old legal URLs", async () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "");
    vi.stubEnv("LAUNCH_CHECK", "");
    const config = (await import("../../next.config")).default;
    const redirects = await config.redirects!();
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: "/privacy", destination: "/privacy-policy", permanent: true }),
        expect.objectContaining({ source: "/terms", destination: "/terms-of-use", permanent: true }),
        expect.objectContaining({
          source: "/complaints",
          destination: "/consumer-complaints",
          permanent: true,
        }),
      ]),
    );
  });
});

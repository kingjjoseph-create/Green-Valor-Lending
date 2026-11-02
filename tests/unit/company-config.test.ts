import { describe, expect, it } from "vitest";

import { company } from "@/config/company";
import { disclosures } from "@/content/disclosures";

describe("company config", () => {
  it("uses the approved legal and display names", () => {
    expect(company.legalName).toBe("Green Valor Lending LLC");
    expect(company.displayName).toBe("Green Valor Lending");
  });

  it("serves Florida only", () => {
    expect(company.licensedStates.map((s) => s.code)).toEqual(["FL"]);
  });

  it("publishes only the two approved product categories", () => {
    expect(company.productCategories.map((p) => p.id)).toEqual(["residential", "non-qm"]);
  });

  it("never enables published rates", () => {
    expect(company.features.publishRates).toBe(false);
  });

  it("keeps the approved brand messaging verbatim", () => {
    expect(company.brand).toEqual({
      tagline: "Built on Service. Driven by Valor.",
      borrowerMessage: "Your Home. Our Commitment.",
      loanOfficerMessage: "Your Growth. Our Commitment.",
      recruitmentMessage: "Discipline. Ambition. Opportunity.",
      positioning: "Veteran-Owned. Service-Driven. Growth-Focused.",
    });
  });

  it("contains no placeholder strings that could leak to public pages", () => {
    const serialized = JSON.stringify({ company, disclosures }).toLowerCase();
    for (const bad of ["undefined", "todo", "tbd", "lorem", "xxx", "555-"]) {
      expect(serialized).not.toContain(bad);
    }
  });
});

describe("compliance language", () => {
  const copy = [
    company.description,
    ...company.productCategories.map((p) => p.summary),
    ...Object.values(disclosures),
  ]
    .join(" ")
    .toLowerCase();

  it("never promises approval", () => {
    for (const phrase of [
      "guaranteed approval",
      "approval guaranteed",
      "you will be approved",
      "pre-approved",
    ]) {
      expect(copy).not.toContain(phrase);
    }
  });

  it("never describes Green Valor as the lender that funds or underwrites", () => {
    expect(copy).not.toMatch(/we (fund|underwrite|originate and fund)/);
    expect(disclosures.brokerStatement).toMatch(/not a mortgage lender/);
  });
});

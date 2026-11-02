import { describe, expect, it } from "vitest";

import { resourcesContent as c } from "@/content/resources";

const allCopy = JSON.stringify(c).toLowerCase();

describe("resources page content", () => {
  it("uses the approved copy and routes", () => {
    expect(c.hero.title).toBe("Knowledge Builds Confidence.");
    expect(c.hero.description).toBe(
      "Explore straightforward mortgage education and tools designed to help you make informed financing decisions.",
    );
    expect(c.cta.title).toBe("Questions About Your Mortgage Options?");
    expect(c.cta.primary).toEqual({ label: "Speak With Our Team", href: "/contact" });
    expect(c.loanOptions.cards.map((x) => [x.title, x.href])).toEqual([
      ["Residential Mortgage Programs", "/residential-loans"],
      ["Alternative Non-QM Financing", "/non-qm"],
    ]);
  });

  it("covers the requested basics and process steps", () => {
    expect(c.basics.items.map((i) => i.question)).toEqual([
      "What is a mortgage broker?",
      "Prequalification versus preapproval",
      "Fixed versus adjustable interest rates",
      "Down payments",
      "Mortgage insurance",
      "Debt-to-income ratio",
      "Closing costs",
      "Escrow accounts",
    ]);
    expect(c.process.steps.map((s) => s.title)).toEqual([
      "Consultation",
      "Mortgage Application",
      "Document Review",
      "Lender Underwriting",
      "Closing",
    ]);
    expect(c.process.note).toMatch(/can vary by loan program, lender/);
  });

  it("contains no rates, thresholds, timelines or approval promises", () => {
    for (const pattern of [
      /\d+(\.\d+)?\s*%/,
      /\bapr\b/,
      /\b[3-8]\d\d\b(?! *(percent|,))/, // credit scores
      /\b\d+\s*(days?|weeks?)\b/, // closing timelines ("three business days" is spelled out TRID timing)
      /guaranteed|we guarantee/,
      /\bwe (approve|fund|underwrite|lend)\b/,
      /\b(lowest|best|#1|fastest)\b/,
      /current rates are|today's rates/,
    ]) {
      expect(allCopy, String(pattern)).not.toMatch(pattern);
    }
  });

  it("says preapproval is not a commitment to lend", () => {
    const pre = c.basics.items.find((i) => /preapproval/i.test(i.question))!;
    expect(pre.answer).toMatch(/neither one is a final loan approval or a commitment to lend/i);
  });
});

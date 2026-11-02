import { describe, expect, it } from "vitest";

import { nonQmContent as c } from "@/content/non-qm";

const allCopy = JSON.stringify(c).toLowerCase();

describe("Non-QM page: approved copy", () => {
  it("uses the approved hero and CTA copy verbatim", () => {
    expect(c.hero.eyebrow.toUpperCase()).toBe("ALTERNATIVE MORTGAGE SOLUTIONS");
    expect(c.hero.title).toBe("Different Financial Paths. More Ways Forward.");
    expect(c.hero.description).toBe(
      "Explore mortgage options designed for borrowers with unique income documentation, self-employment, or real estate investment circumstances.",
    );
    expect(c.hero.cta).toEqual({ label: "Discuss Non-QM Options", href: "/contact" });
    expect(c.cta.title).toBe("Your Financial Situation Deserves Individual Attention.");
    expect(c.cta.primary).toEqual({ label: "Explore Your Options", href: "/get-started" });
  });

  it("has the requested programs, scenarios, process steps and FAQs", () => {
    expect(c.programs.cards.map((p) => p.title)).toEqual([
      "Bank Statement Loans",
      "DSCR Loans",
      "1099 Borrower Programs",
    ]);
    expect(c.programs.other.title).toBe("Other Alternative Documentation Options");
    expect(c.scenarios.items.map((s) => s.title)).toEqual([
      "Business owners",
      "Self-employed professionals",
      "Independent contractors",
      "Real estate investors",
      "Nontraditional documentation",
    ]);
    expect(c.process.steps.map((s) => s.title)).toEqual([
      "Initial Consultation",
      "Financial Scenario Review",
      "Program Exploration",
      "Secure Application",
      "Lender Underwriting and Closing Process",
    ]);
    expect(c.faq.items.map((f) => f.question)).toEqual([
      "What does Non-QM mean?",
      "Can self-employed borrowers qualify?",
      "What are bank statement mortgage programs?",
      "How do DSCR loans work?",
      "Is a Non-QM loan the same as a no-documentation loan?",
      "Are Non-QM programs available for primary residences and investment properties?",
    ]);
  });
});

describe("Non-QM page: compliance", () => {
  it("states the required clarifications about Non-QM", () => {
    const facts = c.overview.facts.map((f) => f.description).join(" ");
    expect(facts).toMatch(/underwritten by the lender/);
    expect(facts).toMatch(/requirements differ/);
    expect(facts).toMatch(/other records/);
    expect(facts).toMatch(/does not mean no documentation or no income verification/);
    expect(c.overview.paragraphs.join(" ")).toMatch(/not better or worse than a traditional mortgage/);
  });

  it("never says income is not verified, and says terms may differ", () => {
    // The only mention of "no income verification" must be the denial in the overview.
    expect(allCopy.match(/no income verification/g)).toHaveLength(1);
    expect(allCopy).toContain("does not mean no documentation or no income verification");
    expect(allCopy).not.toMatch(
      /without (verifying|verification of) income|income (is )?not verified|stated income/,
    );
    const terms = c.comparison.rows.find((r) => /rates/i.test(r.topic))!;
    expect(terms.nonQm).toMatch(/may differ/i);
    expect(c.comparison.rows.find((r) => r.topic === "Income documentation")!.nonQm).toMatch(/verified/);
  });

  it("does not present unverified programs or automatic availability", () => {
    expect(c.programs.other.verifiedPrograms).toEqual([]);
    expect(c.programs.description).toMatch(/availability/i);
    expect(c.disclaimer).toMatch(/subject to availability/i);
  });

  it("contains no thresholds, rates, approval promises or superiority claims", () => {
    for (const pattern of [
      /\d+(\.\d+)?\s*(%|percent)/,
      /\$\s?\d/,
      /\b\d+\s*(months?|years?)\b/, // e.g. "12 months of statements"
      /\b(dscr|ratio) (of|at least|above|below) \d/,
      /\b[3-8]\d\d\b/, // credit score thresholds
      /\bapr\b/,
      /guaranteed|we guarantee/,
      /\bwe (approve|fund|underwrite|lend)\b/,
      /\b(lowest|best|#1|number one|fastest|easiest|easy approval|easier to qualify)\b/,
      /\bwill (be )?(approve|qualify)/,
      /relaxed|lenient|loophole/,
    ]) {
      expect(allCopy, String(pattern)).not.toMatch(pattern);
    }
  });

  it("puts underwriting and the credit decision with the lender", () => {
    expect(c.process.steps.at(-1)!.description).toMatch(
      /lender underwrites your application and makes the credit decision/i,
    );
  });
});

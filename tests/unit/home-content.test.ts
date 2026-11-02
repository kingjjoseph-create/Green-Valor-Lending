import { describe, expect, it } from "vitest";

import { homeContent } from "@/content/home";

const allCopy = JSON.stringify(homeContent).toLowerCase();

describe("homepage content: approved copy", () => {
  it("uses the approved hero copy verbatim", () => {
    expect(homeContent.hero.eyebrow).toBe("Veteran-Owned & Operated | Florida Mortgage Brokerage");
    expect(homeContent.hero.title).toBe("Built on Service. Driven by Valor.");
    expect(homeContent.hero.description).toBe(
      "Personalized residential and Non-QM mortgage solutions, guided by integrity, education, and a commitment to those we serve.",
    );
    expect(homeContent.hero.primaryCta.label).toBe("Explore Loan Options");
    expect(homeContent.hero.secondaryCta).toEqual({ label: "Get Started", href: "/get-started" });
    expect(homeContent.hero.careersLink.href).toBe("/careers");
  });

  it("uses the approved section headings", () => {
    expect(homeContent.whoWeAre.title).toBe("Rooted in Service. Committed to Your Future.");
    expect(homeContent.solutions.title).toBe("Mortgage Solutions Designed Around You.");
    expect(homeContent.why.title).toBe("More Than a Mortgage. A Commitment to Service.");
    expect(homeContent.process.title).toBe("A Clear Path Forward.");
    expect(homeContent.education.title).toBe("Confidence Begins With Understanding.");
    expect(homeContent.loanOfficers.title).toBe("Supporting the Professionals Behind Every Mortgage.");
    expect(homeContent.recruitment.title).toBe("Discipline. Ambition. Opportunity.");
    expect(homeContent.finalCta.title).toBe("Your Next Chapter Starts Here.");
  });

  it("links every CTA to the right route", () => {
    expect(homeContent.solutions.cards.map((c) => c.cta.href)).toEqual(["/residential-loans", "/non-qm"]);
    expect(homeContent.education.cta.href).toBe("/resources");
    expect(homeContent.loanOfficers.cta.href).toBe("/careers");
    expect(homeContent.recruitment.cta.href).toBe("/careers");
    expect(homeContent.finalCta.primary.href).toBe("/get-started");
    expect(homeContent.finalCta.secondary.href).toBe("/careers");
    expect(homeContent.whoWeAre.link.href).toBe("/about");
  });
});

describe("homepage content: compliance", () => {
  it("does not present example programs as guaranteed availability", () => {
    expect(homeContent.solutions.listLabel.toLowerCase()).toContain("may include");
    expect(homeContent.solutions.disclaimer).toMatch(/not every program is available/i);
    expect(homeContent.solutions.disclaimer).toMatch(/not affiliated with or endorsed by/i);
  });

  it("states that the lender, not Green Valor, makes the credit decision", () => {
    const last = homeContent.process.steps.at(-1)!;
    expect(last.description).toMatch(/the lender makes the credit decision/i);
  });

  it("contains no rates, statistics, guarantees or superlatives", () => {
    for (const pattern of [
      /\d+(\.\d+)?\s*%/,
      /\bapr\b/,
      /guarantee/,
      /pre-?approv/,
      /\bwe (approve|fund|underwrite|lend)\b/,
      /\b(lowest|best|#1|number one|fastest)\b/,
      /\b\d[\d,]*\+?\s*(clients|borrowers|loans|families|years|reviews)\b/,
      /testimonial|review(s)? from|five[- ]star|5[- ]star/,
    ]) {
      expect(allCopy, String(pattern)).not.toMatch(pattern);
    }
  });
});

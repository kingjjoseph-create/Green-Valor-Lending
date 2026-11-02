import { describe, expect, it } from "vitest";

import { residentialContent as c } from "@/content/residential";

const allCopy = JSON.stringify(c).toLowerCase();

describe("residential page: approved copy", () => {
  it("uses the approved hero and CTA copy verbatim", () => {
    expect(c.hero.eyebrow.toUpperCase()).toBe("RESIDENTIAL MORTGAGE SOLUTIONS");
    expect(c.hero.title).toBe("Your Home. Our Commitment.");
    expect(c.hero.description).toBe(
      "Explore mortgage options for buying or refinancing a home with personalized guidance from Green Valor Lending.",
    );
    expect(c.hero.cta.label).toBe("Discuss Your Home Loan Options");
    expect(c.cta.title).toBe("Let's Explore Your Home Financing Options.");
    expect(c.cta.primary).toEqual({ label: "Get Started", href: "/get-started" });
  });

  it("has the requested programs, purposes, review factors and FAQs", () => {
    expect(c.programs.cards.map((p) => p.title)).toEqual(["Conventional Loans", "FHA Loans", "VA Loans"]);
    expect(c.programs.other.title).toBe("Other Residential Options");
    expect(c.purposes.cards.map((p) => p.points.map((x) => x.title))).toEqual([
      [
        "Buying a primary residence",
        "First-time homebuyer considerations",
        "Down payment and closing-cost planning",
      ],
      [
        "Rate-and-term refinancing",
        "Cash-out refinancing where available",
        "Evaluating costs and long-term financial effects",
      ],
    ]);
    expect(c.review.items.map((i) => i.title)).toEqual([
      "Credit history",
      "Income and employment",
      "Monthly debt obligations",
      "Available assets",
      "Down payment",
      "Property eligibility",
      "Underwriting requirements",
    ]);
    expect(c.faq.items).toHaveLength(6);
  });
});

describe("residential page: compliance", () => {
  it("separates the broker's role from the lender's", () => {
    const [broker, lender] = c.financing.roles;
    expect(broker.points.join(" ")).not.toMatch(/underwrit|fund|credit decision/i);
    expect(lender.points.join(" ")).toMatch(/underwrites/i);
    expect(lender.points.join(" ")).toMatch(/credit decision/i);
    expect(lender.points.join(" ")).toMatch(/funds the loan/i);
  });

  it("lists no unverified 'other' programs", () => {
    expect(c.programs.other.verifiedPrograms).toEqual([]);
  });

  it("disclaims government affiliation on the VA card and the page", () => {
    const va = c.programs.cards.find((p) => p.id === "va")!;
    expect("affiliation" in va && va.affiliation).toMatch(
      /not affiliated with or endorsed by the U\.S\. Department of Veterans Affairs/,
    );
    expect(c.disclaimer).toMatch(/Federal Housing Administration/);
    expect(c.disclaimer).toMatch(/Department of Veterans Affairs/);
    expect(allCopy).not.toMatch(
      /va[- ]approved|fha[- ]approved|hud[- ]approved|partner(ed)? with (the )?(va|fha|hud)/,
    );
  });

  it("contains no rates, down-payment figures, approval promises or superlatives", () => {
    for (const pattern of [
      /\d+(\.\d+)?\s*(%|percent)/, // includes down-payment percentages (Reg Z trigger terms)
      /\$\s?\d/,
      /\bapr\b/,
      /\b(zero|no|0) down\b|no down payment|no money down/,
      /guaranteed|we guarantee|guaranteed approval/,
      /\bwe (approve|fund|underwrite|lend)\b/,
      /\b(lowest|best|#1|number one|fastest)\b/,
      /\bwill (be )?(approve|qualify)/,
      /testimonial|five[- ]star|5[- ]star/,
    ]) {
      expect(allCopy, String(pattern)).not.toMatch(pattern);
    }
  });

  it("describes preapproval as non-binding and issued by the lender", () => {
    const pre = c.faq.items.find((i) => /preapproval/i.test(i.question))!;
    expect(pre.answer).toMatch(/not a final loan approval or a commitment to lend/);
    expect(pre.answer).toMatch(/issued by the lender/);
  });
});

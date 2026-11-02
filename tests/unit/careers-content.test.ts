import { describe, expect, it } from "vitest";

import { careersContent as c, pathwayHref } from "@/content/careers";

const allCopy = JSON.stringify(c);

describe("Careers page content", () => {
  it("uses the approved hero, headings and CTAs", () => {
    expect(c.hero.eyebrow.toUpperCase()).toBe("BUILD YOUR FUTURE WITH GREEN VALOR");
    expect(c.hero.title).toBe("Discipline. Ambition. Opportunity.");
    expect(c.hero.description).toBe(
      "Whether you're an established loan officer or a driven professional exploring the mortgage industry, Green Valor Lending is committed to a culture of growth, education, accountability, and service.",
    );
    expect(c.hero.primary).toEqual({ label: "Apply to Join Our Team", href: "#apply" });
    expect(c.hero.secondary).toEqual({ label: "Discover Our Culture", href: "#culture" });
    expect(c.audience.title).toBe("Great Careers Begin With the Right Mindset.");
    expect(c.growth.title).toBe("Your Growth. Our Commitment.");
    expect(c.standard.title).toBe("We Value Character as Much as Experience.");
    expect(c.culture.title).toBe("A Culture Built on Service and Accountability.");
    expect(c.cta.title).toBe("Your Next Chapter Begins With Initiative.");
    expect(c.cta.description).toBe(
      "Meaningful careers are built through discipline, continuous learning, and commitment. If you're ready to explore a future in the mortgage industry, we'd like to connect.",
    );
    expect(c.cta.primary).toEqual({ label: "Apply Now", href: "#apply" });
  });

  it("has the requested cards, values, pathways and steps", () => {
    expect(c.audience.cards.map((x) => x.title)).toEqual([
      "Experienced Loan Officers",
      "Disciplined Entrepreneurs",
      "Career-Driven Individuals",
      "Veterans and Career Transitioners",
    ]);
    expect(c.growth.cards.map((x) => x.title)).toEqual([
      "Training & Education",
      "Marketing & Business Development",
      "Collaborative Growth",
    ]);
    expect(c.growth.cards.flatMap((x) => x.points)).toHaveLength(12);
    expect(c.standard.values.map((v) => v.title)).toEqual([
      "Discipline",
      "Integrity",
      "Initiative",
      "Accountability",
      "Professionalism",
      "Coachability",
      "Commitment to Service",
    ]);
    expect(c.pathways.items.map((p) => p.cta.label)).toEqual([
      "I'm a Licensed Loan Officer",
      "I'm Exploring a Mortgage Career",
    ]);
    expect(c.process.steps.map((s) => s.title)).toEqual([
      "Express Your Interest",
      "Initial Conversation",
      "Discuss Career Alignment",
      "Explore Next Steps",
    ]);
    expect(c.culture.points.map((p) => p.title)).toEqual([
      "Strong work ethic",
      "Professional responsibility",
      "Long-term relationships",
      "Consistent improvement",
      "Respect and collaboration",
    ]);
  });

  it("pathway CTAs preselect the matching form category", () => {
    expect(pathwayHref("licensed")).toBe("/careers?pathway=licensed#apply");
    expect(c.pathways.items[0]!.cta.href).toBe(pathwayHref("licensed"));
    expect(c.pathways.items[1]!.cta.href).toBe(pathwayHref("aspiring"));
  });

  it("says military experience is welcome but not required", () => {
    expect(c.audience.militaryNote).toMatch(/welcome.*not required/i);
    expect(c.culture.description).toMatch(/do not need a military background/i);
    expect(allCopy).not.toMatch(/must (be a|have) (veteran|military)|veterans only/i);
  });

  it("explains licensing for aspiring originators without promises", () => {
    const note = c.pathways.items[1]!.note;
    expect(note).toMatch(/requires the applicable mortgage loan originator license/i);
    expect(note).toMatch(/does not guarantee employment, licensing sponsorship, or a training placement/i);
    expect(note).toMatch(/no one may perform loan origination activities before they are licensed/i);
    expect(c.process.note).toMatch(/does not guarantee an offer of employment/i);
  });

  it("advertises no unconfirmed compensation, benefits, tools or guarantees", () => {
    for (const banned of [
      /commission/i,
      /\bsplits?\b/i,
      /\bbps\b|basis points/i,
      /\$\s?\d/,
      /\d+\s?%/,
      /salary|six.figure|income potential|earn up to|unlimited/i,
      /\bleads?\b/i,
      /reimburse/i,
      /paid (marketing|advertising)/i,
      /\bcrm\b|\blos\b|software|platform/i,
      /mentor(ship)? (schedule|program|sessions)|weekly|daily/i,
      /401\(?k|health insurance|benefits package|bonus/i,
      /we (will )?sponsor|guaranteed (placement|job|employment)|immediate (employment|start)|hiring now/i,
      /we (are a |are the )?lender|we (underwrite|approve|fund)/i,
    ])
      expect(allCopy, String(banned)).not.toMatch(banned);
  });
});

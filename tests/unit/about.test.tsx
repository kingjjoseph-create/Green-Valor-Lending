import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TeamCard, TeamSection } from "@/components/about/team-section";
import { aboutContent as c } from "@/content/about";
import { publishedTeam, teamMembers, type TeamMember } from "@/content/team";

const allCopy = JSON.stringify(c).toLowerCase();

describe("About page content", () => {
  it("uses the approved copy and routes", () => {
    expect(c.hero.eyebrow.toUpperCase()).toBe("VETERAN-OWNED & OPERATED");
    expect(c.hero.title).toBe("Service Is Our Foundation. Integrity Is Our Standard.");
    expect(c.hero.description).toBe(
      "Green Valor Lending was built around a commitment to service, accountability, and meaningful relationships.",
    );
    expect(c.mission.statement).toBe(
      "To serve borrowers with integrity and clarity while empowering mortgage professionals through education, support, and opportunities for meaningful growth.",
    );
    expect(c.values.items.map((v) => v.title)).toEqual([
      "Integrity",
      "Service",
      "Family",
      "Accountability",
      "Growth",
    ]);
    expect(c.leadership.qualities.map((q) => q.title)).toEqual([
      "Responsibility",
      "Leadership",
      "Commitment",
      "Professionalism",
      "Teamwork",
    ]);
    expect(c.borrowers.items.map((i) => i.title)).toEqual([
      "Education",
      "Clear explanations",
      "Personalized service",
      "Communication",
      "Transparency",
    ]);
    expect(c.loanOfficers.items.map((i) => i.title)).toEqual([
      "Training",
      "Mentorship and guidance",
      "Marketing support",
      "Business development",
      "Professional growth",
    ]);
    expect(c.loanOfficers.items[1]!.description).toMatch(/where available/);
    expect(c.loanOfficers.cta.href).toBe("/careers");
    expect(c.borrowers.cta.href).toBe("/resources");
    expect(c.cta.title).toBe("Built on Service. Focused on Your Future.");
    expect(c.cta.primary).toEqual({ label: "Explore Mortgage Solutions", href: "/#mortgage-solutions" });
    expect(c.cta.secondary).toEqual({ label: "Join Our Team", href: "/careers" });
  });

  it("describes the broker business model correctly", () => {
    const who = c.whoWeAre.paragraphs.join(" ");
    expect(who).toMatch(/veteran-owned and operated mortgage brokerage serving borrowers across Florida/);
    expect(who).toMatch(/lender underwrites, makes the credit decision, and funds the loan/);
    expect(allCopy).not.toMatch(
      /\bwe (approve|fund|underwrite|lend)\b|direct lender|mortgage lender\b(?! underwrites)/,
    );
  });

  it("invents no history, credentials, awards, service details or statistics", () => {
    for (const pattern of [
      /founded|established|since \d{4}|\b(19|20)\d\d\b/,
      /\b\d+\+?\s*(years?|decades?)\b|years of experience|decades/,
      /award|decorated|medal of|purple heart|bronze star|honor(ed|able) discharge/,
      /\b(army|navy|marine|air force|coast guard|space force|national guard|combat|deploy|tour of duty)\b/,
      /\b(sergeant|captain|colonel|lieutenant|commander|admiral|ret\.\))/,
      /\b\d[\d,]*\+?\s*(clients|borrowers|loans|families|homes|reviews)\b/,
      /\b(lowest|best|#1|number one|industry-leading|market-leading|top-rated)\b/,
      /testimonial|five[- ]star/,
    ]) {
      expect(allCopy, String(pattern)).not.toMatch(pattern);
    }
  });
});

describe("Team", () => {
  it("ships with no profiles until the company approves them", () => {
    expect(teamMembers).toEqual([]);
    expect(publishedTeam()).toEqual([]);
  });

  it("publishes only approved, complete profiles", () => {
    const members: TeamMember[] = [
      { id: "a", name: "Approved Person", title: "Loan Officer", approved: true },
      { id: "b", name: "Pending Person", title: "Loan Officer", approved: false },
      { id: "c", name: "", title: "Loan Officer", approved: true },
    ];
    expect(publishedTeam(members).map((m) => m.id)).toEqual(["a"]);
  });

  it("renders nothing when there are no approved profiles", () => {
    const { container } = render(<TeamSection eyebrow="Our team" title="Meet the Team." />);
    expect(container.innerHTML).toBe("");
  });

  it("renders only the fields provided", () => {
    render(<TeamCard member={{ id: "x", name: "Test Name", title: "Branch Manager", approved: true }} />);
    expect(screen.getByRole("heading", { name: "Test Name" })).toBeTruthy();
    expect(screen.getByText("Branch Manager")).toBeTruthy();
    expect(screen.queryByText(/NMLS/)).toBeNull();
  });

  it("shows an NMLS ID only when provided", () => {
    render(
      <TeamCard
        member={{ id: "y", name: "Test Name", title: "Loan Officer", nmlsId: "000000", approved: true }}
      />,
    );
    expect(screen.getByText("NMLS ID 000000")).toBeTruthy();
  });

  it("renders a grid for approved members", () => {
    render(
      <TeamSection
        eyebrow="Our team"
        title="Meet the Team."
        members={[{ id: "a", name: "Approved Person", title: "Loan Officer", approved: true }]}
      />,
    );
    expect(screen.getByRole("heading", { name: "Meet the Team." })).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});

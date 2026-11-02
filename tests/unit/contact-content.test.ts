import { describe, expect, it } from "vitest";

import { contactContent as c } from "@/content/contact";

describe("Contact page content", () => {
  it("uses the approved copy and CTAs", () => {
    expect(c.hero.title).toBe("Let's Start a Conversation.");
    expect(c.hero.description).toBe(
      "Whether you have questions about a mortgage, would like to learn about our services, or want to connect with our team, we're here to help.",
    );
    expect(c.borrowerCta.title).toBe("Ready to Explore Mortgage Options?");
    expect(c.borrowerCta.cta).toEqual({ label: "Get Started", href: "/get-started" });
    expect(c.careersCta.title).toBe("Interested in Joining Our Team?");
    expect(c.careersCta.cta).toEqual({ label: "Explore Careers", href: "/careers" });
    expect(c.form.careerNotice.cta.href).toBe("/careers#apply");
    expect(c.info.serviceArea).toBe("Florida");
  });

  it("contains no invented contact details, hours, response times, or promises", () => {
    const all = JSON.stringify(c);
    for (const banned of [
      /\(\d{3}\)\s?\d{3}-\d{4}|\d{3}-\d{3}-\d{4}/,
      /@[a-z0-9-]+\.[a-z]/i,
      /\b\d{1,5}\s+\w+\s+(street|st|avenue|ave|road|rd|blvd|drive|dr)\b/i,
      /\b\d{5}\b/,
      /\b(24\/7|within \d+|same.day|one business day|guarantee[ds]? (approval|a response))\b/i,
      /\brate\b.*\d/i,
      /we (lend|underwrite|approve|fund)/i,
    ])
      expect(all, String(banned)).not.toMatch(banned);
  });
});

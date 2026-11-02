import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getStartedContent as c } from "@/content/get-started";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("Get Started content", () => {
  it("uses the approved hero copy", () => {
    expect(c.hero.title).toBe("Let's Find Your Next Step.");
    expect(c.hero.description).toBe(
      "Tell us a little about your financing goals, and our team can help you explore available mortgage options.",
    );
  });

  it("makes no rate, approval, or timing promises and keeps the broker role", () => {
    const all = JSON.stringify(c);
    for (const banned of [
      /\d+(\.\d+)?\s?%/,
      /\bAPR\b/,
      /guarantee/i,
      /pre-?approv/i,
      /within \d+ (hours|days)/i,
      /we (lend|fund|approve|underwrite)/i,
    ])
      expect(all, String(banned)).not.toMatch(banned);
    expect(c.aside.note).toMatch(/not a loan application/);
    expect(c.aside.note).toMatch(/mortgage broker/);
  });
});

describe("Get Started page ARIVE link", () => {
  async function successLinkFor(url: string, licenseVerified = true) {
    vi.stubEnv("NEXT_PUBLIC_BORROWER_APPLICATION_URL", url);
    vi.resetModules();
    vi.doMock("@/lib/compliance", () => ({ licenseVerified }));
    const { default: Page } = await import("@/app/get-started/page");
    const tree = Page();
    // The wizard receives only an approved (https) URL.
    const find = (node: unknown): unknown => {
      if (!node || typeof node !== "object") return undefined;
      const el = node as { props?: Record<string, unknown> };
      if (el.props && "applicationUrl" in el.props) return el.props.applicationUrl;
      const kids = el.props?.children;
      for (const k of Array.isArray(kids) ? kids : [kids]) {
        const r = find(k);
        if (r !== undefined) return r;
      }
      return undefined;
    };
    return find(tree);
  }

  it("passes an https ARIVE URL through and drops anything else", async () => {
    expect(await successLinkFor("https://greenvalor.arive.com/apply")).toBe(
      "https://greenvalor.arive.com/apply",
    );
    expect(await successLinkFor("http://insecure.example.com")).toBeNull();
    expect(await successLinkFor("javascript:alert(1)")).toBeNull();
    expect(await successLinkFor("")).toBeNull();
  });

  it("hides the application link until licensing is verified (publication guard)", async () => {
    expect(await successLinkFor("https://greenvalor.arive.com/apply", false)).toBeNull();
  });

  it("renders the page heading", async () => {
    vi.resetModules();
    vi.doUnmock("@/lib/compliance");
    const { default: Page } = await import("@/app/get-started/page");
    render(<Page />);
    expect(screen.getByRole("heading", { level: 1, name: "Let's Find Your Next Step." })).toBeTruthy();
  });
});

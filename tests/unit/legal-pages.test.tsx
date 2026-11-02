import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { accessibilityContent } from "@/content/legal/accessibility";
import { privacyContent } from "@/content/legal/privacy";
import { termsContent } from "@/content/legal/terms";
import type { LegalPageContent } from "@/content/legal/types";
import { cfpb, floridaOfr, nmlsConsumerAccessService } from "@/content/regulators";
import { plainText } from "@/components/legal/rich-text";
import { LicensingNotice } from "@/components/layout/licensing-notice";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.resetModules();
});

const textOf = (c: LegalPageContent) =>
  c.sections
    .flatMap((s) => [s.heading, ...s.body.flat()])
    .map(plainText)
    .join("\n");

const OFFICIAL_HOSTS = ["flofr.gov", "www.consumerfinance.gov", "www.nmlsconsumeraccess.org"];

async function renderRoute(route: string, env: Record<string, string> = {}) {
  for (const k of [
    "NEXT_PUBLIC_COMPANY_NMLS_ID",
    "NEXT_PUBLIC_FL_LICENSE_NUMBER",
    "NEXT_PUBLIC_COMPANY_EMAIL",
    "NEXT_PUBLIC_COMPANY_PHONE",
  ])
    vi.stubEnv(k, env[k] ?? "");
  vi.resetModules();
  const { default: Page } = await import(`@/app${route}/page`);
  render(<Page />);
}

describe("legal pages", () => {
  it.each(["/licensing", "/privacy-policy", "/terms-of-use", "/consumer-complaints", "/accessibility"])(
    "%s has an h1, no phase placeholder, and a draft banner until counsel approves",
    async (route) => {
      await renderRoute(route);
      expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
      expect(document.querySelector("[data-placeholder]")).toBeNull();
      expect(screen.getByTestId("legal-draft-banner").textContent).toMatch(/Draft for legal review/);
    },
  );

  it("links only to official regulator sites over https", async () => {
    for (const route of ["/licensing", "/consumer-complaints"]) {
      cleanup();
      await renderRoute(route);
      const external = [...document.querySelectorAll<HTMLAnchorElement>("a[target=_blank]")];
      expect(external.length).toBeGreaterThan(0);
      for (const a of external) {
        const url = new URL(a.href);
        expect(url.protocol).toBe("https:");
        expect(OFFICIAL_HOSTS).toContain(url.host);
        expect(a.rel).toMatch(/noopener/);
      }
    }
  });
});

describe("Licensing page", () => {
  it("shows pending status and no license numbers while nothing is issued", async () => {
    await renderRoute("/licensing");
    const table = screen.getByTestId("licensing-table");
    expect(within(table).getByText("Green Valor Lending LLC")).toBeTruthy();
    expect(within(table).getAllByText("Not yet issued")).toHaveLength(2);
    expect(within(table).getByText("Pending; not yet verified")).toBeTruthy();
    expect(within(table).getByText(/None yet\. Green Valor plans to serve Florida only\./)).toBeTruthy();
    expect(screen.getByTestId("license-pending").textContent).toMatch(
      /pending NMLS ID is not an active license/,
    );
    expect(table.textContent).not.toMatch(/#\s*\d|\bpending\b.*#/i);
    expect(screen.queryByTestId("license-verified")).toBeNull();
  });

  it("an issued NMLS ID alone does not make the license verified or the state licensed", async () => {
    await renderRoute("/licensing", {
      NEXT_PUBLIC_COMPANY_NMLS_ID: "1234567",
      NEXT_PUBLIC_FL_LICENSE_NUMBER: "MBR9999",
    });
    const table = screen.getByTestId("licensing-table");
    expect(within(table).getByText("1234567")).toBeTruthy();
    expect(within(table).getByText("MBR9999")).toBeTruthy();
    expect(within(table).getByText("Pending; not yet verified")).toBeTruthy();
    expect(within(table).queryByText("Florida")).toBeNull();
    expect(screen.getByTestId("license-pending")).toBeTruthy();
  });

  it("never prints a placeholder such as 'Pending' as an NMLS ID", async () => {
    await renderRoute("/licensing", { NEXT_PUBLIC_COMPANY_NMLS_ID: "Pending" });
    expect(within(screen.getByTestId("licensing-table")).getAllByText("Not yet issued")).toHaveLength(2);
  });

  it("links the NMLS Consumer Access home page, never an invented detail page", async () => {
    await renderRoute("/licensing");
    const hrefs = [...document.querySelectorAll<HTMLAnchorElement>("a")].map((a) => a.href);
    const nmls = hrefs.filter((h) => h.includes("nmlsconsumeraccess"));
    expect(nmls).toEqual(["https://www.nmlsconsumeraccess.org/"]);
  });
});

describe("Consumer Complaints page", () => {
  it("lists the Florida OFR and CFPB complaint channels from official sources", async () => {
    await renderRoute("/consumer-complaints");
    const ofr = screen.getByTestId("regulator-ofr");
    expect(
      within(ofr)
        .getByRole("link", { name: /Submit a complaint to the Florida OFR/ })
        .getAttribute("href"),
    ).toBe(floridaOfr.complaintUrl);
    expect(ofr.textContent).toContain("(850) 487-9687");
    expect(ofr.textContent).toContain("200 E. Gaines Street, Tallahassee, FL 32399");
    const c = screen.getByTestId("regulator-cfpb");
    expect(
      within(c)
        .getByRole("link", { name: /Submit a complaint to the CFPB/ })
        .getAttribute("href"),
    ).toBe(cfpb.complaintUrl);
    expect(c.textContent).toContain("(855) 411-2372");
    expect(c.textContent).toContain("(855) 729-2372");
  });

  it("shows only verified company contact details", async () => {
    await renderRoute("/consumer-complaints");
    expect(screen.getByTestId("no-company-channels")).toBeTruthy();
    expect(screen.queryByTestId("company-contact-details")).toBeNull();
    cleanup();
    await renderRoute("/consumer-complaints", { NEXT_PUBLIC_COMPANY_EMAIL: "help@greenvalor.test" });
    expect(screen.getByTestId("company-contact-details").textContent).toContain("help@greenvalor.test");
    expect(screen.queryByTestId("no-company-channels")).toBeNull();
  });

  it("stores regulator links as https on official hosts", () => {
    const urls = [
      floridaOfr.website,
      floridaOfr.complaintUrl,
      floridaOfr.verifyLicenseUrl,
      cfpb.complaintUrl,
      nmlsConsumerAccessService.url,
    ];
    for (const u of urls) expect(OFFICIAL_HOSTS).toContain(new URL(u).host);
  });
});

describe("Privacy Policy draft", () => {
  const text = textOf(privacyContent);

  it("addresses every topic the business asked for", () => {
    const headings = privacyContent.sections.map((s) => s.heading);
    for (const h of [
      "General contact information",
      "Mortgage inquiry information",
      "Recruitment applicant information",
      "Cookies and analytics",
      "How we use information",
      "Service providers and sharing",
      "Data storage and retention",
      "Data security",
      "Your choices and rights",
      "How to contact us",
    ])
      expect(headings).toContain(h);
  });

  it("makes no unverified encryption, retention-period or certification claims", () => {
    expect(text).not.toMatch(/encrypt|\bSSL\b|\bTLS\b|256-bit|bank-level|military-grade/i);
    expect(text).not.toMatch(/retain\w*[^.]*\b\d+\s*(days?|months?|years?)\b/i);
    expect(text).not.toMatch(/certif|SOC ?2|ISO ?27001|PCI|HIPAA|fully compliant|GDPR|CCPA/i);
  });

  it("matches the site: no analytics or cookies are actually loaded", () => {
    expect(text).toMatch(/does not currently use analytics tools, advertising pixels, or tracking cookies/);
    const pkg = readFileSync(path.resolve(__dirname, "../../package.json"), "utf8");
    expect(pkg).not.toMatch(
      /@vercel\/analytics|@vercel\/speed-insights|react-ga|gtag|posthog|mixpanel|segment|hotjar/i,
    );
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const f of readdirSync(dir)) {
        const p = path.join(dir, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(tsx?|mjs)$/.test(f)) files.push(p);
      }
    };
    walk(path.resolve(__dirname, "../../src"));
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      expect(src, f).not.toMatch(
        /document\.cookie|googletagmanager|google-analytics|gtag\(|localStorage\.setItem|sessionStorage\.setItem|fbq\(/,
      );
    }
  });

  it("lists the fields each form actually collects, and no sensitive identifiers", () => {
    expect(text).toMatch(/not a loan application/);
    expect(text).toMatch(/do not ask for your Social Security number/);
    expect(text).toMatch(/do not accept resumes/);
    expect(text).toMatch(/We do not sell your personal information/);
  });
});

describe("Terms of Use draft", () => {
  const text = textOf(termsContent);
  it("covers the required topics", () => {
    const ids = termsContent.sections.map((s) => s.id);
    for (const id of [
      "informational",
      "no-commitment",
      "no-guarantee",
      "external",
      "ip",
      "limitations",
      "disclaimers",
    ])
      expect(ids).toContain(id);
    expect(text).toMatch(/not a commitment to lend|is a commitment to lend/);
    expect(text).toMatch(/We do not guarantee loan approval/);
    expect(text).toMatch(/mortgage broker, not a mortgage lender/);
  });
  it("never says Green Valor lends, approves, underwrites or funds", () => {
    expect(text).not.toMatch(/\bwe (lend|fund|underwrite|approve)\b/i);
    expect(text).not.toMatch(/(?<!no )guaranteed approval|lowest rate|best rate/i);
  });
});

describe("Accessibility statement", () => {
  const text = textOf(accessibilityContent);
  it("describes practices without claiming conformance or audits that have not happened", () => {
    expect(text).toMatch(
      /aim for this website to meet the Web Content Accessibility Guidelines \(WCAG\) 2\.1 at Level AA/,
    );
    expect(text).toMatch(
      /not yet completed an independent accessibility audit or full testing with screen readers/,
    );
    expect(text).not.toMatch(/fully (compliant|accessible)|conforms to|is compliant|certified/i);
  });
});

describe("site-wide licensing notice", () => {
  it("says no applications are taken and links the licensing page", () => {
    render(<LicensingNotice />);
    const n = screen.getByRole("complementary", { name: "Licensing status" });
    expect(n.textContent).toMatch(/we do not take mortgage loan applications/);
    expect(within(n).getByRole("link", { name: "Licensing status" }).getAttribute("href")).toBe("/licensing");
  });
});

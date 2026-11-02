import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/careers" }));

import { mainNav } from "@/config/navigation";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FormField } from "@/components/forms/form-field";
import { FormStatus } from "@/components/forms/form-status";
import { FAQAccordion } from "@/components/shared/faq-accordion";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";
import { ProcessTimeline } from "@/components/shared/process-timeline";
import { ResponsiveImage } from "@/components/shared/responsive-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";

describe("DesktopNav", () => {
  it("lists every primary page and marks the current one", () => {
    render(<DesktopNav items={mainNav} />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    const titles = within(nav)
      .getAllByRole("link")
      .map((a) => a.textContent);
    expect(titles).toEqual([
      "Home",
      "Residential Loans",
      "Non-QM Loans",
      "Resources",
      "About Us",
      "Careers",
      "Contact",
    ]);
    expect(within(nav).getByRole("link", { name: "Careers" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });
});

describe("Breadcrumbs", () => {
  it("prepends Home, marks the current page and emits BreadcrumbList JSON-LD", () => {
    const { container } = render(<Breadcrumbs items={[{ title: "Careers", href: "/careers" }]} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Careers")).toHaveAttribute("aria-current", "page");
    const ld = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toHaveLength(2);
  });
});

describe("FormField", () => {
  it("associates label, hint and error with the control", () => {
    render(
      <FormField
        label="Email"
        name="email"
        type="email"
        required
        hint="We reply by email."
        error="Required."
      />,
    );
    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute("id", "field-email");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("We reply by email. Required.");
  });

  it("renders select and textarea variants", () => {
    render(
      <>
        <FormField as="select" label="Topic" name="topic" options={[{ value: "a", label: "A" }]} />
        <FormField as="textarea" label="Message" name="message" />
      </>,
    );
    expect(screen.getByRole("combobox", { name: /Topic/ })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Message/ }).tagName).toBe("TEXTAREA");
    expect(screen.getAllByText("(optional)")).toHaveLength(2);
  });
});

describe("FormStatus", () => {
  it("uses a polite status region normally and an alert for errors", () => {
    const { rerender } = render(<FormStatus status="idle" />);
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    rerender(<FormStatus status="success" />);
    expect(screen.getByRole("status")).toHaveTextContent("Thank you");
    rerender(<FormStatus status="error" message="Network error." />);
    expect(screen.getByRole("alert")).toHaveTextContent("Network error.");
  });
});

describe("content components", () => {
  it("FAQAccordion renders disclosure widgets", () => {
    const { container } = render(<FAQAccordion items={[{ question: "Q1?", answer: "A1" }]} />);
    expect(container.querySelectorAll("details")).toHaveLength(1);
    expect(screen.getByText("Q1?").closest("summary")).not.toBeNull();
  });

  it("ProcessTimeline is an ordered list with step numbers for screen readers", () => {
    render(
      <ProcessTimeline
        steps={[
          { title: "Talk", description: "d" },
          { title: "Apply", description: "d" },
        ]}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Step 2: Apply" })).toBeInTheDocument();
  });

  it("LegalDisclaimer renders the requested standard disclosures", () => {
    render(<LegalDisclaimer include={["brokerStatement"]} />);
    expect(screen.getByRole("complementary")).toHaveTextContent("not a mortgage lender");
  });

  it("ResponsiveImage shows a decorative placeholder when no licensed photo exists", () => {
    const { container } = render(<ResponsiveImage image={null} />);
    const ph = container.querySelector('[data-placeholder="image"]');
    expect(ph).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("img")).toBeNull();
  });

  it("SectionHeading uses the requested heading level", () => {
    render(<SectionHeading as="h2" title="Title" eyebrow="Eyebrow" />);
    expect(screen.getByRole("heading", { level: 2, name: "Title" })).toBeInTheDocument();
  });

  it("CTAButton opens external links in a new tab with a hint", () => {
    render(<CTAButton href="https://example.com/apply">Apply</CTAButton>);
    const link = screen.getByRole("link", { name: /Apply/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent("opens in a new tab");
  });
});

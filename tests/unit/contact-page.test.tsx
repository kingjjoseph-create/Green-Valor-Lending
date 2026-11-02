import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function renderPage(env: Record<string, string>) {
  for (const k of [
    "NEXT_PUBLIC_COMPANY_EMAIL",
    "NEXT_PUBLIC_COMPANY_PHONE",
    "NEXT_PUBLIC_BUSINESS_HOURS",
    "NEXT_PUBLIC_PUBLISH_OFFICE_ADDRESS",
    "NEXT_PUBLIC_OFFICE_STREET",
    "NEXT_PUBLIC_OFFICE_CITY",
    "NEXT_PUBLIC_OFFICE_STATE",
    "NEXT_PUBLIC_OFFICE_POSTAL_CODE",
  ])
    vi.stubEnv(k, env[k] ?? "");
  cleanup();
  vi.resetModules();
  const { default: ContactPage } = await import("@/app/contact/page");
  render(<ContactPage />);
  const info = screen.getByTestId("contact-info");
  return [...info.querySelectorAll("[data-row]")].map((r) => r.getAttribute("data-row"));
}

describe("Contact information", () => {
  it("shows only company and service state when nothing else is configured", async () => {
    expect(await renderPage({})).toEqual(["company", "service"]);
    expect(within(screen.getByTestId("contact-info")).getByText("Green Valor Lending LLC")).toBeTruthy();
    expect(within(screen.getByTestId("contact-info")).getByText("Florida")).toBeTruthy();
    expect(screen.getByTestId("contact-pending")).toBeTruthy();
  });

  it("shows email, phone and hours once supplied", async () => {
    const rows = await renderPage({
      NEXT_PUBLIC_COMPANY_EMAIL: "info@greenvalor.test",
      NEXT_PUBLIC_COMPANY_PHONE: "8135550100",
      NEXT_PUBLIC_BUSINESS_HOURS: "Monday to Friday, 9 a.m. to 5 p.m. ET",
    });
    expect(rows).toEqual(["company", "email", "phone", "service", "hours"]);
    expect(screen.getByRole("link", { name: "(813) 555-0100" }).getAttribute("href")).toBe(
      "tel:+18135550100",
    );
    expect(screen.getByRole("link", { name: "info@greenvalor.test" }).getAttribute("href")).toBe(
      "mailto:info@greenvalor.test",
    );
    expect(screen.queryByTestId("contact-pending")).toBeNull();
  });

  it("never shows an address unless publication is approved and complete", async () => {
    const parts = {
      NEXT_PUBLIC_OFFICE_STREET: "100 Example Way",
      NEXT_PUBLIC_OFFICE_CITY: "Tampa",
      NEXT_PUBLIC_OFFICE_STATE: "FL",
      NEXT_PUBLIC_OFFICE_POSTAL_CODE: "33601",
    };
    expect(await renderPage(parts)).not.toContain("address");
    expect(
      await renderPage({ ...parts, NEXT_PUBLIC_PUBLISH_OFFICE_ADDRESS: "true", NEXT_PUBLIC_OFFICE_CITY: "" }),
    ).not.toContain("address");
    expect(await renderPage({ ...parts, NEXT_PUBLIC_PUBLISH_OFFICE_ADDRESS: "true" })).toContain("address");
  });
});

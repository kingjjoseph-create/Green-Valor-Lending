import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MortgageCalculator } from "@/components/resources/mortgage-calculator";
import { filterFaq } from "@/components/resources/searchable-faq";
import { resourcesContent } from "@/content/resources";

function type(label: RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}
const total = () => screen.queryByTestId("calculator-total")?.textContent;
const results = () => within(screen.getByTestId("calculator-results"));

describe("MortgageCalculator component", () => {
  it("starts without any pre-filled rate and asks for inputs", () => {
    render(<MortgageCalculator />);
    expect((screen.getByLabelText(/interest rate/i) as HTMLInputElement).value).toBe("");
    expect(screen.getByText(/enter a home price and an interest rate/i)).toBeTruthy();
    expect(total()).toBeUndefined();
  });

  it("updates the estimate live as values are typed (no submit or reload)", () => {
    render(<MortgageCalculator />);
    type(/home purchase price/i, "375,000");
    type(/down payment \(dollars\)/i, "75000");
    type(/interest rate/i, "6.5");
    expect(total()).toBe("$1,896.20");
    expect(results().getByText("$300,000.00")).toBeTruthy();
    expect(screen.getByText("20% of the price")).toBeTruthy();

    type(/property taxes per year/i, "4800");
    type(/homeowners insurance per year/i, "2400");
    type(/hoa dues per month/i, "150");
    type(/mortgage insurance per month/i, "100");
    expect(total()).toBe("$2,746.20");

    fireEvent.change(screen.getByLabelText(/loan term/i), { target: { value: "15" } });
    expect(results().getByText("$2,613.32")).toBeTruthy();
  });

  it("converts the down payment when switching between dollars and percent", () => {
    render(<MortgageCalculator />);
    type(/home purchase price/i, "400000");
    type(/down payment \(dollars\)/i, "80000");
    type(/interest rate/i, "0");
    fireEvent.click(screen.getByRole("radio", { name: "Percent" }));
    const pct = screen.getByLabelText(/down payment \(percent\)/i) as HTMLInputElement;
    expect(pct.value).toBe("20");
    type(/down payment \(percent\)/i, "10");
    expect(results().getByText("$360,000.00")).toBeTruthy();
    expect(total()).toBe("$1,000.00");
    fireEvent.click(screen.getByRole("radio", { name: "Dollars" }));
    expect((screen.getByLabelText(/down payment \(dollars\)/i) as HTMLInputElement).value).toBe("40000");
  });

  it("shows accessible field errors for invalid values and hides the estimate", () => {
    render(<MortgageCalculator />);
    type(/home purchase price/i, "300000");
    type(/interest rate/i, "-2");
    const rate = screen.getByLabelText(/interest rate/i);
    expect(rate.getAttribute("aria-invalid")).toBe("true");
    const describedBy = rate.getAttribute("aria-describedby")!;
    expect(describedBy).toContain("calc-rate-error");
    expect(document.getElementById("calc-rate-error")!.textContent).toMatch(/cannot be negative/);
    expect(total()).toBeUndefined();
    expect(screen.getByText(/check the highlighted fields/i)).toBeTruthy();

    type(/interest rate/i, "6.5");
    type(/down payment \(dollars\)/i, "999999");
    expect(screen.getByText(/cannot be more than the home price/)).toBeTruthy();
  });

  it("uses mobile-friendly numeric inputs", () => {
    render(<MortgageCalculator />);
    for (const input of screen.getAllByRole("textbox")) {
      expect(input.getAttribute("inputmode")).toBe("decimal");
      expect(input.className).toContain("text-base"); // 16px: prevents iOS zoom on focus
      expect(input.className).toContain("h-12");
    }
  });

  it("clears all fields", () => {
    render(<MortgageCalculator />);
    type(/home purchase price/i, "300000");
    type(/interest rate/i, "6");
    fireEvent.click(screen.getByRole("button", { name: /clear all fields/i }));
    expect((screen.getByLabelText(/home purchase price/i) as HTMLInputElement).value).toBe("");
    expect(total()).toBeUndefined();
  });

  it("states that results are estimates, not offers", () => {
    render(<MortgageCalculator />);
    expect(
      screen.getByText(/not a loan offer, a rate quote, a preapproval, or a commitment to lend/),
    ).toBeTruthy();
    expect(screen.getByText(/does not use or show current market rates/)).toBeTruthy();
  });
});

describe("filterFaq", () => {
  const items = resourcesContent.faq.items;
  it("matches every word in the question or answer, case-insensitively", () => {
    expect(filterFaq(items, "", null)).toHaveLength(items.length);
    expect(filterFaq(items, "ESCROW", null).map((i) => i.question)).toContain(
      "Why might my payment change after closing?",
    );
    expect(filterFaq(items, "rate lock", null).map((i) => i.question)).toContain("What is a rate lock?");
    expect(filterFaq(items, "zzzz", null)).toHaveLength(0);
  });
  it("filters by category and combines with search", () => {
    const process = filterFaq(items, "", "The process");
    expect(process.length).toBeGreaterThan(0);
    expect(process.every((i) => i.category === "The process")).toBe(true);
    expect(
      filterFaq(items, "credit", "Costs and payments").every((i) => i.category === "Costs and payments"),
    ).toBe(true);
  });
  it("puts every FAQ in a declared category", () => {
    for (const item of items) expect(resourcesContent.faq.categories).toContain(item.category);
  });
});

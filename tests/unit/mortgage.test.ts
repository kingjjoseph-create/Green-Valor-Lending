import { describe, expect, it } from "vitest";

import {
  calculatePayment,
  formatCurrency,
  formatPercent,
  monthlyPrincipalAndInterest,
  parseNumber,
  roundCents,
  type CalculatorInput,
} from "@/lib/mortgage";

/*
 * Expected values were computed independently with Python's Decimal module
 * (50-digit precision) using the closed-form formula, and cross-checked by
 * running the full amortization schedule to a zero residual balance.
 * 300,000 at 6.5% for 30 years = 1,896.20 also matches published tables.
 */

const base: CalculatorInput = {
  price: "375000",
  downPayment: "75000",
  downPaymentMode: "amount",
  rate: "6.5",
  termYears: 30,
  annualTaxes: "",
  annualInsurance: "",
  monthlyHoa: "",
  monthlyMortgageInsurance: "",
};

function ok(input: Partial<CalculatorInput>) {
  const result = calculatePayment({ ...base, ...input });
  if (result.status !== "ok")
    throw new Error(`expected ok, got ${result.status}: ${JSON.stringify(result.errors)}`);
  return result.breakdown;
}

describe("monthlyPrincipalAndInterest", () => {
  it.each([
    [300_000, 6.5, 30, 1896.2041],
    [240_000, 7, 30, 1596.726],
    [350_000, 6.75, 30, 2270.0933],
  ])("standard 30-year: %d at %d%%", (p, r, y, expected) => {
    expect(monthlyPrincipalAndInterest(p, r, y)).toBeCloseTo(expected, 3);
  });

  it.each([
    [300_000, 6.5, 15, 2613.3221],
    [400_000, 5.875, 15, 3348.474],
  ])("standard 15-year: %d at %d%%", (p, r, y, expected) => {
    expect(monthlyPrincipalAndInterest(p, r, y)).toBeCloseTo(expected, 3);
  });

  it("handles 0% interest as principal divided by the number of payments", () => {
    expect(monthlyPrincipalAndInterest(360_000, 0, 30)).toBe(1000);
    expect(monthlyPrincipalAndInterest(180_000, 0, 15)).toBe(1000);
    expect(Number.isFinite(monthlyPrincipalAndInterest(1, 0, 30))).toBe(true);
  });

  it("returns 0 for a zero loan amount", () => {
    expect(monthlyPrincipalAndInterest(0, 6.5, 30)).toBe(0);
  });

  it("stays finite at the input limits", () => {
    expect(monthlyPrincipalAndInterest(100_000_000, 30, 30)).toBeCloseTo(2_500_344.6739, 2);
  });

  it("rejects impossible arguments", () => {
    expect(() => monthlyPrincipalAndInterest(-1, 5, 30)).toThrow(RangeError);
    expect(() => monthlyPrincipalAndInterest(100, -1, 30)).toThrow(RangeError);
    expect(() => monthlyPrincipalAndInterest(100, 5, 0)).toThrow(RangeError);
    expect(() => monthlyPrincipalAndInterest(Number.NaN, 5, 30)).toThrow(RangeError);
    expect(() => monthlyPrincipalAndInterest(100, Number.POSITIVE_INFINITY, 30)).toThrow(RangeError);
  });
});

describe("calculatePayment", () => {
  it("computes a standard 30-year breakdown", () => {
    const b = ok({});
    expect(b.loanAmount).toBe(300_000);
    expect(b.principalAndInterest).toBe(1896.2);
    expect(b.totalMonthly).toBe(1896.2);
    expect(b.numberOfPayments).toBe(360);
  });

  it("computes a standard 15-year breakdown", () => {
    const b = ok({ termYears: 15 });
    expect(b.principalAndInterest).toBe(2613.32);
    expect(b.numberOfPayments).toBe(180);
  });

  it("handles 0% interest", () => {
    const b = ok({ price: "360000", downPayment: "0", rate: "0" });
    expect(b.principalAndInterest).toBe(1000);
  });

  it("handles a zero (or empty) down payment", () => {
    expect(ok({ price: "300000", downPayment: "0" }).loanAmount).toBe(300_000);
    expect(ok({ price: "300000", downPayment: "" }).principalAndInterest).toBe(1896.2);
    expect(ok({ price: "300000", downPayment: "0", downPaymentMode: "percent" }).downPaymentPercent).toBe(0);
  });

  it("converts down-payment percentages and responds to changes", () => {
    const pct = (p: string) => ok({ price: "400000", downPayment: p, downPaymentMode: "percent" });
    expect(pct("20").downPaymentAmount).toBe(80_000);
    expect(pct("20").loanAmount).toBe(320_000);
    expect(pct("3.5").loanAmount).toBe(386_000);
    expect(pct("10").loanAmount).toBe(360_000);
    expect(pct("100").loanAmount).toBe(0);
    expect(pct("100").principalAndInterest).toBe(0);
    expect(pct("25").principalAndInterest).toBeLessThan(pct("5").principalAndInterest);
    // Dollar mode reports the equivalent percentage.
    expect(ok({ price: "400000", downPayment: "80000" }).downPaymentPercent).toBe(20);
  });

  it("converts annual taxes and insurance to monthly amounts", () => {
    const b = ok({ annualTaxes: "4800", annualInsurance: "2,400" });
    expect(b.monthlyTaxes).toBe(400);
    expect(b.monthlyInsurance).toBe(200);
    expect(b.totalMonthly).toBe(2496.2);
    // Non-even division rounds to cents.
    expect(ok({ annualTaxes: "1000" }).monthlyTaxes).toBe(83.33);
  });

  it("adds monthly HOA dues and mortgage insurance", () => {
    const b = ok({ monthlyHoa: "150", monthlyMortgageInsurance: "125.50" });
    expect(b.monthlyHoa).toBe(150);
    expect(b.monthlyMortgageInsurance).toBe(125.5);
    expect(b.totalMonthly).toBe(2171.7);
  });

  it("makes the total equal the sum of the displayed lines", () => {
    const b = ok({
      price: "333333",
      downPayment: "11111",
      rate: "6.875",
      annualTaxes: "3999",
      annualInsurance: "2777",
      monthlyHoa: "33.33",
    });
    const sum =
      b.principalAndInterest +
      b.monthlyTaxes +
      b.monthlyInsurance +
      b.monthlyHoa +
      b.monthlyMortgageInsurance;
    expect(b.totalMonthly).toBe(roundCents(sum));
  });

  it("is incomplete until price and rate are entered", () => {
    expect(calculatePayment({ ...base, price: "" }).status).toBe("incomplete");
    expect(calculatePayment({ ...base, rate: "" }).status).toBe("incomplete");
  });

  it.each([
    ["price", { price: "-300000" }, /cannot be negative/],
    ["downPayment", { downPayment: "-5" }, /cannot be negative/],
    ["rate", { rate: "-1" }, /cannot be negative/],
    ["annualTaxes", { annualTaxes: "-100" }, /cannot be negative/],
    ["annualInsurance", { annualInsurance: "-1" }, /cannot be negative/],
    ["monthlyHoa", { monthlyHoa: "-20" }, /cannot be negative/],
    ["monthlyMortgageInsurance", { monthlyMortgageInsurance: "-1" }, /cannot be negative/],
  ] as const)("rejects a negative %s", (field, input, message) => {
    const result = calculatePayment({ ...base, ...input });
    expect(result.status).toBe("invalid");
    expect(result.errors[field]).toMatch(message);
  });

  it("rejects extremely high and impossible values", () => {
    const check = (
      input: Partial<CalculatorInput>,
      field: keyof ReturnType<typeof calculatePayment>["errors"],
    ) => {
      const result = calculatePayment({ ...base, ...input });
      expect(result.status).toBe("invalid");
      expect(result.errors[field]).toBeTruthy();
    };
    check({ price: "1000000000" }, "price");
    check({ price: "1e9" }, "price");
    check({ price: "0" }, "price");
    check({ rate: "31" }, "rate");
    check({ rate: "abc" }, "rate");
    check({ downPayment: "500000" }, "downPayment");
    check({ downPayment: "101", downPaymentMode: "percent" }, "downPayment");
    check({ annualTaxes: "999999999" }, "annualTaxes");
    check({ termYears: 0 }, "termYears");
    check({ termYears: 33 }, "termYears");
    check({ price: "Infinity" }, "price");
    check({ price: "1.2.3" }, "price");
  });

  it("never returns NaN or Infinity for valid input", () => {
    for (const rate of ["0", "0.001", "6.5", "30"]) {
      for (const termYears of [10, 15, 20, 25, 30]) {
        const b = ok({ rate, termYears, price: "100000000", downPayment: "0" });
        for (const v of Object.values(b)) expect(Number.isFinite(v)).toBe(true);
      }
    }
  });
});

describe("parsing, rounding and formatting", () => {
  it("parses common typed formats", () => {
    expect(parseNumber("350,000")).toBe(350000);
    expect(parseNumber("$350000")).toBe(350000);
    expect(parseNumber(" 6.5 ")).toBe(6.5);
    expect(parseNumber("6.5%")).toBe(6.5);
    expect(parseNumber(".5")).toBe(0.5);
    expect(parseNumber("")).toBeNull();
    expect(parseNumber("  ")).toBeNull();
    expect(parseNumber("12abc")).toBeNaN();
    expect(parseNumber("1e5")).toBeNaN();
  });

  it("rounds half away from zero to cents without floating-point drift", () => {
    expect(roundCents(1.005)).toBe(1.01);
    expect(roundCents(2.675)).toBe(2.68);
    expect(roundCents(1896.2041)).toBe(1896.2);
    expect(roundCents(0.004)).toBe(0);
    expect(roundCents(-1.005)).toBe(-1.01);
  });

  it("formats currency and percentages", () => {
    expect(formatCurrency(1896.2)).toBe("$1,896.20");
    expect(formatCurrency(300000, { cents: false })).toBe("$300,000");
    expect(formatCurrency(0)).toBe("$0.00");
    expect(formatCurrency(-0)).toBe("$0.00");
    expect(formatCurrency(2_500_344.67)).toBe("$2,500,344.67");
    expect(formatPercent(20)).toBe("20%");
    expect(formatPercent(3.5)).toBe("3.5%");
    expect(formatPercent(33.33333)).toBe("33.33%");
  });
});

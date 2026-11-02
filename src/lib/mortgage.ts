/**
 * Mortgage payment math for the borrower calculator. Pure functions, no I/O.
 *
 * Principal and interest uses the standard fixed-rate amortization formula:
 *   M = P * r / (1 - (1 + r)^-n)
 * where P is the loan amount, r the monthly rate (annual % / 100 / 12) and
 * n the number of monthly payments. When r is 0 the payment is P / n.
 *
 * Results are estimates for planning only. No rate is ever supplied by this
 * module: the user enters their own.
 */

export const LIMITS = {
  /** Upper bound for any dollar input; above this the value is treated as a typo. */
  maxAmount: 100_000_000,
  /** Interest rates above this are rejected as implausible input. */
  maxRate: 30,
  termsYears: [10, 15, 20, 25, 30] as const,
} as const;

export type TermYears = (typeof LIMITS.termsYears)[number];
export type DownPaymentMode = "amount" | "percent";

/** Raw form values as typed (strings), so validation can report each field. */
export type CalculatorInput = {
  price: string;
  downPayment: string;
  downPaymentMode: DownPaymentMode;
  rate: string;
  termYears: number;
  annualTaxes: string;
  annualInsurance: string;
  monthlyHoa: string;
  monthlyMortgageInsurance: string;
};

export type FieldName =
  | "price"
  | "downPayment"
  | "rate"
  | "termYears"
  | "annualTaxes"
  | "annualInsurance"
  | "monthlyHoa"
  | "monthlyMortgageInsurance";

export type CalculatorErrors = Partial<Record<FieldName, string>>;

export type PaymentBreakdown = {
  loanAmount: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  principalAndInterest: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyMortgageInsurance: number;
  totalMonthly: number;
  numberOfPayments: number;
};

export type CalculatorResult =
  | { status: "incomplete"; errors: CalculatorErrors }
  | { status: "invalid"; errors: CalculatorErrors }
  | { status: "ok"; errors: CalculatorErrors; breakdown: PaymentBreakdown };

/** Round half away from zero to cents, avoiding binary floating-point drift (1.005 -> 1.01). */
export function roundCents(value: number): number {
  const sign = value < 0 ? -1 : 1;
  return (sign * Math.round(Number((Math.abs(value) * 100).toPrecision(15)))) / 100;
}

/**
 * Parse a user-typed number. Accepts "350,000", "$350000", " 6.5 ", "6.5%".
 * Returns null for empty input and NaN for anything that is not a plain number.
 */
export function parseNumber(raw: string): number | null {
  const cleaned = raw.replace(/[\s$,%]/g, "");
  if (cleaned === "") return null;
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return Number.NaN;
  return Number(cleaned);
}

/** Monthly principal and interest for a fully amortizing fixed-rate loan. */
export function monthlyPrincipalAndInterest(
  loanAmount: number,
  annualRatePercent: number,
  termYears: number,
): number {
  if (!Number.isFinite(loanAmount) || loanAmount < 0)
    throw new RangeError("loanAmount must be a non-negative number");
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0)
    throw new RangeError("annualRatePercent must be a non-negative number");
  if (!Number.isInteger(termYears) || termYears <= 0)
    throw new RangeError("termYears must be a positive integer");

  const n = termYears * 12;
  if (loanAmount === 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return loanAmount / n;
  return (loanAmount * r) / (1 - Math.pow(1 + r, -n));
}

type Check = { required: boolean; max: number; label: string };

const moneyCheck = (label: string, required = false): Check => ({ required, max: LIMITS.maxAmount, label });

function readField(raw: string, check: Check, errors: CalculatorErrors, field: FieldName): number | null {
  const value = parseNumber(raw);
  if (value === null) {
    return check.required ? null : 0;
  }
  if (Number.isNaN(value)) {
    errors[field] = `Enter ${check.label} as a number.`;
    return null;
  }
  if (value < 0) {
    errors[field] = `${capitalize(check.label)} cannot be negative.`;
    return null;
  }
  if (value > check.max) {
    errors[field] = `${capitalize(check.label)} looks too high. Please check the amount.`;
    return null;
  }
  return value;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Validate the form and, when everything needed is present and valid, compute the breakdown. */
export function calculatePayment(input: CalculatorInput): CalculatorResult {
  const errors: CalculatorErrors = {};

  const price = readField(input.price, moneyCheck("the home price", true), errors, "price");
  if (price === 0 && !errors.price) errors.price = "Enter a home price greater than zero.";

  const downCheck: Check =
    input.downPaymentMode === "percent"
      ? { required: false, max: 100, label: "the down payment percentage" }
      : moneyCheck("the down payment");
  const down = readField(input.downPayment, downCheck, errors, "downPayment");

  const rate = readField(
    input.rate,
    { required: true, max: LIMITS.maxRate, label: "the interest rate" },
    errors,
    "rate",
  );
  if (errors.rate?.includes("too high"))
    errors.rate = `Enter an interest rate of ${LIMITS.maxRate}% or less.`;

  if (!(LIMITS.termsYears as readonly number[]).includes(input.termYears)) {
    errors.termYears = "Choose a loan term.";
  }

  const taxes = readField(input.annualTaxes, moneyCheck("annual property taxes"), errors, "annualTaxes");
  const insurance = readField(
    input.annualInsurance,
    moneyCheck("annual homeowners insurance"),
    errors,
    "annualInsurance",
  );
  const hoa = readField(input.monthlyHoa, moneyCheck("monthly HOA dues"), errors, "monthlyHoa");
  const mi = readField(
    input.monthlyMortgageInsurance,
    moneyCheck("monthly mortgage insurance"),
    errors,
    "monthlyMortgageInsurance",
  );

  // Down payment relative to price: it cannot exceed the price.
  let downPaymentAmount = 0;
  if (price !== null && price > 0 && down !== null && !errors.downPayment) {
    downPaymentAmount = input.downPaymentMode === "percent" ? (price * down) / 100 : down;
    if (downPaymentAmount > price) {
      errors.downPayment = "The down payment cannot be more than the home price.";
    }
  }

  if (Object.keys(errors).length > 0) return { status: "invalid", errors };
  if (price === null || rate === null || down === null) return { status: "incomplete", errors };

  const loanAmount = price - downPaymentAmount;
  const termYears = input.termYears as TermYears;
  const pi = monthlyPrincipalAndInterest(loanAmount, rate, termYears);

  // Round each displayed line to cents; the total is the sum of the rounded
  // lines so the figures shown always add up.
  const lines = {
    principalAndInterest: roundCents(pi),
    monthlyTaxes: roundCents((taxes ?? 0) / 12),
    monthlyInsurance: roundCents((insurance ?? 0) / 12),
    monthlyHoa: roundCents(hoa ?? 0),
    monthlyMortgageInsurance: roundCents(mi ?? 0),
  };
  const totalMonthly = roundCents(Object.values(lines).reduce((sum, v) => sum + v, 0));

  return {
    status: "ok",
    errors,
    breakdown: {
      loanAmount: roundCents(loanAmount),
      downPaymentAmount: roundCents(downPaymentAmount),
      downPaymentPercent: (downPaymentAmount / price) * 100,
      ...lines,
      totalMonthly,
      numberOfPayments: termYears * 12,
    },
  };
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** "$1,896.20". Negative zero is shown as "$0.00". */
export function formatCurrency(value: number, { cents = true } = {}): string {
  return (cents ? usd : usdWhole).format(Object.is(value, -0) ? 0 : value);
}

/** "20%" or "3.5%" (at most two decimals, trailing zeros trimmed). */
export function formatPercent(value: number): string {
  return `${Number(value.toFixed(2))}%`;
}

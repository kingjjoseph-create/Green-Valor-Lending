"use client";

import * as React from "react";

import {
  calculatePayment,
  formatCurrency,
  formatPercent,
  LIMITS,
  parseNumber,
  type CalculatorInput,
  type DownPaymentMode,
  type FieldName,
} from "@/lib/mortgage";
import { cn } from "@/lib/utils";

/*
 * Inputs start empty except the term: no example rate is pre-filled, so the
 * page never shows a rate that could read as an offer.
 */
const initialInput: CalculatorInput = {
  price: "",
  downPayment: "",
  downPaymentMode: "amount",
  rate: "",
  termYears: 30,
  annualTaxes: "",
  annualInsurance: "",
  monthlyHoa: "",
  monthlyMortgageInsurance: "",
};

const controlClass =
  "block h-12 w-full rounded-md border border-input bg-white text-base text-gv-charcoal tabular-nums shadow-[inset_0_1px_2px_rgb(32_40_36/0.05)] transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus-visible:border-gv-green focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring aria-invalid:border-destructive";

type NumberFieldProps = {
  name: FieldName;
  label: string;
  /** Extra words for the accessible name only (e.g. "per year") when a visible suffix carries them. */
  srLabel?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  children?: React.ReactNode;
};

function NumberField({
  name,
  label,
  srLabel,
  hint,
  value,
  onChange,
  error,
  prefix,
  suffix,
  placeholder,
  children,
}: NumberFieldProps) {
  const id = `calc-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={id} className="block text-sm font-semibold text-gv-charcoal">
          {label}
          {srLabel && <span className="sr-only"> {srLabel}</span>}
        </label>
        {children}
      </div>
      <div className="relative">
        {prefix && (
          <span
            className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground"
            aria-hidden="true"
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          name={name}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          enterKeyHint="next"
          spellCheck={false}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            controlClass,
            prefix ? "pl-8" : "pl-4",
            suffix ? (suffix.length > 1 ? "pr-14" : "pr-10") : "pr-4",
          )}
        />
        {suffix && (
          <span
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground"
            aria-hidden="true"
          >
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="type-legal text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** Convert the down payment between dollars and percent when the user switches modes. */
function convertDownPayment(input: CalculatorInput, mode: DownPaymentMode): string {
  const price = parseNumber(input.price);
  const down = parseNumber(input.downPayment);
  if (price === null || down === null || !Number.isFinite(price) || !Number.isFinite(down) || price <= 0) {
    return input.downPayment;
  }
  if (mode === "percent") return String(Number(((down / price) * 100).toFixed(2)));
  return String(Math.round((price * down) / 100));
}

/* Segment colors sit on the green results panel, so they must contrast with it. */
const segmentColors = {
  principalAndInterest: "bg-gv-gold",
  monthlyTaxes: "bg-white/85",
  monthlyInsurance: "bg-[#8fb5a0]",
  monthlyHoa: "bg-gv-gold-bright/45",
  monthlyMortgageInsurance: "bg-white/35",
} as const;

export function MortgageCalculator() {
  const [input, setInput] = React.useState<CalculatorInput>(initialInput);
  const result = React.useMemo(() => calculatePayment(input), [input]);
  const set = (key: keyof CalculatorInput) => (value: string) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const setMode = (mode: DownPaymentMode) =>
    setInput((prev) =>
      prev.downPaymentMode === mode
        ? prev
        : { ...prev, downPaymentMode: mode, downPayment: convertDownPayment(prev, mode) },
    );

  const e = result.errors;
  const b = result.status === "ok" ? result.breakdown : null;

  const lines = b
    ? ([
        ["principalAndInterest", "Principal and interest", b.principalAndInterest],
        ["monthlyTaxes", "Property taxes", b.monthlyTaxes],
        ["monthlyInsurance", "Homeowners insurance", b.monthlyInsurance],
        ["monthlyHoa", "HOA dues", b.monthlyHoa],
        ["monthlyMortgageInsurance", "Mortgage insurance", b.monthlyMortgageInsurance],
      ] as const)
    : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      <form
        className="rounded-2xl border border-border bg-card p-5 min-[380px]:p-6 sm:p-8"
        onSubmit={(ev) => ev.preventDefault()}
        aria-label="Mortgage payment calculator"
        noValidate
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <NumberField
              name="price"
              label="Home purchase price"
              prefix="$"
              placeholder="Enter price"
              value={input.price}
              onChange={set("price")}
              error={e.price}
            />
          </div>

          <div className="sm:col-span-2">
            <NumberField
              name="downPayment"
              label={
                input.downPaymentMode === "percent" ? "Down payment (percent)" : "Down payment (dollars)"
              }
              prefix={input.downPaymentMode === "amount" ? "$" : undefined}
              suffix={input.downPaymentMode === "percent" ? "%" : undefined}
              placeholder="0"
              value={input.downPayment}
              onChange={set("downPayment")}
              error={e.downPayment}
              hint={
                b && input.downPaymentMode === "amount"
                  ? `${formatPercent(b.downPaymentPercent)} of the price`
                  : b
                    ? `${formatCurrency(b.downPaymentAmount, { cents: false })}`
                    : undefined
              }
            >
              <fieldset className="flex rounded-md border border-input p-0.5 text-sm">
                <legend className="sr-only">Enter down payment as</legend>
                {(["amount", "percent"] as const).map((mode) => (
                  <label
                    key={mode}
                    className={cn(
                      "relative flex min-h-9 min-w-11 cursor-pointer items-center justify-center rounded px-3 font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring",
                      input.downPaymentMode === mode
                        ? "bg-gv-green text-white"
                        : "text-gv-charcoal hover:bg-muted",
                    )}
                  >
                    <input
                      type="radio"
                      name="downPaymentMode"
                      value={mode}
                      checked={input.downPaymentMode === mode}
                      onChange={() => setMode(mode)}
                      className="sr-only"
                    />
                    <span aria-hidden="true">{mode === "amount" ? "$" : "%"}</span>
                    <span className="sr-only">{mode === "amount" ? "Dollars" : "Percent"}</span>
                  </label>
                ))}
              </fieldset>
            </NumberField>
          </div>

          <NumberField
            name="rate"
            label="Interest rate"
            suffix="%"
            placeholder="Enter rate"
            value={input.rate}
            onChange={set("rate")}
            error={e.rate}
            hint="Enter a rate you are considering. We do not supply rates."
          />

          <div className="space-y-2">
            <label htmlFor="calc-termYears" className="block text-sm font-semibold text-gv-charcoal">
              Loan term
            </label>
            <select
              id="calc-termYears"
              name="termYears"
              value={input.termYears}
              onChange={(ev) => setInput((prev) => ({ ...prev, termYears: Number(ev.target.value) }))}
              className={cn(controlClass, "px-4")}
            >
              {LIMITS.termsYears.map((t) => (
                <option key={t} value={t}>
                  {t} years
                </option>
              ))}
            </select>
          </div>

          <NumberField
            name="annualTaxes"
            label="Property taxes"
            srLabel="per year, estimated"
            suffix="/yr"
            prefix="$"
            placeholder="0"
            value={input.annualTaxes}
            onChange={set("annualTaxes")}
            error={e.annualTaxes}
          />
          <NumberField
            name="annualInsurance"
            label="Homeowners insurance"
            srLabel="per year, estimated"
            suffix="/yr"
            prefix="$"
            placeholder="0"
            value={input.annualInsurance}
            onChange={set("annualInsurance")}
            error={e.annualInsurance}
          />
          <NumberField
            name="monthlyHoa"
            label="HOA dues"
            srLabel="per month"
            suffix="/mo"
            prefix="$"
            placeholder="0"
            value={input.monthlyHoa}
            onChange={set("monthlyHoa")}
            error={e.monthlyHoa}
          />
          <NumberField
            name="monthlyMortgageInsurance"
            label="Mortgage insurance"
            srLabel="per month, estimated"
            suffix="/mo"
            prefix="$"
            placeholder="0"
            value={input.monthlyMortgageInsurance}
            onChange={set("monthlyMortgageInsurance")}
            error={e.monthlyMortgageInsurance}
          />
        </div>
        {/* Small screens: keep the running total in view while editing (the full, announced result is below). */}
        {b && (
          <div
            aria-hidden="true"
            className="sticky bottom-3 z-10 mt-6 flex items-center justify-between gap-4 rounded-xl bg-gv-green px-5 py-3 text-white shadow-[0_10px_30px_-10px_rgb(2_51_29/0.6)] lg:hidden"
          >
            <span className="text-sm text-white/80">Estimated monthly</span>
            <span className="font-serif text-2xl font-semibold tabular-nums">
              {formatCurrency(b.totalMonthly)}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setInput(initialInput)}
          className="mt-6 min-h-11 rounded-sm text-sm font-semibold text-gv-green underline decoration-gv-gold/60 underline-offset-4 hover:decoration-gv-green"
        >
          Clear all fields
        </button>
      </form>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <section
          aria-labelledby="calc-results"
          className="surface-inverse rounded-2xl p-6 min-[380px]:p-8"
          data-testid="calculator-results"
        >
          <h3 id="calc-results" className="type-eyebrow">
            Estimated monthly payment
          </h3>
          <div aria-live="polite" aria-atomic="true">
            {b ? (
              <p className="mt-3 font-serif text-[clamp(2.5rem,2rem+2vw,3.5rem)] leading-none font-semibold text-white tabular-nums">
                <span data-testid="calculator-total">{formatCurrency(b.totalMonthly)}</span>
                <span className="sr-only"> estimated total monthly housing payment</span>
              </p>
            ) : (
              <p className="mt-4 type-body text-muted-foreground">
                {result.status === "invalid"
                  ? "Check the highlighted fields to see your estimate."
                  : "Enter a home price and an interest rate to see an estimate."}
              </p>
            )}
          </div>

          {b && (
            <>
              <div className="mt-6 flex h-2.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                {b.totalMonthly > 0 &&
                  lines.map(([key, , value]) =>
                    value > 0 ? (
                      <span
                        key={key}
                        className={segmentColors[key]}
                        style={{ width: `${(value / b.totalMonthly) * 100}%` }}
                      />
                    ) : null,
                  )}
              </div>
              <dl className="mt-6 divide-y divide-white/15 text-sm">
                <div className="flex justify-between gap-4 pb-3">
                  <dt className="text-muted-foreground">Loan amount</dt>
                  <dd className="font-semibold tabular-nums">{formatCurrency(b.loanAmount)}</dd>
                </div>
                {lines.map(([key, label, value]) => (
                  <div key={key} className="flex items-center justify-between gap-4 py-3">
                    <dt className="flex items-center gap-2.5 text-muted-foreground">
                      <span
                        className={cn("size-2.5 shrink-0 rounded-full", segmentColors[key])}
                        aria-hidden="true"
                      />
                      {label}
                    </dt>
                    <dd className="tabular-nums">{formatCurrency(value)}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 pt-3 font-semibold">
                  <dt>Estimated total monthly housing payment</dt>
                  <dd className="tabular-nums">{formatCurrency(b.totalMonthly)}</dd>
                </div>
              </dl>
            </>
          )}
        </section>

        <div className="mt-5 rounded-xl border border-border bg-surface-alt p-5 sm:p-6">
          <h3 className="font-sans text-sm font-semibold text-gv-charcoal">Assumptions</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 type-legal text-muted-foreground">
            <li>
              A fixed interest rate for the full term, with equal monthly payments that fully repay the loan.
            </li>
            <li>
              Taxes and insurance are your annual estimates divided by 12. HOA dues and mortgage insurance are
              the monthly amounts you enter.
            </li>
            <li>
              Closing costs, prepaid items, and changes in taxes, insurance, or dues over time are not
              included.
            </li>
            <li>The rate is the one you enter. This tool does not use or show current market rates.</li>
          </ul>
          <p className="mt-4 type-legal font-medium text-gv-charcoal">
            Results are estimates for planning only. They are not a loan offer, a rate quote, a preapproval,
            or a commitment to lend. Your actual payment depends on the lender&apos;s terms and your final
            loan details.
          </p>
        </div>
      </div>
    </div>
  );
}

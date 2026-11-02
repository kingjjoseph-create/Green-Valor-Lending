# Borrower Resources Page Review (2026-11-02)

The page lives at `/resources`. Screenshots were taken from a production build with the calculator filled in (375,000 price, 75,000 down, 6.5%, 30 years, 4,800 taxes, 3,600 insurance, 150 HOA) and the first Mortgage Basics item open.

| View                | File                                                                     |
| ------------------- | ------------------------------------------------------------------------ |
| Desktop, 1440px     | [resources-desktop.png](./resources-desktop.png)                         |
| Mobile, 390px       | [resources-mobile.png](./resources-mobile.png)                           |
| Lighthouse, mobile  | [resources-lighthouse-mobile.html](./resources-lighthouse-mobile.html)   |
| Lighthouse, desktop | [resources-lighthouse-desktop.html](./resources-lighthouse-desktop.html) |

## Lighthouse 12 (local production build)

|         | Performance | Accessibility | Best practices | SEO |
| ------- | ----------- | ------------- | -------------- | --- |
| Mobile  | 95          | 100           | 100            | 69  |
| Desktop | 100         | 100           | 100            | 69  |

- Three later mobile runs scored 95 to 98. One run scored 83 (TBT 360ms) while a screenshot browser was running at the same time.
- SEO fails only on the intentional pre-launch noindex.

## Calculator

- **Math** is in `src/lib/mortgage.ts`. It uses the standard amortization formula `M = P·r / (1 − (1 + r)^−n)`; at 0% the payment is `P / n`.
- **Rounding:** each displayed line is rounded to cents, half away from zero, without float drift (1.005 rounds to 1.01). The total is the sum of the displayed lines, so the breakdown always adds up.
- **Validation:**
  - Negative values are rejected.
  - Non-numeric input, scientific notation and multiple decimal points are rejected.
  - Dollar inputs above $100,000,000 are rejected.
  - Rates above 30% are rejected.
  - A down payment cannot exceed the price or 100%.
  - A price must be greater than zero.
  - The term must be one of 10, 15, 20, 25 or 30 years.
  - Errors are tied to their fields through `aria-invalid` and `aria-describedby`.
- **No pre-filled rate.** All inputs start empty except the 30-year term, so the page never displays a rate. The assumptions box and the disclaimer say the results are estimates, not offers, rate quotes or preapprovals.
- **Live updates:** results recompute on every keystroke in React state. There is no form submit or reload; the smoke test checks that the page never reloads. The total is announced politely through `aria-live`.
- **Mobile:**
  - Inputs use `inputMode="decimal"`, a 16px font (so iOS doesn't zoom on focus) and are 48px tall.
  - The dollar/percent toggle targets are at least 44px wide.
  - A sticky running total stays visible on small screens while you edit.
  - The smoke test checks all of this at 390 and 320px.

### Test coverage (`tests/unit/mortgage.test.ts`, `mortgage-calculator.test.tsx`)

Expected payments were computed independently with Python's `Decimal` (50-digit precision) and cross-checked by running each amortization schedule to a zero balance.

| Case                                 | Expected               |
| ------------------------------------ | ---------------------- |
| 300,000 at 6.5%, 30 years            | 1,896.2041 → $1,896.20 |
| 240,000 at 7%, 30 years              | 1,596.7260             |
| 350,000 at 6.75%, 30 years           | 2,270.0933             |
| 300,000 at 6.5%, 15 years            | 2,613.3221 → $2,613.32 |
| 400,000 at 5.875%, 15 years          | 3,348.4740             |
| 360,000 at 0%, 30 years              | 1,000.00               |
| 100,000,000 at 30%, 30 years (limit) | 2,500,344.6739         |

The tests also cover:

- zero and empty down payment
- percentage conversion (3.5, 10, 20, 100%) and switching modes
- taxes and insurance divided by 12, including non-even division
- adding HOA dues and mortgage insurance
- negative values in every field
- extreme and invalid input
- that results are never NaN or Infinity
- parsing of "$", "," and "%"
- rounding and currency formatting
- inputs suited to mobile

## Other sections

| Section         | Notes                                                                                                                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mortgage basics | 8 accordions. Factual, with no thresholds; the DTI example uses round numbers                                                                                                                |
| Loan options    | 2 cards linking to /residential-loans and /non-qm                                                                                                                                            |
| Process         | 5 steps, with the note "Steps and timing can vary by loan program, lender, property..."                                                                                                      |
| FAQ             | 13 questions in 4 categories. Search matches every word you type in the question or answer, and topic filters use `aria-pressed`. The result count is announced, and an empty state is shown |
| CTA             | "Speak With Our Team" goes to /contact                                                                                                                                                       |

## Defects found and fixed

1. Bar segments and the principal-and-interest marker were green on the green results panel, so they were invisible. They now use colors that contrast with the panel.
2. Long labels ("Annual homeowners insurance (estimate)") wrapped and pushed inputs out of line. Labels are now short, with "/yr" and "/mo" shown inside the field. The full meaning, such as "per year, estimated", is still in each field's accessible name.
3. "Alternative Non-QM Financing" broke at the hyphen on mobile. It now uses `keepTogether`.
4. On mobile the total sat below a long form. Added a sticky running total.

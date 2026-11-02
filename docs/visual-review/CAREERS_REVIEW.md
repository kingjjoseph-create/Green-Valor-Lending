# Careers & Recruitment Page Review (2026-11-02)

The page lives at `/careers`. Screenshots were taken from a production build with `tests/e2e/visual-review.mjs`.

| View                | File                                                                 |
| ------------------- | -------------------------------------------------------------------- |
| Desktop, 1440px     | [careers-desktop.png](./careers-desktop.png)                         |
| Mobile, 390px       | [careers-mobile.png](./careers-mobile.png)                           |
| Lighthouse, mobile  | [careers-lighthouse-mobile.html](./careers-lighthouse-mobile.html)   |
| Lighthouse, desktop | [careers-lighthouse-desktop.html](./careers-lighthouse-desktop.html) |

## Lighthouse 12 (local production build)

|         | Performance | Accessibility | Best practices | SEO |
| ------- | ----------- | ------------- | -------------- | --- |
| Mobile  | 98          | 100           | 100            | 69  |
| Desktop | 100         | 100           | 100            | 69  |

- The first mobile run, made right after the screenshot browser, scored 84; the saved rerun scored 98 (LCP 2.3 s, CLS 0).
- SEO fails only on the intentional pre-launch noindex.

## Design notes

- The hero uses the green surface to set the page apart from borrower pages. Until a licensed workplace photo is added to the `careersHero` slot, the right column shows the official reversed GV mark with the four culture pillars (desktop only). Adding the photo in `src/content/images.ts` replaces it automatically.
- Values are a single bordered grid; the seventh value, Commitment to Service, is the green anchor cell.
- Pathway A is the green card and Pathway B the light card, each with its own note and CTA.
- The form sits beside a short privacy summary that stays in view on large screens.

## Debugging checklist

| Check                                | Result                                                                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Career CTAs scroll or navigate       | Hero, final CTA → `#apply`; "Discover Our Culture" → `#culture`. Smoke checks hrefs, targets, and that the hero CTA lands on the form |
| Pathway preselection                 | `?pathway=licensed` / `?pathway=aspiring` preselect the form, by click and by direct visit (smoke + unit)                             |
| Validation; empty and invalid email  | Rejected client-side with a focused error summary and no request; the server re-validates (unit, API and smoke)                       |
| NMLS ID optional                     | Marked "(optional)", not `aria-required`, accepted blank; digits only when given                                                      |
| No mortgage application fields       | Tests block loan, property, income, SSN, credit, down payment, asset and birth-date fields, and file inputs                           |
| Submissions recorded or delivered    | Delivered to the configured webhook and/or email; end-to-end test confirms the mock receiver gets a `recruitment_inquiry` record      |
| No false success                     | Success appears only on a 200 with `{ ok: true }`. 503, 502, 500, 429, network failure and a non-JSON 200 show an error               |
| Mobile usability                     | 16px inputs, `email`/`tel` keyboards, autocomplete, 44px+ controls, single column, no overflow at 320px                               |
| Applicant data handled securely      | Server-only secrets, HMAC-signed webhook, same-origin, JSON only, 16 KB limit, rate limit, honeypot, no PII in logs, `no-store`       |
| No invented benefits or compensation | Content test blocks commission, splits, leads, salary, reimbursement, tools, schedules, benefits and guarantees                       |
| Military not required                | "Military experience is welcome, but it is not required." and "You do not need a military background" (test-enforced)                 |

# QA Report

## Phase 10: Get Started page (2026-11-02)

These were actually run on a production build:

- `npm run lint`, `tsc --noEmit` and `npm run build` are clean. `npm test` passes (304 tests). New: `inquiry-schema`, `inquiry-api`, `inquiry-wizard` and `get-started-content` tests (scenario list in `docs/visual-review/GET_STARTED_REVIEW.md`).
- `tests/e2e/smoke.mjs` passes on 13 routes × 5 viewports, including new Get Started checks in a fresh browser context: goal required, Florida preselected and the Florida-only notice, invalid amount blocked, amount formatting, blank contact step blocked, Back keeps entries, no sensitive fields, keyboards, no request sent, axe on steps 2 and 4, no overflow.
- `tests/e2e/inquiry-submit.mjs` passes against `next start` with a mock CRM webhook, on a mobile viewport: valid Non-QM inquiry classified and delivered once on a double click, approved confirmation, backend error and a hung request (timeout) never show success, no applicant data in the console or storage. Run twice: with `NEXT_PUBLIC_BORROWER_APPLICATION_URL` set (ARIVE button shown) and unset (hidden).
- `contact-submit.mjs` and `careers-submit.mjs` still pass after moving spam helpers to `src/lib/forms/spam.ts`.
- Lighthouse on /get-started: mobile 96/100/100/69, desktop 100/100/100/69.

## Phase 9: Contact page (2026-11-02)

These were actually run on a production build:

- `npm run lint`, `tsc --noEmit` and `npm run build` are clean. `npm test` passes (238 tests). New: `contact-schema`, `contact-api`, `contact-form`, `contact-content` and `contact-page` tests (see `docs/visual-review/CONTACT_REVIEW.md` for the scenario list).
- `tests/e2e/smoke.mjs` passes on 13 routes × 5 viewports, including new Contact checks: only verified rows, callout links, keyboards, 16px inputs, blank/invalid submissions blocked with no request, 2,000-character cap, career routing, axe, no overflow.
- `tests/e2e/contact-submit.mjs` passes against `next start` with a mock CRM webhook: success and classification, duplicate delivered once, spam check failure, network failure, delivery failure (never false success), career routing. `tests/e2e/careers-submit.mjs` still passes after the shared-helper refactor.
- Lighthouse on /contact: mobile 98/100/100/69, desktop 100/100/100/69.
- Known test-harness note: after many page loads in one browser context, local `next start` (HTTP/1.1) leaves link-prefetch responses open, so Playwright's `networkidle` never settles. This reproduces on `main` too; page loads themselves finish in about 100 ms. The smoke test runs the Contact checks in a fresh browser context.

## Phase 8: Careers & Recruitment page (2026-11-02)

These were actually run on a production build:

- `npm run lint`, `tsc --noEmit` and `npm run build` are clean.
- `npm test` passes (183 tests). New files:
  - `recruitment-schema.test.ts`: empty submission rejected, invalid emails rejected, NMLS ID optional but numeric, phone, pathway and select values, consent, length limits, control characters.
  - `recruitment-api.test.ts` (mocked fetch): 503 when unconfigured, 400 for empty or invalid input, 200 only after the webhook accepts a signed `recruitment_inquiry` record, 502 when delivery fails or the receiver is unreachable, Resend email payload, one-of-two channels, honeypot, 403 cross-origin, 415, 413, malformed JSON, 429 rate limit, no applicant data in logs, HTML escaped in email.
  - `recruitment-form.test.tsx`: required fields present, no file upload or mortgage fields, NMLS optional, mobile input types, empty and invalid-email submissions blocked before any request, pathway preselection, success only after an ok response, error (never success) on 503, 502, 500, 429, a non-JSON 200 and network failure, entries kept for retry.
  - `careers-content.test.ts`: approved copy, cards, values, steps and CTA targets; military welcome but not required; licensing note; no compensation, commission, leads, reimbursements, tools, schedules, benefits or guarantees.
- `tests/e2e/smoke.mjs` passes on 13 routes × 5 viewports. Careers checks: CTA hrefs and targets, hero CTA scrolls to the form, both pathway CTAs and a direct `?pathway=` visit preselect the category, empty and invalid-email submissions rejected with no request sent, error summary focused, NMLS not required, no file or mortgage fields, inputs at least 16px and controls at least 44px tall, no overflow, axe with errors shown.
- `tests/e2e/careers-submit.mjs` passes against `next start` with `RECRUITMENT_WEBHOOK_URL` pointing to a local mock receiver, on a mobile viewport: a valid inquiry is delivered as a `recruitment_inquiry` record and only then shows success; with the receiver failing, the form shows an error, keeps the entries, and records nothing.
- Lighthouse on /careers: mobile 98/100/100/69, desktop 100/100/100/69.

## Phase 7: About page (2026-11-02)

These were actually run on a production build:

- `npm run lint`, `tsc --noEmit` and `npm run build` are clean.
- `npm test` passes, including the new `about.test.tsx`. It checks the approved copy and routes, the broker model, that there is no invented history, ranks, branches, awards or stats, that the team is empty by default, that only approved profiles render, and that an NMLS ID appears only when provided.
- `tests/e2e/smoke.mjs` passes on 13 routes × 5 viewports. It adds About checks: link hrefs, values and qualities, no team section or NMLS ID, and click-through to /#mortgage-solutions and /careers.
- Lighthouse on /about: mobile 96/100/100/69, desktop 100/100/100/69.

## Phase 6: Borrower Resources page (2026-11-02)

These were actually run on a production build:

- `npm run lint`, `tsc --noEmit` and `npm run build` are clean.
- `npm test`: 127/127 pass. New files:
  - `mortgage.test.ts`: amortization checked against independently computed values, plus edge cases, validation, rounding and formatting.
  - `mortgage-calculator.test.tsx`: live updates, mode switching, accessible errors, mobile inputs, clearing the form, the disclaimer, and FAQ filtering.
  - `resources-content.test.ts`
- `tests/e2e/smoke.mjs` passes on 13 routes × 5 viewports. It adds browser checks:
  - the calculator total in a real browser, and that the page doesn't reload
  - mobile input size, font and keyboard type
  - error state and axe
  - FAQ search, empty state and topic filter
  - overflow after interaction, and links
- Lighthouse on /resources: mobile 95/100/100/69, desktop 100/100/100/69.
- Details: `docs/visual-review/RESOURCES_REVIEW.md`.

## Phase 5: Non-QM page (2026-11-02)

These were actually run on a production build:

- `npm run lint`, `tsc --noEmit` and `npm run build` are clean.
- `npm test`: all pass. This adds `non-qm-content.test.ts` (approved copy, the required clarifications, no thresholds, rates or approval promises, no "no-doc" claims) and `keep-together.test.tsx`.
- `tests/e2e/smoke.mjs` passes on 13 routes × 5 viewports. It adds Non-QM checks: CTA hrefs, program headings, 5 process steps, table vs. stacked comparison by width, FAQ keyboard toggle, and axe and overflow with an FAQ open.
- Lighthouse on /non-qm: mobile 96/100/100/69, desktop 100/100/100/69.
- Details: `docs/visual-review/NON_QM_REVIEW.md`.

## Phase 4: Residential Loans page (2026-11-02)

These were actually run on a production build:

- `npm run lint`, `tsc --noEmit` and `npm run build` are clean.
- `npm test`: 74/74 pass. This adds `residential-content.test.ts`, which checks the approved copy, the broker/lender role split, that no unverified programs are listed, the non-affiliation wording, and that there are no rates, down-payment figures, dollar amounts or approval promises.
- `tests/e2e/smoke.mjs` passes on 13 routes × 5 viewports. It adds residential checks: CTA hrefs, program headings, FAQ open/close by click and keyboard, axe and overflow with an FAQ open.
- Lighthouse on /residential-loans: mobile 97/100/100/69, desktop 100/100/100/69. SEO is lower only because of the intentional noindex.
- Details: `docs/visual-review/RESIDENTIAL_REVIEW.md`.

## Phase 3: Homepage (2026-11-02)

- Unit tests 67/67, smoke PASS, Lighthouse mobile 95/100/100/66 and desktop 100/100/100/66. See `docs/visual-review/HOMEPAGE_REVIEW.md`.

## Phase 2: Global layout and shared components (2026-11-02)

Run on Node 22.23, Next 16.4.3. Every result below comes from a command that was actually run.

| Check                                                           | Result                                                                                                                                                                                                                                                    |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                                                  | Pass, 0 problems                                                                                                                                                                                                                                          |
| `npm run typecheck`                                             | Pass                                                                                                                                                                                                                                                      |
| `npm test`                                                      | Pass, 61/61 in 8 files: 21 contrast pairings + 3 forbidden pairs, palette/CSS sync, image licensing rules, component accessibility wiring (nav, breadcrumbs, form fields, form status, FAQ, timeline, disclaimer, image placeholder, CTA), routes, config |
| `npm run build`                                                 | Pass, all routes static                                                                                                                                                                                                                                   |
| `npm run test:e2e` (production build, styleguide off)           | Pass, 13 routes × 5 viewports (1440, 1280, 1024, 390, 320)                                                                                                                                                                                                |
| `npm run test:e2e` with `SMOKE_STYLEGUIDE=1` (styleguide build) | Pass, 14 routes × 5 viewports, including every shared component on `/styleguide`                                                                                                                                                                          |

**The global audit covers:** HTTP 200, a single H1, no `undefined`/`null`/`NaN`, no NMLS number or Equal Housing text while unset or unapproved, no horizontal overflow at any width, axe-core WCAG 2.1 A/AA plus best practice (drawer included), header logo is the horizontal file with its aspect ratio preserved and a 30 to 52px height, Get Started visible in the header at every width, the full footer link set, desktop nav order and active state, skip link to main, mobile drawer (link set, CTA visible, focus trap, Escape closes and focus returns, scroll lock on and off, closes after navigation), hero animation active with normal motion and off with reduced motion, axe after scrolling with motion on, robots blocking, sitemap includes `/complaints` and excludes `/styleguide`, and `/styleguide` returns 404 when disabled.

**Manual review:** screenshots at 1440 and 390/320px for home, about, the styleguide, and the open mobile drawer.

**Defects found and fixed in this phase**

- The header overflowed by 17px at 320px wide. Fixed with tighter gutters, logo size and CTA padding below 380px.
- Gold focus ring (3.2:1 on white, 2.9:1 on ivory) replaced by `gold-deep` on light and `gold-bright` on green.
- Cormorant old-style numerals looked uneven in step badges. Switched to lining numerals.

**Not yet covered:** real iOS/Android devices and Safari/Firefox (scroll-driven reveal is Chromium/Safari 26+; other browsers show content without animation), screen-reader walkthrough, Lighthouse performance.

## Phase 1.1: Official logos (2026-11-02)

| Check                                | Result                                                                         |
| ------------------------------------ | ------------------------------------------------------------------------------ |
| `npm run lint` / `npm run typecheck` | Pass                                                                           |
| `npm test`                           | Pass, 17/17 (new: logo files exist and declared sizes match the files)         |
| `npm run build`                      | Pass, all routes static; icon.png and apple-icon.png emitted                   |
| `npm run test:e2e`                   | Pass, 12 routes x 2 viewports, axe clean                                       |
| Manual                               | Screenshots reviewed at 1440px and 390px; `og:image` present on interior pages |

**Defects found and fixed:** per-page Open Graph metadata dropped the share image (now set explicitly via `defaultOgImage`); with the larger official logo the desktop nav was cramped at 1024px, so the full nav now starts at 1280px and the menu button is used below that.

## Phase 1 (2026-11-02)

Run on Node 22.23, Next 16.4.3, in a Linux container. Results below are from commands actually executed.

| Check                | Command                                 | Result                                                |
| -------------------- | --------------------------------------- | ----------------------------------------------------- |
| Lint                 | `npm run lint`                          | Pass, 0 problems                                      |
| Types                | `npm run typecheck`                     | Pass, 0 errors                                        |
| Unit tests           | `npm test`                              | Pass, 15/15 tests in 4 files                          |
| Production build     | `npm run build`                         | Pass. 16 routes, all prerendered static               |
| Browser smoke + a11y | `npm run test:e2e` against `next start` | Pass: 12 routes x 3 viewports (1440px, 1024px, 390px) |

**The smoke test checks:** HTTP 200, exactly one `<h1>`, no `undefined`/`null`/`NaN` in page text, no horizontal overflow, axe-core WCAG 2.0/2.1 A+AA, no console errors, skip link is the first tab stop, desktop active-nav state, mobile menu opens, navigates and closes, robots.txt blocks crawlers pre-launch.

**Defects found and fixed in this phase**

- Brand gold small text failed AA contrast on white (3.2:1) and Primary Green (4.4:1). Added text-only tints `gv-gold-deep` and `gv-gold-bright`; axe now passes.

**Not yet covered**

- Real-device / Safari testing; Lighthouse performance; screen-reader walkthrough (planned before launch)
- `npm audit` reports advisories in dev dependency trees; not addressed in Phase 1

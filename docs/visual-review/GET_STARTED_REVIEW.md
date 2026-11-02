# Get Started Page Review (2026-11-02)

The page lives at `/get-started`. Screenshots were taken from a production build with `tests/e2e/visual-review.mjs`.

| View                | File                                                                         |
| ------------------- | ---------------------------------------------------------------------------- |
| Desktop, 1440px     | [get-started-desktop.png](./get-started-desktop.png)                         |
| Mobile, 390px       | [get-started-mobile.png](./get-started-mobile.png)                           |
| Lighthouse, mobile  | [get-started-lighthouse-mobile.html](./get-started-lighthouse-mobile.html)   |
| Lighthouse, desktop | [get-started-lighthouse-desktop.html](./get-started-lighthouse-desktop.html) |

Each wizard step, its error states and the Florida-only notice were also checked at 390px and 1440px.

## Lighthouse 12 (local production build)

|         | Performance | Accessibility | Best practices | SEO |
| ------- | ----------- | ------------- | -------------- | --- |
| Mobile  | 96          | 100           | 100            | 69  |
| Desktop | 100         | 100           | 100            | 69  |

- The first mobile run scored 84; two reruns scored 96 and 95 (the saved report is 96). SEO fails only on the intentional pre-launch noindex.

## What the form does not collect

No Social Security number, date of birth, bank account numbers, tax returns, paystubs, driver's license, credit report or full application data. Free-text notes and messages that look like an SSN or an account/card number are rejected on the client and server. Secure applications and documents go through ARIVE.

## Debugging checklist

| Test                         | Where            | Result                                                                                                          |
| ---------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------- |
| Every financing goal         | unit, smoke, e2e | All five goals complete end to end and classify correctly (purchase, refinance, Non-QM, investment, other)      |
| Every step transition        | unit, smoke      | Next validates only the current step and focuses the first error; the progress indicator marks the current step |
| Back button                  | unit, smoke      | Back from step 4 to step 1 keeps every entry                                                                    |
| Required fields              | unit, smoke      | Blank steps are blocked with field-level messages and no request                                                |
| Optional fields              | unit             | Estimated value, financing amount, notes and message may be blank                                               |
| Florida-only                 | unit, smoke      | Florida preselected; another state shows the Florida-only notice and blocks the step; the server rejects it too |
| Invalid numbers              | unit, smoke      | Letters, negatives, out-of-range amounts and a loan larger than the value are rejected; valid amounts format    |
| Form reset                   | unit             | Enter advances steps without clearing entries; a leave-page warning shows while entries are unsaved             |
| Double-click submission      | unit, e2e        | One request in flight; one CRM record delivered                                                                 |
| Network timeout              | unit, e2e        | After 20 seconds a timeout message appears, entries are kept, no success                                        |
| Backend error                | unit, e2e        | 500, 502, 503, 429, spam check and a 200 without `ok` all show an error, never success                          |
| Valid submission             | unit, e2e        | Approved confirmation shown (focused, role=status) only after `{ ok: true }`                                    |
| ARIVE link enabled           | unit, e2e        | With an https URL, "Ready to Continue?" and "Start Your Secure Mortgage Application" appear on the confirmation |
| ARIVE link disabled          | unit, e2e        | No URL, or a non-https URL: the button is omitted                                                               |
| No data in logs or analytics | unit, e2e        | Server logs name channels only; nothing written to the console or browser storage; the site loads no analytics  |
| Accessibility and mobile     | smoke, axe       | WCAG 2.1 AA clean on steps 2 and 4 with errors, 16px inputs, 44px controls, no overflow at 320px                |

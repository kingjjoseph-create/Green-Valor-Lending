# Contact Page Review (2026-11-02)

The page lives at `/contact`. Screenshots were taken from a production build with `tests/e2e/visual-review.mjs`.

| View                | File                                                                 |
| ------------------- | -------------------------------------------------------------------- |
| Desktop, 1440px     | [contact-desktop.png](./contact-desktop.png)                         |
| Mobile, 390px       | [contact-mobile.png](./contact-mobile.png)                           |
| Lighthouse, mobile  | [contact-lighthouse-mobile.html](./contact-lighthouse-mobile.html)   |
| Lighthouse, desktop | [contact-lighthouse-desktop.html](./contact-lighthouse-desktop.html) |

## Lighthouse 12 (local production build)

|         | Performance | Accessibility | Best practices | SEO |
| ------- | ----------- | ------------- | -------------- | --- |
| Mobile  | 98          | 100           | 100            | 69  |
| Desktop | 100         | 100           | 100            | 69  |

- The first mobile run scored 95; the saved rerun scored 98. SEO fails only on the intentional pre-launch noindex.

## Contact information

Rows come only from `src/config/company.ts`; a row renders only when its value is set:

| Row            | Source                                                                                 | Today          |
| -------------- | -------------------------------------------------------------------------------------- | -------------- |
| Company        | `company.legalName`                                                                    | Shown          |
| Email          | `NEXT_PUBLIC_COMPANY_EMAIL`                                                            | Hidden (blank) |
| Phone          | `NEXT_PUBLIC_COMPANY_PHONE`                                                            | Hidden (blank) |
| Service state  | Florida                                                                                | Shown          |
| Business hours | `NEXT_PUBLIC_BUSINESS_HOURS`                                                           | Hidden (blank) |
| Office         | `NEXT_PUBLIC_PUBLISH_OFFICE_ADDRESS=true` plus street, city, state, ZIP (all required) | Hidden         |

While no phone or email exists, a short note asks visitors to use the form.

## Debugging checklist

| Test                      | Where                           | Result                                                                                        |
| ------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------- |
| Blank form                | unit (schema, API, form), smoke | All six fields reported; error summary focused; no request sent                               |
| Invalid email             | unit, smoke                     | Rejected client and server side                                                               |
| Invalid phone format      | unit, smoke                     | Fewer than 10 or more than 15 digits, letters, extensions rejected                            |
| Extremely long message    | unit, smoke                     | Input capped at 2,000; server rejects longer (400) and bodies over 16 KB (413)                |
| Spam challenge failure    | unit, e2e                       | Instant submissions and failed Turnstile tokens return `spam_check`; error shown, no delivery |
| Network failure           | unit, e2e                       | Error shown, entries kept, retry works                                                        |
| Duplicate submission      | unit, e2e                       | Button disabled in flight; same message within 10 minutes acknowledged but delivered once     |
| Successful submission     | unit, e2e                       | Confirmation (role=status, focused) only after the backend returns `{ ok: true }`             |
| Correct recipient routing | unit, e2e                       | Residential/Non-QM → `mortgage_inquiry` and the mortgage inbox when set; others → general     |
| Career Opportunity        | unit, smoke, e2e                | Form switches to a link to `/careers#apply`; the server rejects career posts with 422         |
| Mobile keyboard usability | unit, smoke                     | `type=email`/`inputmode=email`, `type=tel`, autocomplete, 16px inputs, no overflow at 320px   |

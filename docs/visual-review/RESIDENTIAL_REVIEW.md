# Residential Loans Page Review (2026-11-02)

The page lives at `/residential-loans`. Screenshots were taken from a production build with `tests/e2e/visual-review.mjs`.

| View                | File                                                                         |
| ------------------- | ---------------------------------------------------------------------------- |
| Desktop, 1440px     | [residential-desktop.png](./residential-desktop.png)                         |
| Mobile, 390px       | [residential-mobile.png](./residential-mobile.png)                           |
| Lighthouse, mobile  | [residential-lighthouse-mobile.html](./residential-lighthouse-mobile.html)   |
| Lighthouse, desktop | [residential-lighthouse-desktop.html](./residential-lighthouse-desktop.html) |

## Lighthouse 12 (local production build)

|         | Performance | Accessibility | Best practices | SEO |
| ------- | ----------- | ------------- | -------------- | --- |
| Mobile  | 97          | 100           | 100            | 69  |
| Desktop | 100         | 100           | 100            | 69  |

- SEO fails only "Page is blocked from indexing", because the site stays noindex until launch.
- One early mobile run scored 81 (TBT 440ms). That run happened while another browser job was running at the same time. Three later runs scored 96 to 98.

## Audit checklist

| Check                  | Result                                                                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Program section layout | 3 program cards, then a full-width "Other Residential Options" panel; 1 column on mobile                                                                  |
| Accordions             | 6 FAQs, built on native `<details>`. Smoke test opens/closes by click, opens with Enter, checks the FAQ link, runs axe with one open, and checks overflow |
| CTA links              | Hero and "Ask about your situation" → /contact; FAQ and final CTA → /get-started (smoke test)                                                             |
| Mobile                 | No horizontal overflow at 320 or 390px; the empty hero photo frame is hidden below 1024px                                                                 |
| Readability            | axe WCAG 2.1 AA passes at 5 widths; Lighthouse accessibility 100                                                                                          |
| Terminology            | Conventional/FHA/VA, PMI/MIP, funding fee, COE, DTI, Loan Estimate/Closing Disclosure timing reviewed for accuracy                                        |
| Down-payment claims    | No amounts or percentages (unit test). Stating them would be a Regulation Z trigger term                                                                  |
| FHA/VA affiliation     | VA card and page disclaimer state no affiliation; the test blocks "VA-approved" and similar wording                                                       |
| Rates / approvals      | No rates, APR, dollar figures or approval promises (unit test)                                                                                            |

# Non-QM Page Review (2026-11-02)

The page lives at `/non-qm`. Screenshots were taken from a production build with `tests/e2e/visual-review.mjs`.

| View                | File                                                               |
| ------------------- | ------------------------------------------------------------------ |
| Desktop, 1440px     | [non-qm-desktop.png](./non-qm-desktop.png)                         |
| Mobile, 390px       | [non-qm-mobile.png](./non-qm-mobile.png)                           |
| Lighthouse, mobile  | [non-qm-lighthouse-mobile.html](./non-qm-lighthouse-mobile.html)   |
| Lighthouse, desktop | [non-qm-lighthouse-desktop.html](./non-qm-lighthouse-desktop.html) |

## Lighthouse 12 (local production build)

|         | Performance | Accessibility | Best practices | SEO |
| ------- | ----------- | ------------- | -------------- | --- |
| Mobile  | 96          | 100           | 100            | 69  |
| Desktop | 100         | 100           | 100            | 69  |

SEO fails only "Page is blocked from indexing", because the site stays noindex until launch.

## Audit checklist

| Check                           | Result                                                                                                                                                                                                                      |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accuracy of Non-QM descriptions | QM/ATR framing (CFPB), bank statement, DSCR, and 1099 descriptions reviewed. Listed for counsel in COMPLIANCE_REVIEW.md                                                                                                     |
| Confirmed program availability  | **Not confirmed. This needs Green Valor's wholesale partners.** Programs are described as types of financing "to explore", subject to partner availability. "Other options" names no products (`verifiedPrograms` is empty) |
| No invented thresholds          | Unit test blocks percentages, dollar amounts, month or year counts, credit-score-like numbers, and DSCR minimums                                                                                                            |
| Terminology                     | Non-QM, QM, ability to repay, DSCR, PITIA components, 1099                                                                                                                                                                  |
| No guaranteed approval          | Unit test. The lender's role is stated in the overview, the process step 5, and the FAQ                                                                                                                                     |
| Not "no documentation"          | The overview and FAQ state it explicitly. A test allows only the denial                                                                                                                                                     |
| Not superior or relaxed         | The copy says it is "not better or worse". A test blocks easier, relaxed, and lenient wording                                                                                                                               |
| CTA routing                     | Hero and "Ask about your situation" go to /contact. "Explore Your Options" goes to /get-started (smoke test)                                                                                                                |
| Table responsiveness            | A semantic `<table>` (caption, row and column headers) from 768px; stacked cards below. The smoke test checks which one is visible at each width                                                                            |
| Mobile                          | No overflow at 320 or 390px, including with an FAQ open. Line breaks never split "Non-QM" at the hyphen                                                                                                                     |
| Accessibility                   | axe WCAG 2.1 AA passes at 5 widths, including with an FAQ open; Lighthouse accessibility 100                                                                                                                                |

## Defects found and fixed

1. **"Non-" / "QM" line breaks** in headings on mobile. Added `keepTogether()` to keep hyphenated terms on one line.
2. **Mobile overflow (83px at 390, 149px at 320)** caused by fix 1: inside the flex `<summary>`, each text fragment became its own flex item and could not wrap. The question is now wrapped in a single span, so FAQ questions wrap normally on every page.

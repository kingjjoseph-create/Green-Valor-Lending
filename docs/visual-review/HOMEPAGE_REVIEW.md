# Homepage Visual Review (2026-11-02)

Screenshots were captured from a production build (`next build && next start`) with `tests/e2e/visual-review.mjs`. The script scrolls the page so lazy-loaded images render.

| View                | File                                                                   |
| ------------------- | ---------------------------------------------------------------------- |
| Desktop, 1440px     | [homepage-desktop.png](./homepage-desktop.png)                         |
| Mobile, 390px       | [homepage-mobile.png](./homepage-mobile.png)                           |
| Lighthouse, mobile  | [homepage-lighthouse-mobile.html](./homepage-lighthouse-mobile.html)   |
| Lighthouse, desktop | [homepage-lighthouse-desktop.html](./homepage-lighthouse-desktop.html) |

## Lighthouse 12.8 (local production build)

|                            | Performance | Accessibility | Best practices | SEO |
| -------------------------- | ----------- | ------------- | -------------- | --- |
| Mobile (simulated slow 4G) | 95          | 100           | 100            | 66  |
| Desktop                    | 100         | 100           | 100            | 66  |

- **SEO 66 is intentional.** The only failing audit is "Page is blocked from indexing" because the site is `noindex` until launch (`NEXT_PUBLIC_ALLOW_INDEXING`). Every other SEO audit passes.
- **Mobile metrics:** FCP 1.0s, LCP 2.9s (the header logo), TBT 60ms, CLS 0. **Desktop:** FCP 0.3s, LCP 0.6s, TBT 0ms, CLS 0.
- Scores will shift once real photography is added. The hero photo will likely become the LCP element, and it is already marked for preload.

## Review notes

| Section                 | Desktop                                            | Mobile                                                  | Notes                                                                       |
| ----------------------- | -------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------- |
| Header                  | Logo is the horizontal file at 48px, undistorted   | Logo is 36px, Get Started visible, hamburger            | Verified by automated aspect-ratio check                                    |
| 1. Hero                 | Editorial split; text left, photo slot right (4:5) | Text only; empty photo slot hidden until a photo exists | Charcoal/green on ivory, AA+                                                |
| 2. Who We Are           | Copy + five highlights panel                       | Stacks                                                  | No entrance animation, because it sits at the fold                          |
| 3. Mortgage Solutions   | Two equal cards with "may include" lists           | Cards stack; CTAs wrap                                  | Availability and government non-affiliation disclaimer                      |
| 4. Why Green Valor      | Four cards                                         | 1 → 2 → 4 columns                                       | No reviews or statistics                                                    |
| 5. How It Works         | Horizontal four-step timeline with icons           | Vertical timeline                                       | Step 4 states the lender makes the credit decision; broker disclosure below |
| 6. Borrower Education   | Photo slot + topics                                | Topics only                                             | Calculator marked "Coming soon" until the feature flag is on                |
| 7. Loan Officer Support | Copy + features + photo slot                       | Copy + features                                         | CTA goes to /careers                                                        |
| 8. Recruitment          | Green band, hero-size headline, reversed GV mark   | Mark hidden on small screens                            | Gold-bright eyebrow on green, 5.3:1                                         |
| 9. Final CTA            | Ivory band, two buttons                            | Buttons stack                                           | Get Started → /get-started, Join Our Team → /careers                        |

## Defects found and fixed

1. **Overflow at 320px (67px):** non-wrapping CTA labels widened the solution cards. CTAs now wrap, and card padding is reduced below 380px.
2. **Duplicate landmark (axe):** two `LegalDisclaimer` regions shared the name "Disclosures". Added a `label` prop with unique names.
3. **Faded text at the fold:** the scroll-driven entrance animation used opacity, which left "Who We Are" at reduced contrast until scrolled (Lighthouse color-contrast failure). The reveal is now movement-only (no opacity), so text is never shown at reduced contrast.
4. **Deprecated `priority` on next/image:** switched to `preload` (Next.js 16).
5. **Decorative hairlines** in the recruitment band read as a stray border. Removed.
6. **Empty photo panels on mobile:** hidden below 1024px until licensed photos exist.

## Pending

- Licensed photography for `homeHero`, `businessMeeting`, `teamTraining` (see docs/IMAGE_LICENSES.md).
- Mortgage payment calculator (feature flag `NEXT_PUBLIC_FEATURE_CALCULATORS`).

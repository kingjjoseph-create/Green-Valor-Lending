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
| Mobile (simulated slow 4G) | 96          | 100           | 100            | 66  |
| Desktop                    | 100         | 100           | 100            | 66  |

- **SEO 66 is intentional.** The only failing audit is "Page is blocked from indexing" because the site is `noindex` until launch (`NEXT_PUBLIC_ALLOW_INDEXING`). Every other SEO audit passes.
- **Mobile:** LCP 2.7s; the LCP element is the hero video poster (a 46 KB WebP, preloaded at high priority). CLS is 0. The first run after adding the video scored 93; the saved rerun scored 96.
- **Desktop:** LCP 0.7s.
- The hero video (2.1 MB MP4) streams after the page loads and does not count toward LCP.

## Review notes

| Section                 | Desktop                                                                                        | Mobile                                       | Notes                                                                                                                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header                  | Logo is the horizontal file at 48px, undistorted                                               | Logo is 36px, Get Started visible, hamburger | Verified by automated aspect-ratio check                                                                                                                                                                               |
| 1. Hero                 | Full-width looping brand video under a Deep Green overlay (light tint, deeper behind the copy) | Same, with an even overlay                   | White text measured on every half-second of the video: 5.3:1 or better. Eyebrow is white with a gold rule (gold text fell to 2:1 on bright frames). Pause/Play button; still poster under reduced motion or Data Saver |
| 2. Who We Are           | Copy + five highlights panel                                                                   | Stacks                                       | No entrance animation, because it sits at the fold                                                                                                                                                                     |
| 3. Mortgage Solutions   | Two equal cards with "may include" lists                                                       | Cards stack; CTAs wrap                       | Availability and government non-affiliation disclaimer                                                                                                                                                                 |
| 4. Why Green Valor      | Four cards                                                                                     | 1 → 2 → 4 columns                            | No reviews or statistics                                                                                                                                                                                               |
| 5. How It Works         | Horizontal four-step timeline with icons                                                       | Vertical timeline                            | Step 4 states the lender makes the credit decision; broker disclosure below                                                                                                                                            |
| 6. Borrower Education   | Photo slot + topics                                                                            | Topics only                                  | Calculator marked "Coming soon" until the feature flag is on                                                                                                                                                           |
| 7. Loan Officer Support | Copy + features + photo slot                                                                   | Copy + features                              | CTA goes to /careers                                                                                                                                                                                                   |
| 8. Recruitment          | Green band, hero-size headline, reversed GV mark                                               | Mark hidden on small screens                 | Gold-bright eyebrow on green, 5.3:1                                                                                                                                                                                    |
| 9. Final CTA            | Ivory band, two buttons                                                                        | Buttons stack                                | Get Started → /get-started, Join Our Team → /careers                                                                                                                                                                   |

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

## Hero video (added 2026-11-02)

- Source: the video Green Valor supplied (19.75 s, 960×540, 24 fps, 14.4 MB).
- Re-encoded to `public/videos/home-hero.mp4`: H.264, CRF 27, audio removed, faststart, 2.1 MB. A VP9 WebM came out larger, so it was dropped.
- Poster: `home-hero-poster.webp` (768 px, 46 KB).
- Playback:
  - Muted, looped, inline, and hidden from assistive technology.
  - Starts from script, only when reduced motion is off and Data Saver is not on.
  - Pauses while scrolled out of view.
  - A visible Pause/Play button covers WCAG 2.2.2.
- Overlay: `#02331D` at 35% over the whole frame.
  - Desktop: plus a left-to-right scrim (85% → 55% → 0%) behind the copy.
  - Mobile: plus a 55% scrim.
- Tests: `hero-video.test.tsx`, plus smoke checks for autoplay, loop, muted, aria-hidden, pause/resume, and no playback under reduced motion.

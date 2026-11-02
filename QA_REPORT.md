# QA Report

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

# QA Report

## Phase 1 (2026-11-02)

Run on Node 22.23, Next 16.4.3, in a Linux container. Results below are from commands actually executed.

| Check                | Command                                 | Result                                        |
| -------------------- | --------------------------------------- | --------------------------------------------- |
| Lint                 | `npm run lint`                          | Pass, 0 problems                              |
| Types                | `npm run typecheck`                     | Pass, 0 errors                                |
| Unit tests           | `npm test`                              | Pass, 15/15 tests in 4 files                  |
| Production build     | `npm run build`                         | Pass. 16 routes, all prerendered static       |
| Browser smoke + a11y | `npm run test:e2e` against `next start` | Pass: 12 routes x 2 viewports (1440px, 390px) |

**The smoke test checks:** HTTP 200, exactly one `<h1>`, no `undefined`/`null`/`NaN` in page text, no horizontal overflow, axe-core WCAG 2.0/2.1 A+AA, no console errors, skip link is the first tab stop, desktop active-nav state, mobile menu opens, navigates and closes, robots.txt blocks crawlers pre-launch.

**Defects found and fixed in this phase**

- Brand gold small text failed AA contrast on white (3.2:1) and Primary Green (4.4:1). Added text-only tints `gv-gold-deep` and `gv-gold-bright`; axe now passes.

**Not yet covered**

- Real-device / Safari testing; Lighthouse performance; screen-reader walkthrough (planned before launch)
- `npm audit` reports advisories in dev dependency trees; not addressed in Phase 1

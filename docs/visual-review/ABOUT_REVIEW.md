# About Page Review (2026-11-02)

The page lives at `/about`. Screenshots were taken from a production build with `tests/e2e/visual-review.mjs`.

| View                | File                                                             |
| ------------------- | ---------------------------------------------------------------- |
| Desktop, 1440px     | [about-desktop.png](./about-desktop.png)                         |
| Mobile, 390px       | [about-mobile.png](./about-mobile.png)                           |
| Lighthouse, mobile  | [about-lighthouse-mobile.html](./about-lighthouse-mobile.html)   |
| Lighthouse, desktop | [about-lighthouse-desktop.html](./about-lighthouse-desktop.html) |

## Lighthouse 12 (local production build)

|         | Performance | Accessibility | Best practices | SEO |
| ------- | ----------- | ------------- | -------------- | --- |
| Mobile  | 96          | 100           | 100            | 69  |
| Desktop | 100         | 100           | 100            | 69  |

- Two later mobile runs both scored 96. The first run, made right after the screenshot browser, scored 87.
- SEO fails only on the intentional pre-launch noindex.

## Audit

| Check                                        | Result                                                                                                                                                                                                      |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No invented company history                  | No founding story, dates, years in business, or volumes. A unit test blocks "founded", "established", "since", years, "decades" and "years of experience"                                                   |
| No unsupported leadership claims             | Leadership is described only as "veteran-owned and operated", with values "associated with military service". No names, roles or experience claims                                                          |
| No fabricated military awards or credentials | A test blocks branch names, ranks, awards, combat and deployment words. The visual is the official reversed GV mark, with no flags or military imagery                                                      |
| No fake team profiles                        | `src/content/team.ts` ships empty. `TeamSection` renders nothing until a profile has `approved: true`. NMLS IDs show only when provided. The smoke test confirms no team section and no "NMLS ID" on /about |
| Correct business model                       | "Who we are" says the lender underwrites, decides and funds; Green Valor guides, explains and advocates                                                                                                     |
| Careers and borrower links                   | "Explore careers" and "Join Our Team" go to /careers. "Explore borrower resources" goes to /resources. "Explore Mortgage Solutions" goes to /#mortgage-solutions. Smoke checks the hrefs and click-throughs |
| Mobile and desktop consistency               | No overflow at 5 widths. Values are 1, 2, 3 or 5 columns by width; commitments stack on mobile. axe passes at every width                                                                                   |

## Adding team members later

Add an entry to `teamMembers` in `src/content/team.ts` with the approved name and title, plus an optional NMLS ID, bio and licensed portrait (local file, recorded in docs/IMAGE_LICENSES.md). Then set `approved: true`. The "Meet the Team" section appears automatically.

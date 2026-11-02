# Legal, Licensing and Compliance Pages Review (2026-11-02)

The pages are `/licensing`, `/privacy-policy`, `/terms-of-use`, `/consumer-complaints` and `/accessibility`. The old URLs `/privacy`, `/terms` and `/complaints` redirect permanently (308). Screenshots were taken from a production build with `tests/e2e/visual-review.mjs`.

| View                         | File                                                                                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Licensing, desktop / mobile  | [licensing-desktop.png](./licensing-desktop.png) / [licensing-mobile.png](./licensing-mobile.png)                                         |
| Complaints, desktop / mobile | [consumer-complaints-desktop.png](./consumer-complaints-desktop.png) / [consumer-complaints-mobile.png](./consumer-complaints-mobile.png) |
| Privacy, desktop / mobile    | [privacy-policy-desktop.png](./privacy-policy-desktop.png) / [privacy-policy-mobile.png](./privacy-policy-mobile.png)                     |
| Lighthouse /licensing        | [mobile](./licensing-lighthouse-mobile.html) / [desktop](./licensing-lighthouse-desktop.html)                                             |

## Lighthouse 12 on /licensing (local production build)

|         | Performance | Accessibility | Best practices | SEO |
| ------- | ----------- | ------------- | -------------- | --- |
| Mobile  | 97          | 100           | 100            | 69  |
| Desktop | 100         | 100           | 100            | 69  |

- The first mobile run scored 87; the saved rerun scored 97.
- SEO fails only on the intentional pre-launch noindex, which the publication guard now enforces.

## What each page shows today

| Page                | Current state (licensing unverified, no sign-offs)                                                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Every page          | Licensing notice above the header: no mortgage loan applications are taken; nothing is an offer to arrange a loan                                                                                                         |
| Licensing           | Pending-verification panel. Company details table: license number and NMLS ID "Not yet issued", status "Pending; not yet verified", no licensed state yet. Links to Florida OFR and NMLS Consumer Access (home page only) |
| Privacy Policy      | Draft banner, 15 sections with an on-page table of contents. No analytics, cookie, encryption, retention-period or certification claims                                                                                   |
| Terms of Use        | Draft banner, 15 sections                                                                                                                                                                                                 |
| Consumer Complaints | Draft banner. Company contact section: form link, and a note that phone and email will be listed once published. Florida OFR and CFPB complaint channels; NMLS and OFR license lookups                                    |
| Accessibility       | Draft banner. Practices actually in place, how they are tested, and that no independent audit or screen reader testing has been done yet                                                                                  |

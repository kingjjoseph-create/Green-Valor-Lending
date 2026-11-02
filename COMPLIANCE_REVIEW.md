# Compliance Review Log

> This is an engineering checklist, not legal advice. All disclosure language must be reviewed by licensed mortgage compliance counsel before launch.

## Business facts the site enforces

- Green Valor Lending LLC is a **mortgage broker**. It is **not** a direct lender, mortgage bank, or delegated/non-delegated correspondent. It does not underwrite, approve, or fund loans.
- **Florida only.** `licensedStates` contains only FL.
- **Company NMLS ID: pending.** The site prints no NMLS number until `NEXT_PUBLIC_COMPANY_NMLS_ID` is set. It never prints "Pending" as an ID.
- **No rates.** `features.publishRates` is hard-coded `false`.
- **No approval promises, testimonials, statistics, staff, history, or lender names** are published.

## Draft language awaiting counsel review (`src/content/disclosures.ts`)

| Key               | Draft text (summary)                                                   | Status                       |
| ----------------- | ---------------------------------------------------------------------- | ---------------------------- |
| `brokerStatement` | Broker, not lender; loans placed with and funded by wholesale partners | Draft                        |
| `serviceArea`     | Florida properties only                                                | Draft                        |
| `noCommitment`    | Educational only; not a commitment to lend; subject to lender approval | Draft                        |
| `equalHousing`    | Equal Housing Opportunity; FHA / ECOA                                  | Draft, hidden until approved |

## Pre-launch items for counsel / the business

- [ ] Florida OFR mortgage broker business license number and how it must appear
- [ ] Company NMLS ID and NMLS Consumer Access link format
- [ ] Whether the site may go live before the NMLS ID is issued (recommend: no public launch / indexing until licensed)
- [ ] Equal Housing Opportunity: approve wording and logo usage, supply the official logo file, then set `NEXT_PUBLIC_EQUAL_HOUSING_APPROVED=true` (hidden until then, per the business's instruction)
- [ ] Consumer Complaints page content (Florida OFR complaint process and company contact path)
- [ ] Individual loan officer NMLS IDs wherever an LO is named
- [ ] Privacy policy (GLBA, Florida law, cookies/analytics, CRM data handling)
- [ ] Terms of use
- [ ] TCPA consent language for any phone/SMS lead form
- [ ] Advertising review of every page under Reg Z / MAP Rule (no trigger terms without required disclosures)
- [ ] Non-QM product descriptions reviewed against actual wholesale partner availability
- [ ] Recruiting copy reviewed (no income claims)
- [ ] Homepage (`src/content/home.ts`): confirm the example programs (Conventional, FHA, VA, Bank Statement, DSCR, 1099, Alternative Documentation) are available through current wholesale partners. They are presented as "may include" with an availability disclaimer.
- [ ] Homepage government non-affiliation statement (VA / FHA) wording
- [ ] Residential page (`src/content/residential.ts`): review program descriptions (Conventional, FHA, VA), the FAQ answers (preapproval, mortgage insurance, closing costs including Florida documentary stamp and intangible taxes, TRID timing), and the VA/FHA/HUD non-affiliation statements. Down-payment amounts and percentages are deliberately left out (Reg Z 1026.24(d) trigger terms).
- [ ] Before listing anything under "Other Residential Options", verify current availability with a wholesale lending partner (`verifiedPrograms` array)

## Safeguards

- `robots.txt` disallows all crawling and pages carry `noindex` until `NEXT_PUBLIC_ALLOW_INDEXING=true`.
- Photography: only licensed, locally stored images; no remote image hosts allowed (test-enforced). See docs/IMAGE_LICENSES.md.
- Homepage copy is test-checked for rates/APR, guarantees, pre-approval, "we fund/approve/underwrite/lend", superlatives, statistics and testimonials, and must keep the "may include" label, the availability disclaimer, and "the lender makes the credit decision".
- Unit tests assert: FL only, two product categories, `publishRates` false, approved brand lines verbatim, no "guaranteed approval" style phrases, broker statement present.

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
- [ ] Careers page (`src/content/careers.ts`): review the licensing statement for aspiring originators, the "no guarantee of employment, sponsorship or training placement" language, and the growth-card bullets (education, marketing guidance, business development support). Confirm with leadership before adding any compensation, commission, lead, tool, mentorship schedule or reimbursement detail.
- [ ] Contact page: approve the consent acknowledgment (email/phone contact about the inquiry; not an application; no rate lock or approval). It does not cover autodialed calls or texts; add TCPA-compliant consent before any SMS or automated calling. Confirm the business hours and whether the office address may be published.
- [ ] Recruitment form: review the consent acknowledgment and confirm the Privacy Policy covers applicant data (purpose, retention, where the webhook/email delivers it). Resume uploads are intentionally omitted until a secure recruiting system is chosen.
- [ ] Homepage (`src/content/home.ts`): confirm the example programs (Conventional, FHA, VA, Bank Statement, DSCR, 1099, Alternative Documentation) are available through current wholesale partners. They are presented as "may include" with an availability disclaimer.
- [ ] Homepage government non-affiliation statement (VA / FHA) wording
- [ ] Residential page (`src/content/residential.ts`): review program descriptions (Conventional, FHA, VA), the FAQ answers (preapproval, mortgage insurance, closing costs including Florida documentary stamp and intangible taxes, TRID timing), and the VA/FHA/HUD non-affiliation statements. Down-payment amounts and percentages are deliberately left out (Reg Z 1026.24(d) trigger terms).
- [ ] Non-QM page (`src/content/non-qm.ts`): confirm Bank Statement, DSCR, and 1099 programs are currently available through a wholesale partner before launch, or remove the card. Review the QM/ability-to-repay explanation, the comparison table, and the FAQ answers. The page states no thresholds (scores, ratios, months of statements, down payment, reserves) or rates.
- [ ] Resources page: review the calculator disclaimer and assumptions, and confirm that a blank, user-entered rate is acceptable (no default rate is shown). Review the mortgage-basics and FAQ answers (credit inquiries, discount points, rate locks, escrow, TRID timing).
- [ ] About page (`src/content/about.ts`): confirm the "veteran-owned and operated" statement and the values copy. Before publishing any team profile, confirm the name, title, portrait license, and individual NMLS ID (verify in NMLS Consumer Access), then set `approved: true` in `src/content/team.ts`.
- [ ] Before listing anything under "Other Residential Options", verify current availability with a wholesale lending partner (`verifiedPrograms` array)

## Safeguards

- Contact inquiries go only to `/api/contact`, classified `mortgage_inquiry` (borrower) or `general_inquiry`; career inquiries are refused there and routed to `/careers`. No contact detail renders unless configured, and the address also needs explicit approval (test-enforced).

- Recruitment inquiries go only to `/api/recruitment` and are labeled `recruitment_inquiry` / `careers`, never as borrower leads. Server-side validation, same-origin check, size and rate limits, honeypot, no applicant data in logs, and no success message unless delivery is confirmed (test-enforced).

- `robots.txt` disallows all crawling and pages carry `noindex` until `NEXT_PUBLIC_ALLOW_INDEXING=true`.
- Photography: only licensed, locally stored images; no remote image hosts allowed (test-enforced). See docs/IMAGE_LICENSES.md.
- Homepage copy is test-checked for rates/APR, guarantees, pre-approval, "we fund/approve/underwrite/lend", superlatives, statistics and testimonials, and must keep the "may include" label, the availability disclaimer, and "the lender makes the credit decision".
- Unit tests assert: FL only, two product categories, `publishRates` false, approved brand lines verbatim, no "guaranteed approval" style phrases, broker statement present.

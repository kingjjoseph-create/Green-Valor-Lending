# Deployment (Vercel)

## First-time setup

1. Push the repository to GitHub.
2. In Vercel, **Add New Project** and import the repository. Framework preset: Next.js (auto-detected). No build overrides needed.
3. Add environment variables from `.env.example` under **Settings, Environment Variables**. Fill only confirmed values; blank values are hidden on the site.
4. Keep `NEXT_PUBLIC_ALLOW_INDEXING=false` on Preview and on Production until launch sign-off. While any release blocker remains, a build with it set to `true` (or with `LAUNCH_CHECK=strict`) fails on purpose and lists the blockers.
5. Deploy. Every pull request gets a Preview deployment.

## Get Started inquiries (/get-started)

The four-step wizard posts to `/api/inquiry`. It is a preliminary lead intake, not a loan application.

| Variable                                 | Purpose                                                                                                                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `INQUIRY_WEBHOOK_URL`                    | CRM endpoint. Receives a JSON `mortgage_inquiry` record (`category: "borrower_lead"`) with `classification` (goal, product interest, transaction, occupancy, follow-up priority), `property`, `financing` and `contact`. |
| `INQUIRY_WEBHOOK_SECRET`                 | Optional HMAC signature, same format as the other webhooks.                                                                                                                                                              |
| `INQUIRY_EMAIL_FROM`, `INQUIRY_EMAIL_TO` | Email notification through Resend (`RESEND_API_KEY`). Fall back to the contact settings.                                                                                                                                 |
| `NEXT_PUBLIC_BORROWER_APPLICATION_URL`   | Approved ARIVE borrower portal (https). Shown on the confirmation only when set and licensing is verified.                                                                                                               |

- Server order: validate, spam checks (honeypot, minimum fill time, optional Turnstile), classify, deliver/notify, then answer. `{ ok: true }` means at least one channel accepted the inquiry; the confirmation is shown only then. If one channel fails and another succeeds, the failure is logged by channel name (no applicant data).
- Florida only: any other state is rejected on the client and the server with an explanation.
- Duplicate submissions within 10 minutes are acknowledged once, not delivered twice. Per-IP rate limit: 5 per 10 minutes per instance.

## Contact form (/contact)

The contact form posts to `/api/contact`. Configure at least one delivery channel as **server-only** variables:

| Variable                                                 | Purpose                                                                                                                                                                                                 |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CONTACT_WEBHOOK_URL`                                    | CRM or automation endpoint. Receives a JSON `contact_inquiry` record classified as `mortgage_inquiry` (Residential, Non-QM; `crm.leadType: "borrower"`) or `general_inquiry` (General Question, Other). |
| `CONTACT_WEBHOOK_SECRET`                                 | Optional HMAC signature, same format as the recruitment webhook.                                                                                                                                        |
| `RESEND_API_KEY`, `CONTACT_EMAIL_FROM`                   | Email notification through Resend (verified sending domain required).                                                                                                                                   |
| `CONTACT_EMAIL_TO`                                       | General inbox. Falls back to `NEXT_PUBLIC_COMPANY_EMAIL`.                                                                                                                                               |
| `CONTACT_MORTGAGE_EMAIL_TO`                              | Optional inbox for Residential and Non-QM inquiries.                                                                                                                                                    |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Optional Cloudflare Turnstile challenge. Set both, or neither.                                                                                                                                          |

- "Career Opportunity" never goes through this endpoint: the form sends visitors to the Careers recruitment form, and the server rejects it with 422.
- Spam protection: honeypot, minimum fill time, optional Turnstile, per-IP rate limit (5 per 10 minutes per instance), and duplicate suppression (the same message from the same email within 10 minutes is acknowledged once, not delivered twice).
- With no channel configured the endpoint returns 503 and the form says online messages are unavailable. Success shows only after a channel accepts the message.
- Business hours (`NEXT_PUBLIC_BUSINESS_HOURS`) and the office address (`NEXT_PUBLIC_PUBLISH_OFFICE_ADDRESS=true` plus street, city, state, ZIP) appear only when supplied. Never enter a placeholder address.

## Recruitment inquiries (/careers)

The careers form posts to its own endpoint, `/api/recruitment`, which is separate from any borrower inquiry flow. Each submission is sent as a `recruitment_inquiry` record (category `careers`), never as a borrower lead. Configure at least one delivery channel as **server-only** variables (no `NEXT_PUBLIC_` prefix, never committed):

| Variable                     | Purpose                                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `RECRUITMENT_WEBHOOK_URL`    | HTTPS endpoint of the recruiting CRM, ATS, or automation (Zapier, Make, etc.). Receives a JSON POST.                  |
| `RECRUITMENT_WEBHOOK_SECRET` | Optional. Adds `X-Green-Valor-Signature: sha256=<HMAC-SHA256 of the raw body>` so the receiver can verify the sender. |
| `RESEND_API_KEY`             | Email delivery through Resend. Requires a verified sending domain.                                                    |
| `RECRUITMENT_EMAIL_FROM`     | Sender, e.g. `Careers <careers@yourdomain.com>`.                                                                      |
| `RECRUITMENT_EMAIL_TO`       | Recipient. Falls back to `NEXT_PUBLIC_RECRUITING_EMAIL`.                                                              |

- A submission succeeds when at least one configured channel accepts it. With no channel configured the endpoint returns 503 and the form tells the applicant online inquiries are unavailable; it never shows a false success.
- Protections: same-origin check, JSON only, 16 KB body limit, per-IP rate limit (5 per 10 minutes per server instance), hidden honeypot field, server-side validation. Applicant details are not written to logs.
- There is no resume upload. Add one only with a secure recruiting system (signed uploads, malware scanning, access control).
- `NEXT_PUBLIC_FEATURE_CAREERS_APPLICATION=false` hides the form and disables the endpoint.

## Launch checklist

- [ ] All items in COMPLIANCE_REVIEW.md resolved, each with a reviewer and approval date
- [ ] Licensing verified on NMLS Consumer Access and the Florida OFR license search, and recorded in `src/config/compliance-approvals.json`
- [ ] `npm run launch:check` reports no release blockers (run it with the Production environment variables)
- [ ] No `data-placeholder` elements remain
- [ ] Get Started delivery configured, a test inquiry received, and the ARIVE link verified
- [ ] Contact delivery configured and a test message received in the right inbox
- [ ] Recruitment delivery configured and a test inquiry received end to end
- [ ] Official logos and favicon in place
- [ ] `NEXT_PUBLIC_SITE_URL` set to the production domain; custom domain configured in Vercel
- [ ] `npm run check` and `npm run test:e2e` pass on the release commit
- [ ] Set `NEXT_PUBLIC_ALLOW_INDEXING=true` on Production only, redeploy, submit sitemap

## Publication guard

Until licensing is verified and every sign-off is recorded (`src/lib/release-blockers.mjs`):

- Every page shows a licensing notice.
- The site is never indexed.
- The ARIVE application button is hidden.
- The legal pages show a "Draft for legal review" banner.

The old legal URLs `/privacy`, `/terms` and `/complaints` permanently redirect to `/privacy-policy`, `/terms-of-use` and `/consumer-complaints`.

## Notes

- `NEXT_PUBLIC_*` values are inlined at build time; redeploy after changing them.
- Secrets (e.g. `CRM_API_KEY`) must never use the `NEXT_PUBLIC_` prefix.

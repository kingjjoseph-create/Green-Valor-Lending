# Deployment (Vercel)

## First-time setup

1. Push the repository to GitHub.
2. In Vercel, **Add New Project** and import the repository. Framework preset: Next.js (auto-detected). No build overrides needed.
3. Add environment variables from `.env.example` under **Settings, Environment Variables**. Fill only confirmed values; blank values are hidden on the site.
4. Keep `NEXT_PUBLIC_ALLOW_INDEXING=false` on Preview and on Production until launch sign-off.
5. Deploy. Every pull request gets a Preview deployment.

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

- [ ] All items in COMPLIANCE_REVIEW.md resolved
- [ ] No `data-placeholder` elements remain
- [ ] Recruitment delivery configured and a test inquiry received end to end
- [ ] Official logos and favicon in place
- [ ] `NEXT_PUBLIC_SITE_URL` set to the production domain; custom domain configured in Vercel
- [ ] `npm run check` and `npm run test:e2e` pass on the release commit
- [ ] Set `NEXT_PUBLIC_ALLOW_INDEXING=true` on Production only, redeploy, submit sitemap

## Notes

- `NEXT_PUBLIC_*` values are inlined at build time; redeploy after changing them.
- Secrets (e.g. `CRM_API_KEY`) must never use the `NEXT_PUBLIC_` prefix.

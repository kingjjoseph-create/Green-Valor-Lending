# Deployment (Vercel)

## First-time setup

1. Push the repository to GitHub.
2. In Vercel, **Add New Project** and import the repository. Framework preset: Next.js (auto-detected). No build overrides needed.
3. Add environment variables from `.env.example` under **Settings, Environment Variables**. Fill only confirmed values; blank values are hidden on the site.
4. Keep `NEXT_PUBLIC_ALLOW_INDEXING=false` on Preview and on Production until launch sign-off.
5. Deploy. Every pull request gets a Preview deployment.

## Launch checklist

- [ ] All items in COMPLIANCE_REVIEW.md resolved
- [ ] No `data-placeholder` elements remain
- [ ] Official logos and favicon in place
- [ ] `NEXT_PUBLIC_SITE_URL` set to the production domain; custom domain configured in Vercel
- [ ] `npm run check` and `npm run test:e2e` pass on the release commit
- [ ] Set `NEXT_PUBLIC_ALLOW_INDEXING=true` on Production only, redeploy, submit sitemap

## Notes

- `NEXT_PUBLIC_*` values are inlined at build time; redeploy after changing them.
- Secrets (e.g. `CRM_API_KEY`) must never use the `NEXT_PUBLIC_` prefix.

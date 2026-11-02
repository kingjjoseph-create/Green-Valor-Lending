# Green Valor Lending LLC: Website

Marketing website for **Green Valor Lending LLC**, a veteran-owned wholesale mortgage brokerage serving Florida.

> Built on Service. Driven by Valor.

Green Valor is a **mortgage broker**, not a lender. Site copy must never describe the company as underwriting, approving, or funding loans. See [COMPLIANCE_REVIEW.md](./COMPLIANCE_REVIEW.md).

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript (strict) · Tailwind CSS 4 · shadcn/ui on Radix · Lucide icons · Vitest · Playwright + axe-core smoke test · Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in only confirmed values
npm run dev                  # http://localhost:3000
```

## Scripts

| Script                        | Purpose                                                                                                         |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                 | Local dev server                                                                                                |
| `npm run build` / `npm start` | Production build / serve                                                                                        |
| `npm run lint`                | ESLint (flat config, `eslint-config-next`)                                                                      |
| `npm run typecheck`           | `tsc --noEmit`                                                                                                  |
| `npm test`                    | Vitest unit tests (`tests/unit`)                                                                                |
| `npm run test:e2e`            | Browser smoke + accessibility test against a running server (`SMOKE_BASE_URL`, default `http://localhost:3000`) |
| `npm run format`              | Prettier (with Tailwind class sorting)                                                                          |
| `npm run check`               | lint + typecheck + unit tests + build                                                                           |

## Where things live

- `src/config/company.ts`: **single source of truth** for company facts, licensing, URLs, CRM, social, products, brand messaging
- `src/config/features.ts`: feature flags (conservative defaults)
- `src/config/navigation.ts`: header, footer and legal navigation, plus the route list used by the sitemap and tests
- `src/config/brand-assets.ts`: official logo registry
- `src/content/disclosures.ts`: draft disclosure language (pending compliance review)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full structure and conventions.

## Project docs

[DEVELOPMENT_PROGRESS.md](./DEVELOPMENT_PROGRESS.md) · [ARCHITECTURE.md](./ARCHITECTURE.md) · [QA_REPORT.md](./QA_REPORT.md) · [COMPLIANCE_REVIEW.md](./COMPLIANCE_REVIEW.md) · [DEPLOYMENT.md](./DEPLOYMENT.md)

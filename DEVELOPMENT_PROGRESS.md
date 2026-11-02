# Development Progress

## Phase 1: Project initialization and global architecture (complete, 2026-11-02)

**Done**

- Next.js 16.4 App Router project (TypeScript strict, Tailwind 4, ESLint flat config, Cache Components)
- shadcn/ui configuration and primitives (Button, Sheet, Separator); Lucide icons
- Directory structure per directive
- Central config: company, licensing, licensed states (FL only), URLs, CRM, social, products, brand messaging, feature flags
- Design tokens for the brand palette, AA-checked text tints, typography, reduced-motion support
- Global layout: skip link, sticky header with desktop nav + mobile sheet menu, primary "Get Started" CTA, footer with nav, brand lines, and draft compliance disclosures
- All 8 required routes + 4 legal/licensing routes scaffolded with metadata; 404 page; robots (noindex pre-launch); sitemap; placeholder favicon
- Unit tests (15) and browser smoke/accessibility test (12 routes x desktop + mobile)
- Tracking docs and `.env.example`

**Placeholders to remove before launch** (search `data-placeholder`)

- Text wordmark in place of the official logo (`src/components/layout/logo.tsx`)
- Placeholder favicon (`src/app/icon.svg`)
- `PhasePlaceholder` blocks on every interior page and the home page

## Needed from Green Valor

- Official logo files (horizontal, reversed/white, stacked, mark) in SVG or high-res PNG
- GitHub repository for the project
- Phone, email, recruiting email, office address (if publishing one)
- Company NMLS ID and Florida license number once issued
- Borrower application URL, scheduling URL, CRM choice
- Social media URLs
- Licensed Florida residential photography (or approval to source stock)
- Compliance counsel review of disclosures (see COMPLIANCE_REVIEW.md)

## Next phases (proposed)

- **Phase 2:** Home page and design components (hero photography, value sections, process, education teaser, recruiting band)
- **Phase 3:** Residential Loans, Non-QM, Resources pages
- **Phase 4:** About, Careers (loan officer recruiting), Contact, Get Started; forms + CRM integration
- **Phase 5:** Calculators (illustrative, no rates), legal page content, final QA, launch prep

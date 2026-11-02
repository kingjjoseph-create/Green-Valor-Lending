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

## Phase 1.1: Official logos (2026-11-02)

- Added the official logos supplied by Green Valor: horizontal (header, footer), stacked (social share image), GV mark (mobile menu, Apple touch icon), and the 64px favicon.
- Prepared files by trimming surrounding white space and making the white background transparent. Artwork and colors are unchanged; aspect ratios are enforced by a unit test.
- No reversed (light-on-dark) logo exists yet, so the footer shows the logo on a white plate.
- Default Open Graph image (`public/images/og-default.png`) applied to every page.

**Placeholders to remove before launch** (search `data-placeholder`)

- `PhasePlaceholder` blocks on every interior page and the home page

## Needed from Green Valor

- Optional: a reversed (white/gold) logo for dark backgrounds, and SVG versions of the logos for the sharpest rendering
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

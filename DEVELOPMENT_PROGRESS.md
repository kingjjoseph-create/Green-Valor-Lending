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
- Reversed GV mark (white/gold on green tile) used in the footer and for the Apple touch icon.
- Default Open Graph image (`public/images/og-default.png`) applied to every page.

## Phase 2: Global layout and shared components (2026-11-02)

**Done**

- Typography scale utilities (`type-hero`, `type-page-title`, `type-section-title`, `type-card-title`, `type-eyebrow`, `type-lead`, `type-body`, `type-support`, `type-legal`). Cormorant Garamond + Inter, self-hosted via `next/font`.
- Semantic color tokens with a green-surface re-map (`.surface-inverse`). Every pairing is contrast-verified by unit test (`src/config/design-tokens.ts`). Gold text uses AA-safe tints; the focus ring adapts to the surface.
- Header: horizontal logo, nav (Home, Residential Loans, Non-QM Loans, Resources, About Us, Careers [emphasized], Contact), Get Started visible at every width. Desktop nav from 1280px; below that a hamburger drawer with focus trap, Escape to close, focus return, background scroll lock, and close-on-navigate.
- Footer: identity, brokerage description, all required links including the new Consumer Complaints page and NMLS Consumer Access. Contact, address, social and NMLS render only when configured. Equal Housing identification is gated behind `NEXT_PUBLIC_EQUAL_HOUSING_APPROVED`.
- Shared components: Header, Footer, MobileNavigation, PageHero, SectionHeading, CTAButton, CTASection, ServiceCard, FeatureCard, ValueCard, ProcessTimeline, FAQAccordion, FormField, FormStatus, LegalDisclaimer, SectionContainer, ResponsiveImage, Breadcrumbs (with BreadcrumbList JSON-LD).
- Motion: hero fade-in plus CSS scroll-driven section entrance (no JavaScript), all disabled under `prefers-reduced-motion`.
- Image system: local-only licensed photo registry with briefs (`src/content/images.ts`, `docs/IMAGE_LICENSES.md`). No photos yet.
- `/styleguide` component gallery, off by default (404) and never in the sitemap.
- All pages now use PageHero with breadcrumbs.

## Phase 3: Homepage (2026-11-02)

**Done:** all nine homepage sections (hero, Who We Are, Mortgage Solutions, Why Green Valor, How It Works, Borrower Education, Loan Officer Support, Recruitment, Final CTA). Copy lives in `src/content/home.ts`; page-specific components are in `src/components/home/`. ProcessTimeline gained optional step icons. Entrance motion is now movement-only. CTAButton labels wrap on narrow screens. Visual review and Lighthouse reports are in `docs/visual-review/`.

**Placeholders to remove before launch** (search `data-placeholder`)

- `PhasePlaceholder` blocks on interior pages
- Decorative image panels (`data-placeholder="image"`) until licensed photography is added

## Needed from Green Valor

- Optional: SVG versions of the logos for the sharpest rendering
- Phone, email, recruiting email, office address (if publishing one)
- Company NMLS ID and Florida license number once issued
- Borrower application URL, scheduling URL, CRM choice
- Social media URLs
- Licensed photography for the slots in docs/IMAGE_LICENSES.md, or approval to purchase stock (my build environment cannot reach stock photo sites)
- Compliance approval of Equal Housing Opportunity wording and logo, plus the official EHO logo file
- Compliance counsel review of disclosures (see COMPLIANCE_REVIEW.md)

## Next phases (proposed)

- **Phase 4:** Residential Loans, Non-QM, Resources
- **Phase 5:** About, Careers, Contact, Get Started; forms + CRM integration
- **Phase 6:** Legal page content, calculators (illustrative, no rates), final QA, launch prep

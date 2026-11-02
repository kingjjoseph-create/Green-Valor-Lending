# Architecture

## Principles

1. **Server Components by default.** Client components only where interactivity requires it. Currently: `DesktopNav` (active link state via `usePathname`), `MobileNavigation` (drawer state) and the `Sheet` primitive. The FAQ uses native `<details>`, and entrance animations are CSS-only.
2. **One source of truth for company facts.** Components never hard-code phone numbers, emails, NMLS IDs, URLs or brand lines. They read `src/config/company.ts` through helpers in `src/lib/company.ts`.
3. **Never render missing data.** Unknown values are `null`. Helpers (`hasValue`, `getContactChannels`, `getSocialLinks`, `getNmlsLine`) return only what is configured, so a blank value hides the element rather than printing a placeholder. A unit test and the browser smoke test both fail if `undefined`, `null` or `NaN` reaches page text.
4. **Static first.** Every route prerenders as static content (Cache Components is enabled; the footer year uses `"use cache"`).
5. **Compliance is structural.** Broker/not-lender, Florida-only, no-commitment and Equal Housing statements render in the global footer from `src/content/disclosures.ts`. `features.publishRates` is hard-coded `false`.

## Directory layout

```
src/
  app/                    Routes (App Router). One folder per page, plus robots.ts, sitemap.ts, icon.png, apple-icon.png, not-found.tsx
  components/
    layout/               Header, DesktopNav, MobileNavigation, Footer, Logo, Container, SectionContainer,
                          PageHero, Breadcrumbs, SkipLink, PhasePlaceholder
    shared/               SectionHeading, CTAButton, CTASection, ServiceCard/FeatureCard/ValueCard (cards.tsx),
                          ProcessTimeline, FAQAccordion, LegalDisclaimer, ResponsiveImage
    forms/                FormField, FormStatus
    ui/                   shadcn/ui primitives (button, sheet, separator)
    home/ mortgage/ calculators/ careers/    Page-specific components (later phases)
  config/                 company.ts, features.ts, navigation.ts, brand-assets.ts, design-tokens.ts
  content/                disclosures.ts (draft legal copy), images.ts (licensed photo registry)
  lib/                    utils (cn), company helpers, metadata helper, navigation (isActive)
  styles/globals.css      Tailwind 4 theme + brand design tokens
public/
  logos/                  Official logo files
  images/                 og-default.png; licensed photography (pending)
tests/
  unit/                   Vitest
  e2e/smoke.mjs           Playwright + axe-core smoke test
docs/                     Supplementary documentation
```

## Routes

| Route                                                                                           | Status                                                           |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `/`                                                                                             | Shell: hero + product cards (full build Phase 2)                 |
| `/residential-loans`, `/non-qm`, `/resources`, `/about`, `/careers`, `/contact`, `/get-started` | Scaffolded: metadata + intro band + "In development" placeholder |
| `/licensing`, `/privacy`, `/terms`, `/accessibility`                                            | Scaffolded legal pages, content pending compliance review        |
| `/robots.txt`                                                                                   | Blocks all crawlers until `NEXT_PUBLIC_ALLOW_INDEXING=true`      |
| `/sitemap.xml`                                                                                  | Generated from `allRoutes`                                       |

## Design system

### Color

Tokens live in `src/config/design-tokens.ts` (source of truth plus contrast pairs) and `src/styles/globals.css` (CSS variables). A unit test keeps the two in sync and checks every pairing against WCAG 2.1.

| Token            | Hex     | Use                                                                                |
| ---------------- | ------- | ---------------------------------------------------------------------------------- |
| `gv-green`       | #02331D | Primary: headings, dark surfaces, primary buttons                                  |
| `gv-gold`        | #BD870B | Accent only: CTA fill (charcoal text, 4.8:1), rules, icons on green, large display |
| `gv-forest`      | #14452F | Hover state for primary                                                            |
| `gv-ivory`       | #F5F0E4 | Alternate section background                                                       |
| `gv-charcoal`    | #202824 | Body text                                                                          |
| `gv-gold-deep`   | #8A6208 | Gold text and focus ring on white/ivory                                            |
| `gv-gold-bright` | #C9962A | Gold text and focus ring on green                                                  |
| muted text       | #4A524E | Supporting copy on light surfaces                                                  |
| input border     | #8C8676 | Form control outline (3.6:1)                                                       |

**Never:** gold text on white (3.2:1) or ivory (2.9:1), or white text on gold (3.2:1). These are asserted to fail in tests as documentation.

Semantic utilities: `text-heading`, `text-foreground`, `text-muted-foreground`, `bg-surface-alt`. Add the `surface-inverse` class (or `SectionContainer tone="green"`) to any dark green block. It re-maps heading, text, muted, eyebrow, border and focus-ring colors, so components work unchanged on either surface.

### Typography

Cormorant Garamond (500/600/700) for headings and Inter for body, both self-hosted by `next/font/google` at build time. The scale is defined as Tailwind utilities in `globals.css`:

| Utility              | Use                            | Size            |
| -------------------- | ------------------------------ | --------------- |
| `type-hero`          | Home hero H1                   | 44 → 80px fluid |
| `type-page-title`    | Interior H1                    | 38 → 60px fluid |
| `type-section-title` | Section H2                     | 32 → 46px fluid |
| `type-card-title`    | Card / H3                      | 26px            |
| `type-eyebrow`       | Uppercase label (color adapts) | 12px            |
| `type-lead`          | Intro paragraph                | 17 → 19px       |
| `type-body`          | Body                           | 16px / 1.75     |
| `type-support`       | Secondary copy                 | 15px            |
| `type-legal`         | Fine print (min 12px)          | 12px            |

### Motion

`gv-fade-in` / `gv-fade-in-delay` animate hero content on load. `gv-reveal` (applied by `SectionContainer`) uses CSS scroll-driven animation (`animation-timeline: view()`), so there's no JavaScript and unsupported browsers just show content. Everything is disabled under `prefers-reduced-motion: reduce`. Hover and focus transitions are 200 to 300ms.

### Images

`ResponsiveImage` renders licensed local photos from `src/content/images.ts` via `next/image`. Empty slots render a decorative panel. See docs/IMAGE_LICENSES.md.

## Logos

`<Logo variant="horizontal" | "stacked" | "mark" | "mark-reversed" />` reads `src/config/brand-assets.ts` and renders through `next/image` at a fixed height with `width: auto`, so the aspect ratio is preserved. Files live in `public/logos/` (transparent PNGs prepared from the official files; artwork unchanged). Favicon `src/app/icon.png` is the official 64px file; `src/app/apple-icon.png` is the reversed mark on Primary Green. On Primary Green (footer) the reversed GV mark is used. A unit test checks each registered size matches the file.

## Metadata

Root layout sets `metadataBase`, a title template (`%s | Green Valor Lending`), default description, robots (noindex until launch) and Open Graph defaults including the default share image. Pages use `pageMetadata({ title, description, path })` for canonical URL + Open Graph.

## Substitutions from the directive

- **shadcn/ui CLI could not reach its registry** from the build environment (network policy). `components.json` is configured and the primitives in `src/components/ui` follow the shadcn new-york source on the `radix-ui` package; future components can be added with `npx shadcn add <name>` from a normal network.
- **Testing:** Vitest for unit tests; a Playwright script with axe-core for the browser smoke test (no Playwright Test runner yet; can be adopted in a later phase).

# Architecture

## Principles

1. **Server Components by default.** Client components only where interactivity requires it. Currently: `MainNav` (active link state via `usePathname`), `MobileNav` (sheet open state) and the `Sheet` primitive.
2. **One source of truth for company facts.** Components never hard-code phone numbers, emails, NMLS IDs, URLs or brand lines. They read `src/config/company.ts` through helpers in `src/lib/company.ts`.
3. **Never render missing data.** Unknown values are `null`. Helpers (`hasValue`, `getContactChannels`, `getSocialLinks`, `getNmlsLine`) return only what is configured, so a blank value hides the element rather than printing a placeholder. A unit test and the browser smoke test both fail if `undefined`, `null` or `NaN` reaches page text.
4. **Static first.** Every route prerenders as static content (Cache Components is enabled; the footer year uses `"use cache"`).
5. **Compliance is structural.** Broker/not-lender, Florida-only, no-commitment and Equal Housing statements render in the global footer from `src/content/disclosures.ts`. `features.publishRates` is hard-coded `false`.

## Directory layout

```
src/
  app/                    Routes (App Router). One folder per page, plus robots.ts, sitemap.ts, icon.png, apple-icon.png, not-found.tsx
  components/
    layout/               Header, footer, nav, logo, container/section, page intro, phase placeholder, skip link
    ui/                   shadcn/ui primitives (button, sheet, separator)
    home/ mortgage/ forms/ calculators/ careers/    Feature components (populated in later phases)
  config/                 company.ts, features.ts, navigation.ts, brand-assets.ts
  content/                Copy that needs review (disclosures)
  lib/                    utils (cn), company helpers, metadata helper
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

Brand palette exposed as Tailwind colors (`bg-gv-green`, `text-gv-gold`, etc.) and mapped onto shadcn semantic tokens (`primary` = Primary Green, `accent` = Gold, `secondary`/`muted` = Warm Ivory, `foreground` = Charcoal).

| Token            | Hex     | Use                                                                                   |
| ---------------- | ------- | ------------------------------------------------------------------------------------- |
| `gv-green`       | #02331D | Primary: headings, dark bands, primary buttons                                        |
| `gv-gold`        | #BD870B | Accent: CTA buttons (charcoal text, 4.8:1), rules, hover lines                        |
| `gv-forest`      | #14452F | Hover state for primary                                                               |
| `gv-ivory`       | #F5F0E4 | Section backgrounds                                                                   |
| `gv-charcoal`    | #202824 | Body text                                                                             |
| `gv-gold-deep`   | #8A6208 | Text-only gold tint for small labels on white/ivory (AA)                              |
| `gv-gold-bright` | #C9962A | Text-only gold tint for small labels on Primary Green (AA; brand gold is 4.4:1 there) |

The two text-only tints exist because brand gold fails WCAG AA for small text on both white (3.2:1) and Primary Green (4.4:1). Brand gold is used unchanged everywhere else.

Typography: **Cormorant Garamond** (display serif, h1 to h3) + **Inter** (body/UI), via `next/font/google` (self-hosted at build time).

## Logos

`<Logo variant="horizontal" | "stacked" | "mark" />` reads `src/config/brand-assets.ts` and renders through `next/image` at a fixed height with `width: auto`, so the aspect ratio is preserved. Files live in `public/logos/` (transparent PNGs prepared from the official files; artwork unchanged). Favicon `src/app/icon.png` and `src/app/apple-icon.png` come from the official files too. No reversed logo exists yet, so on Primary Green the logo sits on a white plate. A unit test checks each registered size matches the file.

## Metadata

Root layout sets `metadataBase`, a title template (`%s | Green Valor Lending`), default description, robots (noindex until launch) and Open Graph defaults including the default share image. Pages use `pageMetadata({ title, description, path })` for canonical URL + Open Graph.

## Substitutions from the directive

- **shadcn/ui CLI could not reach its registry** from the build environment (network policy). `components.json` is configured and the primitives in `src/components/ui` follow the shadcn new-york source on the `radix-ui` package; future components can be added with `npx shadcn add <name>` from a normal network.
- **Testing:** Vitest for unit tests; a Playwright script with axe-core for the browser smoke test (no Playwright Test runner yet; can be adopted in a later phase).

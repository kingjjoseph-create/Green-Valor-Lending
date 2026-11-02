# Image Licensing Record

Every photograph on the site must be properly licensed, stored locally in `public/images/`, registered in `src/content/images.ts` with its license, and recorded in the table below. Hotlinking is not possible: `next.config.ts` allows no remote image hosts, and a unit test enforces this.

## Current status

One photo is in place (`floridaHome`, shown in the homepage Borrower Education section). Every other slot in `src/content/images.ts` is `null`, so components show a neutral decorative brand panel marked `data-placeholder="image"`.

## Photo brief (one per slot)

| Slot            | Subject                                                      |
| --------------- | ------------------------------------------------------------ |
| homeHero        | Upscale Florida residential architecture, warm natural light |
| residentialHero | Modern Florida family home exterior                          |
| nonQmHero       | Contemporary Florida home or investment property             |
| resourcesHero   | Calm home interior or homeowner reviewing documents          |
| aboutHero       | Contemporary office setting                                  |
| careersHero     | Collaborative training / real estate professionals           |
| contactHero     | Professional business meeting                                |
| getStartedHero  | Welcoming Florida home entrance                              |
| floridaHome     | Florida residential architecture detail                      |
| officeSetting   | Contemporary office interior                                 |
| businessMeeting | Professional consultation at a table                         |
| teamTraining    | Small group training session                                 |

Avoid images showing identifiable people with captions or context implying they are Green Valor staff or clients unless that is true.

## License log

| File                                                                 | Slot            | Source                                                               | License                                                               | Attribution required    | Acquired   | Record                                                                              |
| -------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------- | ---------- | ----------------------------------------------------------------------------------- |
| `public/images/florida-home.jpg`                                     | floridaHome     | Unsplash, Maxim Simonov (photo Di4DCF3COu4), supplied by Green Valor | [Unsplash License](https://unsplash.com/license): free commercial use | No (credit appreciated) | 2026-11-02 | Cropped to 4:3 and resized to 2400×1800                                             |
| `public/videos/home-hero.mp4`, `public/videos/home-hero-poster.webp` | Home hero video | Supplied by Green Valor Lending (2026-11-02)                         | To be confirmed by Green Valor                                        | To be confirmed         | 2026-11-02 | Confirm the commercial license and model releases for the identifiable people shown |

## Adding a photo

1. Obtain the license (purchase, commission, or a license that permits commercial use without attribution conflicts).
2. Export at about 2400px on the long edge (JPEG quality 80, or WebP/AVIF). `next/image` generates responsive sizes.
3. Save to `public/images/<slot>.jpg` and set the slot in `src/content/images.ts` with `width`, `height`, `alt`, and `license`.
4. Add a row to the license log above.

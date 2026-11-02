/**
 * Official Green Valor Lending logo files (supplied by the business 2026-11-02).
 *
 * Files in /public/logos were prepared from the originals by trimming the
 * surrounding white space and making the white background transparent.
 * Logo artwork and colors are unchanged. Width/height are the files'
 * intrinsic sizes so next/image preserves the aspect ratio: logos must never
 * be stretched, recolored or distorted.
 *
 * No reversed (light-on-dark) version has been supplied, so on dark
 * backgrounds the logo sits on a light plate. Add a `horizontal-reversed`
 * entry here if one is provided.
 */
export type LogoVariant = "horizontal" | "stacked" | "mark";

export type LogoAsset = { src: string; width: number; height: number };

export const brandAssets: { available: boolean; logos: Partial<Record<LogoVariant, LogoAsset>> } = {
  available: true,
  logos: {
    horizontal: { src: "/logos/green-valor-horizontal.png", width: 1400, height: 349 },
    stacked: { src: "/logos/green-valor-stacked.png", width: 1000, height: 698 },
    mark: { src: "/logos/green-valor-mark.png", width: 666, height: 470 },
  },
};

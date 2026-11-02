/**
 * Official logo files. The business has not uploaded them yet.
 *
 * When the files arrive, place them in /public/logos using these names, set
 * `available: true`, and fill in each file's intrinsic width/height so
 * next/image preserves the aspect ratio (logos must never be stretched,
 * recolored or distorted).
 *
 * Until then, <Logo /> renders a clearly marked text wordmark placeholder.
 */
export type LogoVariant = "horizontal" | "stacked" | "mark" | "horizontal-reversed";

export type LogoAsset = { src: string; width: number; height: number };

export const brandAssets: { available: boolean; logos: Partial<Record<LogoVariant, LogoAsset>> } = {
  available: false,
  logos: {
    // horizontal: { src: "/logos/green-valor-horizontal.svg", width: 0, height: 0 },
    // "horizontal-reversed": { src: "/logos/green-valor-horizontal-reversed.svg", width: 0, height: 0 },
    // stacked: { src: "/logos/green-valor-stacked.svg", width: 0, height: 0 },
    // mark: { src: "/logos/green-valor-mark.svg", width: 0, height: 0 },
  },
};

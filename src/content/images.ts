/**
 * Photography registry. Every photo used on the site MUST be:
 *   1. stored locally under /public/images (no hotlinking; next.config has no remote image hosts),
 *   2. optimized (next/image handles responsive sizes/formats),
 *   3. recorded here with its license, and listed in docs/IMAGE_LICENSES.md.
 *
 * Slots are null until properly licensed photography is supplied. Components
 * render a neutral brand panel (data-placeholder="image") for empty slots.
 */

export type ImageLicense = {
  /** e.g. "Purchased: Adobe Stock", "Commissioned: <photographer>", "Owned by Green Valor". */
  source: string;
  licenseName: string;
  /** Link to the license or purchase record, if any. */
  url?: string;
  /** Attribution text, when the license requires it. */
  attribution?: string;
  /** ISO date the license was obtained. */
  acquired: string;
};

export type ImageAsset = {
  src: `/images/${string}`;
  width: number;
  height: number;
  alt: string;
  license: ImageLicense;
};

export type ImageSlot =
  | "homeHero"
  | "residentialHero"
  | "nonQmHero"
  | "resourcesHero"
  | "aboutHero"
  | "careersHero"
  | "contactHero"
  | "getStartedHero"
  | "floridaHome"
  | "officeSetting"
  | "businessMeeting"
  | "teamTraining";

/** Intended subject for each slot, used as the photo brief. */
export const imageBriefs: Record<ImageSlot, string> = {
  homeHero: "Upscale Florida residential architecture, warm natural light",
  residentialHero: "Modern Florida family home exterior",
  nonQmHero: "Contemporary Florida home or investment property",
  resourcesHero: "Calm home interior or homeowner reviewing documents",
  aboutHero: "Contemporary office setting",
  careersHero: "Collaborative training / real estate professionals",
  contactHero: "Professional business meeting",
  getStartedHero: "Welcoming Florida home entrance",
  floridaHome: "Florida residential architecture detail",
  officeSetting: "Contemporary office interior",
  businessMeeting: "Professional consultation at a table",
  teamTraining: "Small group training session",
};

export const images: Record<ImageSlot, ImageAsset | null> = {
  homeHero: null,
  residentialHero: null,
  nonQmHero: null,
  resourcesHero: null,
  aboutHero: null,
  careersHero: null,
  contactHero: null,
  getStartedHero: null,
  floridaHome: null,
  officeSetting: null,
  businessMeeting: null,
  teamTraining: null,
};

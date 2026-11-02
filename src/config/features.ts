/**
 * Feature flags. Defaults are conservative: anything that needs a confirmed
 * value or a compliance sign-off ships OFF.
 */

function flag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value.trim() === "") return fallback;
  return value.trim().toLowerCase() === "true";
}

export const featureFlags = {
  /** Allow search engines to index the site. Keep OFF until launch sign-off. */
  allowIndexing: flag(process.env.NEXT_PUBLIC_ALLOW_INDEXING, false),
  /** Mortgage calculators (illustrative only, no live rates). Built in a later phase. */
  calculators: flag(process.env.NEXT_PUBLIC_FEATURE_CALCULATORS, false),
  /** Lead capture forms. Require a configured CRM before enabling. */
  leadForms: flag(process.env.NEXT_PUBLIC_FEATURE_LEAD_FORMS, false),
  /** Loan officer recruiting application on /careers. */
  careersApplication: flag(process.env.NEXT_PUBLIC_FEATURE_CAREERS_APPLICATION, false),
  /**
   * Rates must never be shown unless sourced from a compliant, live feed with
   * required APR disclosures. There is no such feed; this stays false.
   */
  publishRates: false,
} as const;

export type FeatureFlags = typeof featureFlags;

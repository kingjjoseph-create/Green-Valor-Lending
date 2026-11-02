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
  /** Mortgage payment calculator on /resources (user-entered rates only, no live rates). */
  calculators: flag(process.env.NEXT_PUBLIC_FEATURE_CALCULATORS, true),
  /** Lead capture forms. Require a configured CRM before enabling. */
  leadForms: flag(process.env.NEXT_PUBLIC_FEATURE_LEAD_FORMS, false),
  /**
   * Recruitment inquiry form on /careers. On by default: submissions only
   * succeed when server-side delivery (webhook or email) is configured, so an
   * unconfigured deployment shows an honest "not available" error, never a
   * false success. Set to "false" to hide the form entirely.
   */
  careersApplication: flag(process.env.NEXT_PUBLIC_FEATURE_CAREERS_APPLICATION, true),
  /** Internal component gallery at /styleguide (never indexed). Enable on preview deployments only. */
  styleguide: flag(process.env.NEXT_PUBLIC_ENABLE_STYLEGUIDE, false),
  /**
   * Rates must never be shown unless sourced from a compliant, live feed with
   * required APR disclosures. There is no such feed; this stays false.
   */
  publishRates: false,
} as const;

export type FeatureFlags = typeof featureFlags;

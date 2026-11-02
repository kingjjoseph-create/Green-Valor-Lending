/**
 * Central company configuration for Green Valor Lending LLC.
 *
 * RULES
 * - Never invent values. Anything not yet confirmed by the business is `null`.
 * - Public pages must only render a value when it is present. Use the helpers
 *   in `src/lib/company.ts` (e.g. `hasValue`, `getContactChannels`) instead of
 *   reading fields directly in components.
 * - Values that differ per environment (application URL, scheduling URL, CRM)
 *   come from `NEXT_PUBLIC_*` environment variables, documented in `.env.example`.
 *   Secrets (CRM API keys etc.) must never be placed here; they belong in
 *   server-only environment variables.
 */

import { featureFlags } from "./features";

/** Read an optional public env var; empty strings are treated as unset. */
function env(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export type PostalAddress = {
  street: string;
  suite?: string;
  city: string;
  state: string;
  postalCode: string;
};

export type SocialLinks = {
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  x: string | null;
};

export type ProductCategory = {
  id: "residential" | "non-qm";
  name: string;
  href: string;
  /** Short, compliance-safe summary. No rates, no approval language. */
  summary: string;
  published: boolean;
};

export type LicensedState = {
  code: "FL";
  name: string;
  /** State license number, once issued. */
  licenseNumber: string | null;
  regulator: string;
};

export const company = {
  legalName: "Green Valor Lending LLC",
  displayName: "Green Valor Lending",
  description:
    "Green Valor Lending is a veteran-owned wholesale mortgage brokerage serving Florida homebuyers and homeowners with residential and Non-QM mortgage options through wholesale lending partners.",
  /** One-to-two sentence description for the footer and short blurbs. */
  shortDescription:
    "A veteran-owned wholesale mortgage brokerage helping Florida borrowers compare residential and Non-QM loan options from wholesale lending partners.",
  businessType: "Wholesale Mortgage Brokerage",
  identity: "Veteran-Owned and Operated",

  /** Contact details: not yet provided by the business. */
  phone: env(process.env.NEXT_PUBLIC_COMPANY_PHONE),
  email: env(process.env.NEXT_PUBLIC_COMPANY_EMAIL),
  recruitingEmail: env(process.env.NEXT_PUBLIC_RECRUITING_EMAIL),
  address: null as PostalAddress | null,

  licensing: {
    /** Company NMLS ID. Status is "Pending" per the business; do not publish until issued. */
    nmlsId: env(process.env.NEXT_PUBLIC_COMPANY_NMLS_ID),
    nmlsStatus: "pending" as "pending" | "active",
    nmlsConsumerAccessUrl: "https://www.nmlsconsumeraccess.org/",
    /**
     * Equal Housing Opportunity identification renders only once compliance
     * has approved its wording and logo usage (see COMPLIANCE_REVIEW.md).
     */
    equalHousingApproved: process.env.NEXT_PUBLIC_EQUAL_HOUSING_APPROVED?.trim().toLowerCase() === "true",
    /** Brokerage, not a lender. Used in disclosures. */
    entityRole: "mortgage-broker" as const,
  },

  /** Florida is the only service state. Do not add states without authorization. */
  licensedStates: [
    {
      code: "FL",
      name: "Florida",
      licenseNumber: env(process.env.NEXT_PUBLIC_FL_LICENSE_NUMBER),
      regulator: "Florida Office of Financial Regulation",
    },
  ] as const satisfies readonly LicensedState[],

  urls: {
    /** Canonical site URL used for metadata, sitemap and Open Graph. */
    site: env(process.env.NEXT_PUBLIC_SITE_URL),
    /** Secure third-party borrower application (e.g. LOS/POS portal). */
    borrowerApplication: env(process.env.NEXT_PUBLIC_BORROWER_APPLICATION_URL),
    /** Consultation scheduling link (e.g. Calendly). */
    scheduling: env(process.env.NEXT_PUBLIC_SCHEDULING_URL),
  },

  crm: {
    /** Which CRM receives leads. Server-side credentials live in non-public env vars. */
    provider: env(process.env.NEXT_PUBLIC_CRM_PROVIDER),
    /** Public form/embed identifier if the CRM uses one. Not a secret. */
    formId: env(process.env.NEXT_PUBLIC_CRM_FORM_ID),
  },

  social: {
    facebook: env(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK),
    instagram: env(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM),
    linkedin: env(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN),
    youtube: env(process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE),
    x: env(process.env.NEXT_PUBLIC_SOCIAL_X),
  } satisfies SocialLinks,

  productCategories: [
    {
      id: "residential",
      name: "Residential Loans",
      href: "/residential-loans",
      summary:
        "Purchase and refinance options for Florida primary residences, second homes, and investment properties, placed with wholesale lending partners.",
      published: true,
    },
    {
      id: "non-qm",
      name: "Non-QM Loans",
      href: "/non-qm",
      summary:
        "Alternative documentation options for self-employed borrowers, investors, and others whose income does not fit a traditional profile.",
      published: true,
    },
  ] satisfies ProductCategory[],

  brand: {
    tagline: "Built on Service. Driven by Valor.",
    borrowerMessage: "Your Home. Our Commitment.",
    loanOfficerMessage: "Your Growth. Our Commitment.",
    recruitmentMessage: "Discipline. Ambition. Opportunity.",
    positioning: "Veteran-Owned. Service-Driven. Growth-Focused.",
  },

  features: featureFlags,
} as const;

export type Company = typeof company;

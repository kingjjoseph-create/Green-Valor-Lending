/**
 * DRAFT disclosure language, pending review by licensed compliance counsel
 * before launch. See COMPLIANCE_REVIEW.md. Do not treat as final legal text.
 */
import { company } from "@/config/company";

export const disclosures = {
  brokerStatement: `${company.legalName} is a mortgage broker, not a mortgage lender. We do not underwrite, approve, or fund loans. Loans are placed with and funded by third-party wholesale lending partners.`,
  serviceArea: `${company.displayName} arranges mortgage loans for properties located in the State of Florida only.`,
  noCommitment:
    "Information on this website is for general educational purposes and is not a commitment to lend or an offer of credit. All loans are subject to the lending partner's credit approval, underwriting guidelines, property eligibility, and program availability. Terms and programs are subject to change without notice.",
  /** Rendered only when company.licensing.equalHousingApproved is true. */
  equalHousing:
    "Equal Housing Opportunity. We do business in accordance with the Federal Fair Housing Act and the Equal Credit Opportunity Act.",
} as const;

export type DisclosureKey = keyof typeof disclosures;

/**
 * Publication guard. Until licensing is verified and every launch sign-off is
 * recorded, the site:
 * - shows a site-wide licensing notice and is never indexed by search engines,
 *   even if NEXT_PUBLIC_ALLOW_INDEXING=true (next.config.ts also fails that build);
 * - hides the secure mortgage application link (no applications are taken);
 * - labels the legal pages as drafts for legal review.
 */
import approvalsJson from "@/config/compliance-approvals.json";
import { company } from "@/config/company";
import { getReleaseBlockers, isApproved, isLicenseVerified, type Approvals } from "./release-blockers.mjs";

const approvals = approvalsJson as Approvals;

export const launchFacts = {
  nmlsId: company.licensing.nmlsId,
  stateLicenseNumber: company.licensedStates[0].licenseNumber,
  phone: company.phone,
  email: company.email,
};

export const complianceApprovals = approvals;
export const releaseBlockers = getReleaseBlockers(approvals, launchFacts);
export const licenseVerified = isLicenseVerified(approvals.licenseVerification, launchFacts);
export const launchReady = releaseBlockers.length === 0;
/** Search engines may index the site only after launch sign-off AND the indexing flag. */
export const indexingAllowed = company.features.allowIndexing && launchReady;
export const legalContentApproved = isApproved(approvals.legalContent);
export const legalContentApprovedOn = legalContentApproved ? (approvals.legalContent?.date ?? null) : null;

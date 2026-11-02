// @ts-check
/**
 * Public-launch release blockers. Plain JavaScript with no imports so the same
 * rules run in the site (src/lib/compliance.ts), in next.config.ts (which
 * fails a public build) and in `npm run launch:check`.
 *
 * @typedef {{ approved?: boolean, reviewer?: string | null, date?: string | null }} Approval
 * @typedef {{ status?: string, verifiedOn?: string | null, reviewer?: string | null }} LicenseVerification
 * @typedef {{
 *   licenseVerification?: LicenseVerification,
 *   legalContent?: Approval,
 *   privacyPractices?: Approval,
 *   formConsent?: Approval,
 *   loanProducts?: Approval,
 *   disclosures?: Approval,
 *   advertisingReview?: Approval,
 * }} Approvals
 * @typedef {{ nmlsId?: string | null, stateLicenseNumber?: string | null, phone?: string | null, email?: string | null }} LaunchFacts
 * @typedef {{ id: string, requirement: string, detail: string }} ReleaseBlocker
 */

/** @param {unknown} s */
const filled = (s) => typeof s === "string" && s.trim().length > 0;

/** A real calendar date written as YYYY-MM-DD. @param {unknown} s */
export function isIsoDate(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** NMLS IDs are numeric. Anything else ("Pending", "TBD") is not an ID. @param {unknown} id */
export function isNmlsId(id) {
  return typeof id === "string" && /^\d{1,12}$/.test(id.trim());
}

/** Approved only with a named reviewer and a valid date. @param {Approval | undefined} a */
export function isApproved(a) {
  return a?.approved === true && filled(a.reviewer) && isIsoDate(a.date);
}

/**
 * Licensing is verified only when someone has confirmed an ACTIVE license and
 * recorded when, and both the company NMLS ID and the Florida license number
 * are on file. A pending NMLS ID never counts.
 * @param {LicenseVerification | undefined} lv
 * @param {LaunchFacts} facts
 */
export function isLicenseVerified(lv, facts) {
  return (
    lv?.status === "active" &&
    isIsoDate(lv.verifiedOn) &&
    filled(lv.reviewer) &&
    isNmlsId(facts.nmlsId) &&
    filled(facts.stateLicenseNumber)
  );
}

/**
 * @param {Approvals} approvals
 * @param {LaunchFacts} facts
 * @returns {ReleaseBlocker[]}
 */
export function getReleaseBlockers(approvals, facts) {
  /** @type {ReleaseBlocker[]} */
  const blockers = [];
  const add = (/** @type {string} */ id, /** @type {string} */ requirement, /** @type {string} */ detail) =>
    blockers.push({ id, requirement, detail });

  if (!isLicenseVerified(approvals.licenseVerification, facts)) {
    add(
      "license-unverified",
      "Mortgage licensing status is verified",
      "Record an active license, the verification date and the reviewer in compliance-approvals.json, and set the company NMLS ID and Florida license number.",
    );
  }
  if (!isNmlsId(facts.nmlsId) || !filled(facts.stateLicenseNumber)) {
    add(
      "identification-missing",
      "Required company identification can be displayed accurately",
      "Set NEXT_PUBLIC_COMPANY_NMLS_ID (numeric) and NEXT_PUBLIC_FL_LICENSE_NUMBER once issued.",
    );
  }
  if (!filled(facts.phone) && !filled(facts.email)) {
    add(
      "company-contact-missing",
      "Verified company contact details are published",
      "Set NEXT_PUBLIC_COMPANY_PHONE and/or NEXT_PUBLIC_COMPANY_EMAIL so consumers (including complainants) can reach the company.",
    );
  }
  /** @type {[keyof Approvals, string, string][]} */
  const signoffs = [
    [
      "legalContent",
      "No placeholder or draft legal content remains",
      "Counsel approves the Privacy Policy, Terms of Use, Licensing, Consumer Complaints and Accessibility pages.",
    ],
    [
      "privacyPractices",
      "Privacy practices match the posted policy",
      "The business confirms the providers, sharing, retention and security described in the Privacy Policy.",
    ],
    [
      "formConsent",
      "Form consent handling is complete",
      "Counsel approves the consent wording on the Contact, Get Started and Careers forms (and TCPA consent before any calls or texts beyond the inquiry).",
    ],
    [
      "loanProducts",
      "Advertised loan products are confirmed",
      "Each program named on the site is confirmed as available through a current wholesale lending partner.",
    ],
    [
      "disclosures",
      "Required disclosures are approved",
      "Counsel approves the broker, service-area, no-commitment and government non-affiliation disclosures.",
    ],
    [
      "advertisingReview",
      "Mortgage advertising review is complete",
      "Counsel completes the page-by-page review in COMPLIANCE_REVIEW.md.",
    ],
  ];
  for (const [key, requirement, detail] of signoffs) {
    if (!isApproved(/** @type {Approval} */ (approvals[key])))
      add(`${String(key)}-unapproved`, requirement, detail);
  }
  return blockers;
}

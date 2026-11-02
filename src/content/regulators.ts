/**
 * Official regulator and complaint resources. Every value was copied from the
 * agency's own website on the date in `verifiedOn`; re-check before launch
 * and at least once a year. Never link an invented NMLS detail-page URL.
 */
export const regulatorsVerifiedOn = "2026-11-02";

export const floridaOfr = {
  name: "Florida Office of Financial Regulation",
  shortName: "Florida OFR",
  role: "Licenses and regulates mortgage brokers and loan originators in Florida.",
  website: "https://flofr.gov/",
  complaintUrl: "https://flofr.gov/enforcement/submit-a-complaint-or-tip",
  verifyLicenseUrl: "https://flofr.gov/education/verify-a-license",
  phone: "(850) 487-9687",
  mailingAddress: ["200 E. Gaines Street", "Tallahassee, FL 32399"],
  sources: [
    "https://flofr.gov/enforcement/submit-a-complaint-or-tip",
    "https://flofr.gov/divisions-offices/division-of-consumer-finance/frequently-asked-questions",
    "https://flofr.gov/education/verify-a-license",
  ],
} as const;

export const nmlsConsumerAccessService = {
  name: "NMLS Consumer Access",
  role: "The official, free lookup for state mortgage licenses and NMLS IDs of companies and individual loan originators.",
  url: "https://www.nmlsconsumeraccess.org/",
} as const;

export const cfpb = {
  name: "Consumer Financial Protection Bureau (CFPB)",
  role: "Accepts complaints about mortgages and other consumer financial products.",
  complaintUrl: "https://www.consumerfinance.gov/complaint/",
  phone: "(855) 411-2372",
  tty: "(855) 729-2372",
  hours: "Monday through Friday, 9 a.m. to 6 p.m. ET, except federal holidays",
  sources: ["https://www.consumerfinance.gov/complaint/"],
} as const;

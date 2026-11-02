/**
 * Licensing page copy. Values come from company config and
 * src/config/compliance-approvals.json. Never display a placeholder or
 * invented license number, and never link an invented NMLS detail page.
 */
export const licensingContent = {
  eyebrow: "Legal",
  title: "Licensing",
  description: "Licensing information for Green Valor Lending LLC, a Florida mortgage brokerage.",
  pending: {
    heading: "Licensing status: pending verification",
    body: "Green Valor Lending LLC is completing its mortgage licensing. A pending NMLS ID is not an active license. Until our licensing has been verified, we do not take mortgage loan applications or arrange loans, and nothing on this website is an offer to do so. This page will show our license details once they are issued and verified.",
  },
  verified: {
    heading: "Licensing status: verified",
  },
  notIssued: "Not yet issued",
  plannedState: "None yet. Green Valor plans to serve Florida only.",
  originators:
    "Each mortgage loan originator who works with you must be individually licensed. Wherever we name a loan originator, we will show their individual NMLS ID so you can look them up.",
  consumerAccessHelp:
    "Search by company name or NMLS ID. Green Valor Lending LLC will appear there once its NMLS ID is issued.",
} as const;

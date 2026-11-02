/**
 * Consumer Complaints page copy. Regulator details come from
 * src/content/regulators.ts (official sources, with the verification date).
 * Company contact details come only from company config.
 */
export const complaintsContent = {
  eyebrow: "Legal",
  title: "Consumer Complaints",
  description:
    "If you have a concern about Green Valor Lending LLC, we want to hear about it. You can also contact the agencies that regulate mortgage brokers.",
  draftNote:
    "This page is a draft prepared for review by legal counsel before the website launches. Regulator contact details were taken from the agencies' official websites.",
  company: {
    heading: "Contact Green Valor Lending first",
    body: "Many concerns can be resolved quickly when we know about them. Please tell us your name, the best way to reach you, and what happened, including any dates and the names of the people you worked with.",
    noChannels:
      "Our phone number and email address will be listed here once they are published. Until then, please send your concern through our contact form.",
    formLink: { label: "Send Us a Message", href: "/contact" },
  },
  regulators: {
    heading: "Florida and federal complaint resources",
    body: "You may contact these agencies at any time. You do not need to contact us first.",
  },
  verify: {
    heading: "Verify a mortgage license",
    body: "You can confirm the license of any mortgage company or loan originator, including ours once it is issued, using these official tools.",
  },
} as const;

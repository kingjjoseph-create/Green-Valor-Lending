/**
 * About page copy (/about).
 *
 * Compliance notes (see COMPLIANCE_REVIEW.md): no founding story, dates,
 * years in business, volumes, awards, or specific military service history.
 * "Veteran-owned and operated" is the only service claim, as provided by the
 * company. Green Valor is a broker; lenders underwrite, decide and fund.
 */
import { company } from "@/config/company";

export const aboutContent = {
  hero: {
    eyebrow: "Veteran-Owned & Operated",
    title: "Service Is Our Foundation. Integrity Is Our Standard.",
    description:
      "Green Valor Lending was built around a commitment to service, accountability, and meaningful relationships.",
  },

  whoWeAre: {
    eyebrow: "Who we are",
    title: "A Florida Mortgage Brokerage Built on Service.",
    paragraphs: [
      "Green Valor Lending is a veteran-owned and operated mortgage brokerage serving borrowers across Florida. As a broker, we help borrowers explore financing options offered through wholesale lending partners. The lender underwrites, makes the credit decision, and funds the loan; our role is to guide, explain, and advocate for you along the way.",
      "We are building Green Valor Lending around the standards we believe borrowers and mortgage professionals deserve: honest guidance, clear communication, and a culture where people can grow.",
    ],
    focusLabel: "Where we focus",
    focus: [
      {
        title: "Residential mortgage solutions",
        description: "Purchase and refinance options for Florida homes.",
      },
      {
        title: "Non-QM financing",
        description: "Alternative documentation options for unique income situations.",
      },
      {
        title: "Borrower education",
        description: "Plain-language guidance so you can decide with confidence.",
      },
      {
        title: "Loan officer training and support",
        description: "Resources and guidance for the professionals who serve borrowers.",
      },
      {
        title: "Professional growth and entrepreneurial spirit",
        description: "A place to build a career with discipline and ambition.",
      },
    ],
  },

  mission: {
    eyebrow: "Our mission",
    statement:
      "To serve borrowers with integrity and clarity while empowering mortgage professionals through education, support, and opportunities for meaningful growth.",
  },

  values: {
    eyebrow: "Our values",
    title: "The Principles Behind Our Work.",
    items: [
      {
        title: "Integrity",
        description:
          "We tell borrowers what we know, what we don't, and what to expect, even when it isn't what they hoped to hear.",
      },
      {
        title: "Service",
        description:
          "Every conversation starts with your goals. Our job is to make the process clearer and easier for you.",
      },
      {
        title: "Family",
        description:
          "A home is about the people in it. We treat clients and colleagues with the care we would want for our own families.",
      },
      {
        title: "Accountability",
        description:
          "We own our part of the process, follow through on commitments, and communicate when things change.",
      },
      {
        title: "Growth",
        description:
          "We invest in learning, for borrowers making informed decisions and for professionals building their careers.",
      },
    ],
  },

  leadership: {
    eyebrow: "Veteran-owned leadership",
    title: "Values Shaped by Service.",
    description:
      "Green Valor Lending is veteran-owned and operated. The values associated with military service shape how we lead the company and how we work with every borrower and professional.",
    qualities: [
      {
        title: "Responsibility",
        description: "Taking ownership of the work and the people who depend on it.",
      },
      { title: "Leadership", description: "Setting a clear direction and leading by example." },
      { title: "Commitment", description: "Seeing each client and each file through to the finish." },
      { title: "Professionalism", description: "Preparation, discipline, and respect in every interaction." },
      { title: "Teamwork", description: "Working together, sharing knowledge, and supporting one another." },
    ],
    motto: company.brand.positioning,
  },

  borrowers: {
    eyebrow: "Our commitment to borrowers",
    title: company.brand.borrowerMessage,
    description: "Buying or refinancing a home is a major decision. Here is what you can expect from us.",
    items: [
      {
        title: "Education",
        description: "We help you understand your options, the terms, and the trade-offs.",
      },
      {
        title: "Clear explanations",
        description: "Plain language instead of jargon, and answers to every question.",
      },
      { title: "Personalized service", description: "Guidance based on your goals, finances, and property." },
      { title: "Communication", description: "Timely updates from first conversation through closing." },
      {
        title: "Transparency",
        description: "Honest expectations about the process, costs, and the lender's role in decisions.",
      },
    ],
    cta: { label: "Explore borrower resources", href: "/resources" },
  },

  loanOfficers: {
    eyebrow: "Our commitment to loan officers",
    title: company.brand.loanOfficerMessage,
    description:
      "We are dedicated to helping mortgage professionals build sustainable careers and serve borrowers well.",
    items: [
      { title: "Training", description: "Ongoing learning on products, process, and compliance." },
      {
        title: "Mentorship and guidance",
        description: "Guidance from experienced colleagues, where available.",
      },
      {
        title: "Marketing support",
        description: "Brand-consistent resources to help you reach and serve clients.",
      },
      { title: "Business development", description: "Support for building a referral-based business." },
      {
        title: "Professional growth",
        description: "A collaborative culture focused on long-term development.",
      },
    ],
    cta: { label: "Explore careers", href: "/careers" },
  },

  team: {
    eyebrow: "Our team",
    title: "Meet the Team.",
  },

  cta: {
    title: "Built on Service. Focused on Your Future.",
    primary: { label: "Explore Mortgage Solutions", href: "/#mortgage-solutions" },
    secondary: { label: "Join Our Team", href: "/careers" },
  },
};

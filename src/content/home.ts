/**
 * Homepage copy. Kept separate from layout so compliance can review the
 * words in one place. Rules (see COMPLIANCE_REVIEW.md): no rates, no approval
 * promises, no statistics or testimonials, no invented history, and Green
 * Valor is a broker: lenders make credit decisions and fund loans.
 */
import { company } from "@/config/company";

export const homeContent = {
  hero: {
    eyebrow: "Veteran-Owned & Operated | Florida Mortgage Brokerage",
    title: company.brand.tagline,
    description:
      "Personalized residential and Non-QM mortgage solutions, guided by integrity, education, and a commitment to those we serve.",
    primaryCta: { label: "Explore Loan Options", href: "#mortgage-solutions" },
    secondaryCta: { label: "Get Started", href: "/get-started" },
    careersLink: { lead: "Interested in joining our team?", label: "Explore Careers", href: "/careers" },
  },

  whoWeAre: {
    eyebrow: "Who we are",
    title: "Rooted in Service. Committed to Your Future.",
    paragraphs: [
      "Green Valor Lending is a veteran-owned and operated mortgage brokerage serving borrowers across Florida. As a broker, we work with wholesale lending partners to help you compare residential and Non-QM financing options that may fit your goals.",
      "We bring the values of a veteran-owned business to every conversation: listen first, explain clearly, and follow through.",
    ],
    highlights: [
      { title: "Commitment to service", description: "Your goals set the direction for every conversation." },
      { title: "Clear communication", description: "Plain-language answers and timely updates." },
      {
        title: "Individualized guidance",
        description: "Options considered for your income, property, and plans.",
      },
      { title: "Borrower education", description: "Understand the terms and trade-offs before you decide." },
      { title: "Professional integrity", description: "Honest expectations at every step." },
    ],
    link: { label: "Learn more about us", href: "/about" },
  },

  solutions: {
    eyebrow: "Our mortgage solutions",
    title: "Mortgage Solutions Designed Around You.",
    description:
      "As a mortgage broker, we help you explore loan programs offered through wholesale lending partners and find a path that fits your situation.",
    listLabel: "Options we can help you explore may include:",
    cards: [
      {
        id: "residential" as const,
        title: "Residential Loans",
        description: "Explore home purchase and refinancing options with guidance tailored to your goals.",
        features: ["Conventional", "FHA", "VA", "Purchase and Refinance"],
        cta: { label: "Explore Residential Loans", href: "/residential-loans" },
      },
      {
        id: "non-qm" as const,
        title: "Non-QM Loans",
        description:
          "Explore alternative mortgage qualification options for borrowers with unique income or investment circumstances.",
        features: ["Bank Statement Loans", "DSCR Financing", "1099 Programs", "Alternative Documentation"],
        cta: { label: "Explore Non-QM Loans", href: "/non-qm" },
      },
    ],
    disclaimer:
      "Program availability depends on wholesale lending partner guidelines, borrower qualifications, property type, and market conditions. Not every program is available for every borrower or scenario. Green Valor Lending is not affiliated with or endorsed by the U.S. Department of Veterans Affairs, the Federal Housing Administration, or any government agency.",
  },

  why: {
    eyebrow: "Why Green Valor",
    title: "More Than a Mortgage. A Commitment to Service.",
    benefits: [
      {
        title: "Veteran-Owned Leadership",
        description:
          "As a veteran-owned and operated business, we bring service, accountability, and preparation to every client relationship.",
      },
      {
        title: "Personalized Guidance",
        description:
          "Every borrower's goals, income, and property are different. We take time to understand yours before discussing options.",
      },
      {
        title: "Transparent Communication",
        description:
          "Clear explanations, realistic expectations, and timely updates, so you know where things stand.",
      },
      {
        title: "Education-First Approach",
        description:
          "We explain terminology, trade-offs, and next steps so you can make informed decisions with confidence.",
      },
    ],
  },

  process: {
    eyebrow: "How it works",
    title: "A Clear Path Forward.",
    steps: [
      {
        title: "Connect With Our Team",
        description: "Reach out to start a conversation about your plans and questions.",
      },
      {
        title: "Discuss Your Financing Goals",
        description: "We learn about your goals, timeline, income, and the property you have in mind.",
      },
      {
        title: "Review Available Options",
        description:
          "We review programs from wholesale lending partners that may fit your situation and explain the trade-offs.",
      },
      {
        title: "Apply Securely and Move Toward Closing",
        description:
          "Submit your application through a secure process. The lender makes the credit decision, and we keep you informed through closing.",
      },
    ],
  },

  education: {
    eyebrow: "Borrower education",
    title: "Confidence Begins With Understanding.",
    description:
      "A mortgage is one of the largest financial decisions you will make. We are committed to helping you understand financing terminology, compare mortgage options, and know what to expect at each stage of the loan process.",
    topics: [
      {
        id: "basics" as const,
        title: "Mortgage Basics",
        description: "How a mortgage works, from down payment to closing.",
      },
      {
        id: "programs" as const,
        title: "Loan Program Education",
        description: "How common programs differ and who they may suit.",
      },
      {
        id: "terms" as const,
        title: "Terminology and Meaning",
        description: "Plain-language definitions of common mortgage terms.",
      },
      {
        id: "calculator" as const,
        title: "Mortgage Payment Calculator",
        description: "Estimate principal and interest for planning purposes.",
      },
    ],
    cta: { label: "Explore Resources", href: "/resources" },
  },

  loanOfficers: {
    eyebrow: "For loan officers",
    title: "Supporting the Professionals Behind Every Mortgage.",
    description:
      "Green Valor is focused on helping loan officers develop their careers. We aim to give mortgage professionals the training, tools, and collaborative environment to grow their business and serve borrowers well.",
    message: company.brand.loanOfficerMessage,
    features: [
      {
        title: "Training and Education",
        description: "Ongoing learning on products, process, and compliance.",
      },
      {
        title: "Marketing Support",
        description: "Brand-consistent resources to help you reach and serve clients.",
      },
      {
        title: "Business Development",
        description: "Guidance on building a sustainable referral-based business.",
      },
      { title: "Collaborative Growth", description: "A team culture where knowledge and wins are shared." },
    ],
    cta: { label: "Discover the Green Valor Difference", href: "/careers" },
  },

  recruitment: {
    eyebrow: "Careers at Green Valor",
    title: company.brand.recruitmentMessage,
    description:
      "We welcome experienced loan officers, disciplined entrepreneurs, and career-driven individuals interested in building a future in the mortgage industry.",
    cta: { label: "Explore Career Opportunities", href: "/careers" },
  },

  finalCta: {
    title: "Your Next Chapter Starts Here.",
    description:
      "Whether you're exploring financing options or building your mortgage career, Green Valor Lending is committed to helping you take the next step.",
    primary: { label: "Get Started", href: "/get-started" },
    secondary: { label: "Join Our Team", href: "/careers" },
  },
};

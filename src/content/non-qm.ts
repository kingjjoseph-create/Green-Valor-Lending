/**
 * Non-QM page copy (/non-qm).
 *
 * Compliance notes (see COMPLIANCE_REVIEW.md):
 * - Green Valor is a broker. The lender underwrites, decides and funds.
 * - Non-QM is never described as "no documentation", "no income
 *   verification", easier, or better than traditional financing.
 * - No qualification thresholds (credit scores, DSCR minimums, months of
 *   statements, down payment or reserve amounts) and no rates. Programs
 *   and requirements vary by lender.
 * - Named programs are presented as types of financing we can help
 *   borrowers explore, subject to current lending-partner availability.
 *   "Other alternative documentation options" names no product until a
 *   partner's availability is verified: add it to `verifiedPrograms`.
 */
export const nonQmContent = {
  hero: {
    eyebrow: "Alternative Mortgage Solutions",
    title: "Different Financial Paths. More Ways Forward.",
    description:
      "Explore mortgage options designed for borrowers with unique income documentation, self-employment, or real estate investment circumstances.",
    cta: { label: "Discuss Non-QM Options", href: "/contact" },
  },

  overview: {
    eyebrow: "What is Non-QM?",
    title: "Understanding Non-QM Financing.",
    paragraphs: [
      "A Qualified Mortgage (QM) is a home loan that meets standards set by the Consumer Financial Protection Bureau, including limits on certain loan features and requirements for how income is documented. A Non-Qualified Mortgage, or Non-QM loan, is a mortgage that falls outside those standards, often because of how the borrower's income is documented or because of the type of property or loan.",
      "Non-QM financing is not better or worse than a traditional mortgage. It is a different path that may suit borrowers whose finances are real and well documented, but in ways a traditional loan program is not built to evaluate.",
    ],
    facts: [
      {
        title: "Still fully underwritten",
        description:
          "Non-QM loans are underwritten by the lender. For most home loans, the lender must still make a reasonable, good-faith determination that you can repay.",
      },
      {
        title: "Rules vary by program and lender",
        description:
          "Each lender sets its own Non-QM programs and qualification guidelines, so requirements differ from one program to the next.",
      },
      {
        title: "Alternative documentation",
        description:
          "Instead of tax returns and W-2s, a program may evaluate income or assets using other records, such as bank statements, 1099 forms, or a property's rental income.",
      },
      {
        title: "Not a no-documentation loan",
        description:
          "Non-QM does not mean no documentation or no income verification. Lenders verify the information a program relies on.",
      },
    ],
  },

  programs: {
    eyebrow: "Non-QM programs",
    title: "Non-QM Programs to Explore.",
    description:
      "These are common types of Non-QM financing. Availability, guidelines, and terms depend on the wholesale lending partner and your full financial picture.",
    cards: [
      {
        id: "bank-statement" as const,
        title: "Bank Statement Loans",
        description:
          "Bank statement programs may use eligible personal or business bank statements, rather than tax returns, to help the lender evaluate qualifying income.",
        points: [
          "Deposit patterns over the review period matter: lenders look for consistent, verifiable income",
          "Not every deposit counts; transfers and other non-income deposits are typically excluded",
          "Each lender applies its own analysis, including how business expenses are accounted for",
        ],
      },
      {
        id: "dscr" as const,
        title: "DSCR Loans",
        description:
          "Debt Service Coverage Ratio (DSCR) loans are designed for eligible investment properties. The lender compares the property's qualifying rental income with its monthly obligations.",
        points: [
          "Obligations typically include principal, interest, property taxes, insurance, and any association dues",
          "Qualification focuses on the property's cash flow rather than the borrower's personal income",
          "Lenders still review credit, assets, reserves, and the property itself",
        ],
      },
      {
        id: "1099" as const,
        title: "1099 Borrower Programs",
        description:
          "1099 programs may consider alternate documentation, such as 1099 forms, to evaluate income for eligible independent contractors and self-employed borrowers.",
        points: [
          "Designed for income reported on 1099 forms rather than W-2s",
          "Lenders may request additional records to verify that the income is ongoing",
          "Eligibility, documentation, and terms vary by lender",
        ],
      },
    ],
    other: {
      title: "Other Alternative Documentation Options",
      description:
        "Some lenders offer other ways to document qualifying income or assets. Whether one is available depends on current lending-partner programs and your situation. We discuss a program only after confirming it is offered and may fit.",
      /** Add a program here only after verifying current lending-partner availability. */
      verifiedPrograms: [] as string[],
      link: { label: "Ask about your situation", href: "/contact" },
    },
  },

  scenarios: {
    eyebrow: "Who may benefit?",
    title: "Borrower Situations Non-QM May Fit.",
    description:
      "Non-QM financing may be worth exploring in situations like these. Whether it fits depends on your full financial picture, and a traditional loan may still be the better option.",
    items: [
      {
        title: "Business owners",
        description:
          "Owners whose tax returns reflect business deductions more than the cash flow they rely on.",
      },
      {
        title: "Self-employed professionals",
        description:
          "Consultants, physicians, agents, and other professionals paid outside a traditional salary.",
      },
      {
        title: "Independent contractors",
        description: "Borrowers whose income is reported on 1099 forms from one or more clients.",
      },
      {
        title: "Real estate investors",
        description:
          "Investors financing rental property who want the property's income to be part of the evaluation.",
      },
      {
        title: "Nontraditional documentation",
        description:
          "Borrowers with real, verifiable finances that standard documentation does not fully capture.",
      },
    ],
  },

  comparison: {
    eyebrow: "Traditional vs. Non-QM",
    title: "How Traditional and Non-QM Loans Compare.",
    description:
      "A general comparison. Specific requirements depend on the program, the lender, and your situation.",
    columns: ["Traditional (QM) mortgage", "Non-QM mortgage"] as const,
    rows: [
      {
        topic: "Income documentation",
        traditional: "Typically pay stubs, W-2s, and tax returns.",
        nonQm:
          "May use alternative records, such as bank statements, 1099 forms, or a property's rental income. Income is still documented and verified.",
      },
      {
        topic: "Guidelines",
        traditional:
          "Follow Qualified Mortgage standards and, often, agency guidelines such as Fannie Mae, Freddie Mac, FHA, or VA.",
        nonQm: "Set by each lender for its own programs, so they vary widely.",
      },
      {
        topic: "Underwriting",
        traditional: "Full underwriting of credit, income, assets, and property.",
        nonQm:
          "Full underwriting of credit, income or cash flow, assets, and property, using the program's documentation.",
      },
      {
        topic: "Ability to repay",
        traditional: "The lender verifies your ability to repay.",
        nonQm:
          "For most home loans, the lender must still make a good-faith determination of your ability to repay.",
      },
      {
        topic: "Rates, down payment, and reserves",
        traditional: "Set by the program and lender.",
        nonQm:
          "May differ from traditional loans. Rates, down payment, and reserve requirements are often higher, depending on the program and lender.",
      },
    ],
  },

  process: {
    eyebrow: "The Non-QM process",
    title: "How the Non-QM Process Works.",
    steps: [
      {
        title: "Initial Consultation",
        description: "We talk through your goals, the property, and how your income is earned.",
      },
      {
        title: "Financial Scenario Review",
        description: "We review your documentation and identify how your income and assets may be evaluated.",
      },
      {
        title: "Program Exploration",
        description:
          "We compare programs from wholesale lending partners that may fit, and explain their trade-offs and costs.",
      },
      {
        title: "Secure Application",
        description: "You apply through a secure process and provide the documents the program requires.",
      },
      {
        title: "Lender Underwriting and Closing Process",
        description:
          "The lender underwrites your application and makes the credit decision. We keep you informed through closing.",
      },
    ],
  },

  faq: {
    eyebrow: "Non-QM questions",
    title: "Common Questions About Non-QM.",
    description: "General answers. Requirements vary by lender and program, so ask us about your situation.",
    items: [
      {
        question: "What does Non-QM mean?",
        answer:
          "Non-QM stands for Non-Qualified Mortgage: a loan that does not meet the Consumer Financial Protection Bureau's Qualified Mortgage standards. Many Non-QM loans fall outside those standards because income is documented in an alternative way, such as with bank statements. Non-QM loans are still underwritten by the lender.",
      },
      {
        question: "Can self-employed borrowers qualify?",
        answer:
          "Many self-employed borrowers qualify for traditional loans using tax returns. When tax returns do not reflect the income a borrower relies on, for example because of business deductions, a bank statement or 1099 program may be worth exploring. Qualification depends on your full application, and the lender makes the credit decision.",
      },
      {
        question: "What are bank statement mortgage programs?",
        answer:
          "Bank statement programs use a period of personal or business bank statements to help the lender evaluate qualifying income instead of relying on tax returns. The lender reviews deposit patterns, excludes deposits that are not income, and applies its own method, including for business expenses. The length of the review period and other requirements are set by each program.",
      },
      {
        question: "How do DSCR loans work?",
        answer:
          "A Debt Service Coverage Ratio loan compares an investment property's qualifying rental income with its monthly obligations, such as principal, interest, taxes, insurance, and association dues. The ratio helps the lender evaluate whether the property's income supports the loan. Lenders set their own ratio requirements and still review credit, assets, reserves, and the property.",
      },
      {
        question: "Is a Non-QM loan the same as a no-documentation loan?",
        answer:
          "No. Non-QM loans use different documentation, not an absence of it. Lenders verify the income, assets, or property cash flow that a program relies on, and they review credit and the property before making a decision.",
      },
      {
        question: "Are Non-QM programs available for primary residences and investment properties?",
        answer:
          "It depends on the program and lender. Some Non-QM programs, such as certain bank statement and 1099 programs, may be used for primary residences, second homes, or investment properties. DSCR loans are designed for investment properties, not homes you live in. We can confirm what current programs allow for your property.",
      },
    ],
  },

  disclaimer:
    "Program descriptions are general information, not an offer of credit. Non-QM programs, guidelines, and terms vary by lender and are subject to availability through our wholesale lending partners, borrower qualifications, property type, and market conditions. Non-QM loans may have higher rates, fees, down payment, or reserve requirements than traditional mortgages.",

  cta: {
    title: "Your Financial Situation Deserves Individual Attention.",
    description:
      "Tell us how you earn and document your income, and we will help you understand the options that may fit.",
    primary: { label: "Explore Your Options", href: "/get-started" },
  },
};

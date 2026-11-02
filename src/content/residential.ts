/**
 * Residential Loans page copy (/residential-loans).
 *
 * Compliance notes (see COMPLIANCE_REVIEW.md):
 * - Green Valor is a broker. The lender underwrites, decides and funds.
 * - No rates, payments, or down-payment amounts/percentages. Stating a
 *   down-payment amount or percentage is a Regulation Z "trigger term"
 *   (12 CFR 1026.24(d)) that would require additional disclosures.
 * - No affiliation with VA, FHA or HUD is stated or implied.
 * - "Other residential options" names no product until a lending partner's
 *   availability is verified: add verified programs to `verifiedPrograms`.
 */
export const residentialContent = {
  hero: {
    eyebrow: "Residential Mortgage Solutions",
    title: "Your Home. Our Commitment.",
    description:
      "Explore mortgage options for buying or refinancing a home with personalized guidance from Green Valor Lending.",
    cta: { label: "Discuss Your Home Loan Options", href: "/contact" },
  },

  financing: {
    eyebrow: "Residential financing",
    title: "How Residential Financing Works With a Broker.",
    description:
      "Green Valor Lending is a mortgage broker. We connect qualifying Florida borrowers with residential financing options offered through wholesale lending partners. We are not the lender, so it helps to know who does what.",
    roles: [
      {
        id: "broker" as const,
        label: "Our role",
        title: "Green Valor Lending, your mortgage broker",
        points: [
          "Learn your goals, finances, and the property you have in mind",
          "Compare programs from wholesale lending partners that may fit your situation",
          "Help you prepare and submit your application and documents",
          "Keep you informed and coordinate with the lender through closing",
        ],
      },
      {
        id: "lender" as const,
        label: "The lender's role",
        title: "The wholesale lending partner",
        points: [
          "Sets its loan programs, pricing, and guidelines",
          "Underwrites your application and verifies your information",
          "Makes the credit decision on your loan",
          "Funds the loan at closing",
        ],
      },
    ],
  },

  programs: {
    eyebrow: "Loan programs",
    title: "Residential Loan Programs to Explore.",
    description:
      "Each program has its own guidelines, and lenders may add their own requirements. We will explain how each one works and whether it may fit your goals.",
    cards: [
      {
        id: "conventional" as const,
        title: "Conventional Loans",
        description:
          "A conventional loan is a mortgage that is not insured or backed by a government agency. Many follow guidelines set by Fannie Mae and Freddie Mac, including annual loan limits.",
        points: [
          "Used to buy a home or to refinance an existing mortgage",
          "May finance a primary residence, second home, or investment property, subject to guidelines",
          "Private mortgage insurance (PMI) is typically required with a smaller down payment and can generally be removed once you build enough equity",
        ],
      },
      {
        id: "fha" as const,
        title: "FHA Loans",
        description:
          "FHA loans are insured by the Federal Housing Administration. That insurance protects the lender, which can allow more flexible credit and down payment standards than many conventional loans.",
        points: [
          "Mortgage insurance includes an upfront premium, often financed into the loan, plus an annual premium paid monthly",
          "Lenders review credit, income, debts, and assets, and may apply standards stricter than FHA's minimums",
          "For primary residences; the home must meet FHA property standards, and loan amounts are subject to FHA county limits",
        ],
      },
      {
        id: "va" as const,
        title: "VA Loans",
        description:
          "VA loans are mortgages for eligible veterans, active-duty service members, certain National Guard and Reserve members, and some surviving spouses. Because the Department of Veterans Affairs backs part of the loan, these loans offer benefits such as flexible down payment options and no monthly mortgage insurance.",
        points: [
          "Eligibility is documented with a Certificate of Eligibility (COE)",
          "A one-time VA funding fee usually applies; some borrowers, including many who receive VA disability compensation, are exempt",
          "For primary residences; lenders still review credit, income, and the property",
        ],
        note: "As a veteran-owned brokerage, we understand the service behind this benefit, and we take the time to help eligible borrowers understand how it works.",
        affiliation:
          "Green Valor Lending is not affiliated with or endorsed by the U.S. Department of Veterans Affairs.",
      },
    ],
    other: {
      title: "Other Residential Options",
      description:
        "Some borrowers may be a fit for other residential programs. We present a program only after confirming that a wholesale lending partner currently offers it and that it may suit your situation.",
      /** Add a program here only after verifying current lending-partner availability. */
      verifiedPrograms: [] as string[],
      link: { label: "Ask about your situation", href: "/contact" },
    },
  },

  purposes: {
    eyebrow: "Purchase vs. refinance",
    title: "Buying a Home or Refinancing One.",
    cards: [
      {
        id: "purchase" as const,
        title: "Purchase",
        description: "Financing for a home you are buying.",
        points: [
          {
            title: "Buying a primary residence",
            description:
              "Financing a home you plan to live in, with options based on your finances and the property.",
          },
          {
            title: "First-time homebuyer considerations",
            description:
              "Learning the process step by step and setting a comfortable budget before you start shopping.",
          },
          {
            title: "Down payment and closing-cost planning",
            description:
              "Planning for the down payment, closing costs, and reserves, and where those funds may come from, such as savings or eligible gifts.",
          },
        ],
      },
      {
        id: "refinance" as const,
        title: "Refinance",
        description: "Replacing the mortgage on a home you already own.",
        points: [
          {
            title: "Rate-and-term refinancing",
            description:
              "Replacing your current loan to change the interest rate, the loan term, or both, without taking cash out.",
          },
          {
            title: "Cash-out refinancing where available",
            description:
              "Taking a new, larger loan against your home equity and receiving the difference in cash, subject to program limits.",
          },
          {
            title: "Evaluating costs and long-term financial effects",
            description:
              "Weighing closing costs, how long it takes to break even, and total interest over the life of the loan before you decide.",
          },
        ],
      },
    ],
  },

  review: {
    eyebrow: "What lenders generally review",
    title: "What Lenders Generally Review.",
    description:
      "Every lender sets its own standards, and requirements vary by program. These are the areas most lenders look at when they evaluate a residential mortgage application.",
    items: [
      {
        title: "Credit history",
        description:
          "Credit scores and payment history, including how you have managed past and current debts.",
      },
      {
        title: "Income and employment",
        description: "Stable, documented income, often verified with pay stubs, W-2s, or tax returns.",
      },
      {
        title: "Monthly debt obligations",
        description:
          "Your monthly debts compared with your income, known as your debt-to-income ratio (DTI).",
      },
      {
        title: "Available assets",
        description: "Funds for the down payment, closing costs, and any reserves the program requires.",
      },
      {
        title: "Down payment",
        description: "Affects your loan amount, mortgage insurance, and which programs you may consider.",
      },
      {
        title: "Property eligibility",
        description: "The home's appraised value, condition, property type, and how you will occupy it.",
      },
      {
        title: "Underwriting requirements",
        description:
          "The lender's underwriters verify your information against program and lender guidelines and make the final decision.",
      },
    ],
  },

  faq: {
    eyebrow: "Borrower education",
    title: "Common Questions About Home Loans.",
    description:
      "Straightforward answers to questions borrowers often ask. Your situation may differ, so ask us.",
    items: [
      {
        question: "What is the difference between a mortgage broker and a lender?",
        answer:
          "A mortgage lender provides the money for your loan, underwrites your application, and makes the credit decision. A mortgage broker, like Green Valor Lending, does not lend money. We learn your goals, compare options available through our wholesale lending partners, help you apply, and keep you informed through closing. The lender underwrites, approves or declines, and funds the loan.",
      },
      {
        question: "What is mortgage preapproval?",
        answer:
          "A preapproval is a lender's preliminary review of your credit, income, assets, and debts that estimates how much you may be able to borrow. It is not a final loan approval or a commitment to lend. Final approval depends on full underwriting, an appraisal, and the property. The preapproval is issued by the lender; as your broker, we help you gather and submit what the lender needs.",
      },
      {
        question: "How much down payment might I need?",
        answer:
          "It depends on the loan program, the property, how you will use it, and your finances. Some programs are designed for smaller down payments, and eligible VA borrowers may have flexible options. Lenders can require more than a program's minimum. A larger down payment generally lowers your loan amount and can reduce mortgage insurance costs. We can walk you through what applies to your situation.",
      },
      {
        question: "What is mortgage insurance?",
        answer:
          "Mortgage insurance protects the lender, not you, if a loan is not repaid, and it allows lenders to accept smaller down payments. Conventional loans with a smaller down payment typically require private mortgage insurance (PMI), which can generally be removed once you build enough equity. FHA loans carry an upfront and an annual mortgage insurance premium (MIP), which lasts for the life of many FHA loans. VA loans have no monthly mortgage insurance but usually carry a one-time funding fee.",
      },
      {
        question: "What are closing costs?",
        answer:
          "Closing costs are the fees and charges paid to complete your loan and transfer the property. They can include lender and broker fees, the appraisal, title insurance, recording fees, and prepaid items such as property taxes and homeowners insurance. In Florida, they may also include state documentary stamp and intangible taxes on the mortgage. The lender gives you a Loan Estimate within three business days of receiving your application and a Closing Disclosure at least three business days before closing.",
      },
      {
        question: "How do I get started?",
        answer:
          "Reach out to start a conversation. We will ask about your goals, income, and the property, explain options that may fit, and outline the documents you may need. Talking with us does not obligate you to apply.",
        link: { label: "Get started", href: "/get-started" },
      },
    ],
  },

  disclaimer:
    "Program descriptions are general information, not an offer of credit. Availability, terms, and eligibility depend on wholesale lending partner guidelines, borrower qualifications, property type, and market conditions, and are subject to change. Green Valor Lending is not affiliated with or endorsed by the U.S. Department of Veterans Affairs, the Federal Housing Administration, the U.S. Department of Housing and Urban Development, or any government agency.",

  cta: {
    title: "Let's Explore Your Home Financing Options.",
    description:
      "Tell us about your plans, and we will help you understand the residential options that may fit.",
    primary: { label: "Get Started", href: "/get-started" },
  },
};

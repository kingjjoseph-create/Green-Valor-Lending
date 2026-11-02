/**
 * Borrower Resources page copy (/resources).
 *
 * Compliance notes (see COMPLIANCE_REVIEW.md): general education only. No
 * rates, credit-score thresholds, closing timelines, or down-payment
 * minimums. Green Valor is a broker; lenders underwrite, decide and fund.
 */
export const resourcesContent = {
  hero: {
    eyebrow: "Borrower resources",
    title: "Knowledge Builds Confidence.",
    description:
      "Explore straightforward mortgage education and tools designed to help you make informed financing decisions.",
    links: [
      { label: "Payment calculator", href: "#calculator" },
      { label: "Mortgage basics", href: "#mortgage-basics" },
      { label: "Common questions", href: "#faq" },
    ],
  },

  calculator: {
    eyebrow: "Mortgage payment calculator",
    title: "Estimate a Monthly Housing Payment.",
    description:
      "Enter your own numbers to see an estimated monthly payment, including principal and interest, taxes, insurance, HOA dues, and mortgage insurance. Results update as you type.",
  },

  basics: {
    eyebrow: "Mortgage basics",
    title: "The Fundamentals, Explained Simply.",
    items: [
      {
        question: "What is a mortgage broker?",
        answer:
          "A mortgage broker helps borrowers find and apply for a loan offered by a lender. A broker does not lend money or make the credit decision. Green Valor Lending is a mortgage broker: we work with wholesale lending partners, help you compare options and apply, and keep you informed. The lender underwrites, approves or declines, and funds the loan.",
      },
      {
        question: "Prequalification versus preapproval",
        answer:
          "Prequalification is an informal estimate of what you might be able to borrow, often based on information you provide without full verification. Preapproval is a more thorough review by a lender, usually including a credit check and documentation of income and assets, and results in a letter stating how much the lender may be willing to lend, subject to conditions. Neither one is a final loan approval or a commitment to lend, and lenders use these terms in slightly different ways.",
      },
      {
        question: "Fixed versus adjustable interest rates",
        answer:
          "With a fixed-rate mortgage, the interest rate stays the same for the life of the loan, so the principal and interest payment does not change. An adjustable-rate mortgage (ARM) usually starts with a fixed period, after which the rate can change at set intervals based on a market index plus a margin, within limits called caps. After the initial period, your payment can go up or down. Before choosing an ARM, it is important to understand how high the payment could rise.",
      },
      {
        question: "Down payments",
        answer:
          "The down payment is the part of the purchase price you pay upfront; the loan covers the rest. Minimum requirements depend on the loan program, the property, and the lender. A larger down payment reduces the amount you borrow and can reduce mortgage insurance costs. Funds often come from savings, and some programs allow eligible gifts. Lenders document where down payment funds come from.",
      },
      {
        question: "Mortgage insurance",
        answer:
          "Mortgage insurance protects the lender, not the borrower, if a loan is not repaid. It allows lenders to accept smaller down payments. Conventional loans with a smaller down payment typically require private mortgage insurance (PMI), which can generally be removed once you build enough equity. FHA loans carry upfront and annual mortgage insurance premiums. VA loans have no monthly mortgage insurance but usually include a one-time funding fee.",
      },
      {
        question: "Debt-to-income ratio",
        answer:
          "Your debt-to-income ratio (DTI) compares your total monthly debt payments, including the proposed housing payment, with your gross monthly income. For example, monthly debts of $2,000 and gross monthly income of $6,000 give a DTI of about 33 percent. Lenders use DTI to help evaluate whether a payment is manageable, and acceptable levels vary by program and lender.",
      },
      {
        question: "Closing costs",
        answer:
          "Closing costs are the fees and charges paid to complete the loan and transfer the property, such as lender and broker fees, the appraisal, title insurance, recording fees, and prepaid items like property taxes and homeowners insurance. In Florida, they may also include state documentary stamp and intangible taxes on the mortgage. The lender provides a Loan Estimate within three business days of receiving your application and a Closing Disclosure at least three business days before closing.",
      },
      {
        question: "Escrow accounts",
        answer:
          "An escrow account, sometimes called an impound account, is managed by your loan servicer. Part of each monthly payment goes into the account, and the servicer uses it to pay your property taxes and homeowners insurance, and flood insurance if required, when they are due. Many loans require escrow. Because taxes and insurance can change, the servicer reviews the account each year, and your monthly payment may change as a result.",
      },
    ],
  },

  loanOptions: {
    eyebrow: "Understanding loan options",
    title: "Two Paths to Explore.",
    cards: [
      {
        id: "residential" as const,
        title: "Residential Mortgage Programs",
        description:
          "Conventional, FHA, and VA financing for buying or refinancing a home, with traditional income documentation.",
        href: "/residential-loans",
        linkLabel: "Learn about residential loans",
      },
      {
        id: "non-qm" as const,
        title: "Alternative Non-QM Financing",
        description:
          "Bank statement, DSCR, and 1099 programs for self-employed borrowers, investors, and others with alternative documentation.",
        href: "/non-qm",
        linkLabel: "Learn about Non-QM loans",
      },
    ],
  },

  process: {
    eyebrow: "The mortgage process",
    title: "From First Conversation to Closing.",
    steps: [
      {
        title: "Consultation",
        description: "We discuss your goals, finances, and the property you have in mind.",
      },
      { title: "Mortgage Application", description: "You complete an application through a secure process." },
      {
        title: "Document Review",
        description: "You provide documents such as income, asset, and identity records for review.",
      },
      {
        title: "Lender Underwriting",
        description:
          "The lender verifies your information, orders an appraisal if required, and makes the credit decision.",
      },
      {
        title: "Closing",
        description:
          "You review your Closing Disclosure, sign your loan documents, and the lender funds the loan.",
      },
    ],
    note: "Steps and timing can vary by loan program, lender, property, and how quickly documents are provided.",
  },

  faq: {
    eyebrow: "Frequently asked questions",
    title: "Questions New Borrowers Often Ask.",
    description: "Search or browse by topic. Answers are general, so ask us about your situation.",
    categories: ["Getting started", "Credit and qualifying", "Costs and payments", "The process"] as const,
    items: [
      {
        category: "Getting started",
        question: "How do I know how much home I can afford?",
        answer:
          "Start with a comfortable total monthly payment, not just the loan amount. Use the calculator above to estimate principal and interest, taxes, insurance, HOA dues, and mortgage insurance. Also plan for the down payment, closing costs, savings you want to keep, and ongoing maintenance. A lender's review will determine what you may qualify for.",
      },
      {
        category: "Getting started",
        question: "What documents will I need?",
        answer:
          "Commonly requested documents include government-issued ID, recent pay stubs, W-2s or tax returns, recent bank or asset statements, and information about your debts. Self-employed borrowers may be asked for business records. The exact list depends on the program and lender.",
      },
      {
        category: "Getting started",
        question: "Will talking with you affect my credit?",
        answer:
          "No. A conversation with us does not affect your credit. When a lender checks your credit for an application, it is usually a hard inquiry, which can have a small effect on your score. Common credit scoring models generally treat several mortgage inquiries within a short period as a single inquiry.",
      },
      {
        category: "Getting started",
        question: "Do you help borrowers outside Florida?",
        answer:
          "Green Valor Lending arranges mortgage loans only for properties located in the State of Florida.",
      },
      {
        category: "Credit and qualifying",
        question: "What credit score do I need?",
        answer:
          "It depends on the loan program and the lender, and credit score is only one factor. Lenders also look at your credit history, income, debts, assets, and the property. We can help you understand which options may fit your credit profile.",
      },
      {
        category: "Credit and qualifying",
        question: "Can I get a mortgage if I'm self-employed?",
        answer:
          "Many self-employed borrowers qualify using tax returns. If your tax returns do not reflect the income you rely on, alternative documentation programs, such as bank statement or 1099 programs, may be worth exploring. See our Non-QM page to learn more.",
      },
      {
        category: "Credit and qualifying",
        question: "What do lenders look at when reviewing an application?",
        answer:
          "Lenders generally review credit history, income and employment, monthly debts, available assets, the down payment, and the property. Each lender applies its own guidelines and makes the final credit decision.",
      },
      {
        category: "Costs and payments",
        question: "What is included in a monthly mortgage payment?",
        answer:
          "A monthly payment usually includes principal and interest, and often property taxes and homeowners insurance collected through escrow. It may also include mortgage insurance. HOA dues are usually paid separately but are part of your total housing cost.",
      },
      {
        category: "Costs and payments",
        question: "What are discount points?",
        answer:
          "Discount points are optional upfront fees paid to the lender in exchange for a lower interest rate. One point generally equals one percent of the loan amount. Whether points make sense depends on how long you expect to keep the loan.",
      },
      {
        category: "Costs and payments",
        question: "Why might my payment change after closing?",
        answer:
          "With a fixed-rate loan, principal and interest stay the same, but the escrow portion can change when property taxes or insurance premiums change. With an adjustable-rate loan, the principal and interest payment can also change after the initial fixed period.",
      },
      {
        category: "The process",
        question: "How long does it take to close a mortgage?",
        answer:
          "Timing varies by loan program, lender, property, appraisal scheduling, and how quickly documents are provided. We will give you a realistic picture for your situation and keep you updated along the way.",
      },
      {
        category: "The process",
        question: "What happens during underwriting?",
        answer:
          "The lender's underwriter verifies your income, assets, credit, and the property, often including an appraisal, and checks the file against program guidelines. The underwriter may request more information before making a decision.",
      },
      {
        category: "The process",
        question: "What is a rate lock?",
        answer:
          "A rate lock is a lender's agreement to hold a specific interest rate for a set period while your loan is processed. Lock periods, terms, and any fees vary by lender, so it is important to understand the expiration date and what happens if closing is delayed.",
      },
    ],
  },

  cta: {
    title: "Questions About Your Mortgage Options?",
    description: "Our team is happy to walk you through your options and answer your questions.",
    primary: { label: "Speak With Our Team", href: "/contact" },
  },
};

export type ResourcesFaqCategory = (typeof resourcesContent.faq.categories)[number];

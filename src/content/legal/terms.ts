/**
 * DRAFT Terms of Use for legal review. Keep the broker role, Florida-only
 * service area, and "no commitment to lend / no guaranteed approval" terms in
 * line with src/content/disclosures.ts.
 */
import type { LegalPageContent } from "./types";

export const termsContent: LegalPageContent = {
  eyebrow: "Legal",
  title: "Terms of Use",
  description: "The terms that apply when you use the Green Valor Lending website.",
  draftNote:
    "These terms are a draft prepared for review by legal counsel. They are not yet in effect and may change before the website launches.",
  sections: [
    {
      id: "acceptance",
      heading: "Acceptance of these terms",
      body: [
        'These Terms of Use apply to your use of the website operated by Green Valor Lending LLC ("Green Valor," "we," "us," or "our"). By using the website, you agree to these terms and to our [Privacy Policy](/privacy-policy). If you do not agree, please do not use the website.',
      ],
    },
    {
      id: "about",
      heading: "Who we are",
      body: [
        "Green Valor Lending LLC is a mortgage broker, not a mortgage lender. We do not underwrite, approve, or fund loans. Loans are placed with and funded by third-party wholesale lending partners. We arrange mortgage loans only for properties located in Florida.",
        "Our current licensing status is shown on our [Licensing page](/licensing).",
      ],
    },
    {
      id: "informational",
      heading: "Informational content only",
      body: [
        "The content on this website, including program descriptions, articles, answers to frequently asked questions, and calculators, is for general educational purposes only. It is not financial, legal, or tax advice, and it may not apply to your situation.",
        "Calculator results are estimates based only on the numbers you enter. They are not a Loan Estimate, a quote, or an offer, and actual terms may differ.",
      ],
    },
    {
      id: "no-commitment",
      heading: "No commitment to lend",
      body: [
        "Nothing on this website is a commitment to lend, an offer of credit, or an offer to arrange a loan on any particular terms. Submitting an inquiry through the website is not a loan application. It does not lock an interest rate, and it does not create an obligation for you or for us.",
      ],
    },
    {
      id: "no-guarantee",
      heading: "No guaranteed approvals, rates, or terms",
      body: [
        "All loans are subject to the lending partner's credit approval, underwriting guidelines, property eligibility, and program availability. Lending partners make all credit decisions. We do not guarantee loan approval, any interest rate, payment, fee, or loan term, or the availability of any program. Programs and terms may change without notice.",
      ],
    },
    {
      id: "submissions",
      heading: "Information you submit",
      body: [
        "You agree to provide accurate information and to submit only information about yourself or information you are authorized to share. Please do not send Social Security numbers, account numbers, or other sensitive financial or identification information through our website forms.",
        "When you submit a form, you agree that we may contact you about your inquiry as described on the form and in our [Privacy Policy](/privacy-policy).",
      ],
    },
    {
      id: "use",
      heading: "Acceptable use",
      body: [
        "You agree not to:",
        [
          "Use the website for any unlawful, fraudulent, or misleading purpose",
          "Submit information about another person without authorization, or impersonate anyone",
          "Send automated or bulk submissions, or attempt to bypass the website's spam protection",
          "Interfere with, disrupt, or try to gain unauthorized access to the website or the systems behind it",
          "Copy, scrape, or reuse the website's content except as these terms allow",
        ],
      ],
    },
    {
      id: "external",
      heading: "External links and services",
      body: [
        "The website links to services operated by others, such as a secure mortgage application portal, NMLS Consumer Access, and government agencies. We do not control those services and are not responsible for their content, availability, or practices. Your use of them is governed by their own terms and privacy policies.",
      ],
    },
    {
      id: "ip",
      heading: "Intellectual property",
      body: [
        "The website and its content, including text, graphics, the Green Valor Lending name, and our logos, are owned by or licensed to Green Valor and are protected by applicable intellectual property laws. You may view and print pages for your personal, non-commercial use. You may not otherwise copy, modify, distribute, or use our content, name, or logos without our written permission.",
      ],
    },
    {
      id: "limitations",
      heading: "Website limitations",
      body: [
        "We work to keep the website accurate and available, but it may contain errors or omissions, and information may become out of date. We may change, suspend, or discontinue any part of the website at any time without notice. We do not promise that the website will be uninterrupted or free of errors or harmful components.",
      ],
    },
    {
      id: "disclaimers",
      heading: "Disclaimers",
      body: [
        'To the fullest extent permitted by law, the website and its content are provided "as is" and "as available," without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.',
      ],
    },
    {
      id: "liability",
      heading: "Limitation of liability",
      body: [
        "To the fullest extent permitted by law, Green Valor and its members, employees, and agents will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the website or its content. Nothing in these terms limits any right you have that cannot be limited under applicable law.",
      ],
    },
    {
      id: "law",
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of the State of Florida, without regard to its conflict-of-law rules, and by applicable federal law.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      body: [
        "We may update these terms from time to time. The updated terms take effect when posted on this page with their effective date. Your continued use of the website after that means you accept the updated terms.",
      ],
    },
    {
      id: "contact",
      heading: "Contact us",
      body: ["Questions about these terms can be sent through our [Contact page](/contact)."],
    },
  ],
};

/**
 * DRAFT Privacy Policy for legal review. Every statement must match how the
 * site actually works (see COMPLIANCE_REVIEW.md, "Privacy practices"):
 * - No analytics, advertising pixels, tracking cookies or first-party cookies.
 * - No browser storage of form entries.
 * - Forms deliver to a CRM webhook and/or business email; the site keeps no database.
 * - IP-based rate limits and duplicate fingerprints live in server memory only.
 * Do not add encryption, retention-period or certification claims until they
 * are implemented and verified.
 */
import type { LegalPageContent } from "./types";

export const privacyContent: LegalPageContent = {
  eyebrow: "Legal",
  title: "Privacy Policy",
  description: "How Green Valor Lending LLC collects, uses, and shares information through this website.",
  draftNote:
    "This privacy policy is a draft prepared for review by legal counsel. It is not yet in effect and may change before the website launches.",
  sections: [
    {
      id: "about",
      heading: "About this policy",
      body: [
        'This Privacy Policy explains how Green Valor Lending LLC ("Green Valor," "we," "us," or "our") collects, uses, and shares information through this website. Green Valor is a mortgage broker serving properties in Florida.',
        "This policy covers information collected through the website. If you apply for a mortgage loan, you will receive separate privacy notices required by federal law, including the Gramm-Leach-Bliley Act. Those notices govern the information collected in your application.",
      ],
    },
    {
      id: "general-contact",
      heading: "General contact information",
      body: [
        "When you use our [Contact form](/contact), we collect your name, email address, phone number, the reason for your inquiry, your message, and your acknowledgment that we may contact you about it.",
      ],
    },
    {
      id: "mortgage-inquiry",
      heading: "Mortgage inquiry information",
      body: [
        "When you use our [Get Started form](/get-started), we collect:",
        [
          "Your financing goal, such as a purchase or refinance",
          "The property's state, general location, property type, and intended occupancy",
          "Optional estimates of the property value and the amount you may want to finance",
          "Your general timeline and any optional notes",
          "Your name, email address, phone number, preferred contact method, optional message, and consent acknowledgment",
        ],
        "This form is a preliminary inquiry, not a loan application. We do not ask for your Social Security number, date of birth, bank or other account numbers, tax returns, paystubs, driver's license, or credit report through this website, and the form rejects notes that appear to contain Social Security or account numbers. Please do not send that information through our website forms.",
      ],
    },
    {
      id: "recruitment",
      heading: "Recruitment applicant information",
      body: [
        "When you use the career inquiry form on our [Careers page](/careers), we collect your name, email address, phone number, general location, current profession, mortgage industry experience, licensing status, optional NMLS ID, the career pathway you are interested in, why you are interested, your preferred contact method, and your consent acknowledgment.",
        "We do not accept resumes or ask for Social Security numbers or financial details through this form. Career inquiries are kept separate from borrower inquiries and are used only to evaluate and respond to your interest in working with us.",
      ],
    },
    {
      id: "automatic",
      heading: "Information collected automatically",
      body: [
        "When you visit the website, our website hosting provider receives technical information that browsers send with every request, such as your IP address, browser type, the page requested, and the date and time.",
        "When you submit a form, the website briefly uses your IP address to limit repeated submissions and keeps a one-way fingerprint of recent submissions to avoid processing duplicates. It also checks how quickly the form was completed to help detect automated spam. That timing is not saved with your submission.",
        "If we turn on a security challenge for our forms (Cloudflare Turnstile), that service processes information about your browser and device to tell people apart from automated programs, under Cloudflare's own privacy policy.",
      ],
    },
    {
      id: "cookies",
      heading: "Cookies and analytics",
      body: [
        "This website does not currently use analytics tools, advertising pixels, or tracking cookies, and it does not set cookies of its own. It does not save your form entries in your browser. Fonts and images are served from our own website.",
        "If we add analytics or similar technologies, we will update this policy before doing so and, where the law requires, ask for your consent.",
        "Websites you choose to visit through links on our site, such as a secure mortgage application portal, may use their own cookies under their own policies.",
      ],
    },
    {
      id: "use",
      heading: "How we use information",
      body: [
        "We use the information described above to:",
        [
          "Respond to your inquiry using the contact information you provide",
          "Discuss mortgage options with you and, if you choose to move forward, help you begin an application with a wholesale lending partner",
          "Evaluate and respond to career inquiries",
          "Operate, maintain, and protect the website, including preventing spam, fraud, and abuse",
          "Comply with legal and regulatory obligations",
        ],
        "We contact you about your inquiry by email or phone as you request. We do not send text messages or make automated calls through this website.",
      ],
    },
    {
      id: "sharing",
      heading: "Service providers and sharing",
      body: [
        "We do not sell your personal information. We share it only as described here:",
        [
          "Service providers that help us run the website and respond to you, such as our website hosting provider, our customer relationship management (CRM) system, our email delivery provider, and, if enabled, our form security service. They may use the information only to provide services to us.",
          "Wholesale lending partners, only if you choose to move forward with a loan application, and as described in the privacy notices you receive at that time",
          "Government agencies, regulators, or others when required by law, regulation, or legal process, or to protect the rights, property, or safety of our company, our customers, or others",
          "A successor organization, if our business is involved in a merger, acquisition, or sale of assets",
        ],
      ],
    },
    {
      id: "retention",
      heading: "Data storage and retention",
      body: [
        "Form submissions are delivered to our CRM system and/or our business email. The website itself does not store submissions in a database, and it does not write the contents of your submission to its logs.",
        "The website keeps short-lived records, such as submission counters tied to an IP address and one-way fingerprints of recent submissions, in server memory only. They are used for about ten minutes and are discarded when the server restarts.",
        "We keep inquiry information only as long as we need it for the purposes described in this policy or as required by law or regulation. Specific retention periods will be added to this policy once they are adopted.",
      ],
    },
    {
      id: "security",
      heading: "Data security",
      body: [
        "We use reasonable administrative and technical measures designed to protect the information you submit. For example, our forms validate information on our server, accept submissions only from our own website, and limit the size and frequency of submissions.",
        "No website, transmission, or storage system is completely secure, and we cannot guarantee the security of information you send to us. Please do not send sensitive financial or identification information through our website forms.",
      ],
    },
    {
      id: "rights",
      heading: "Your choices and rights",
      body: [
        "You may ask us to:",
        [
          "Tell you what information you submitted through the website that we still have",
          "Correct information you submitted",
          "Delete information you submitted, unless we must keep it to meet a legal or regulatory obligation",
          "Stop contacting you about an inquiry",
        ],
        "We will need to confirm your identity before acting on a request. Depending on where you live, you may have additional rights under applicable law. If you apply for a loan, the privacy notices you receive at that time explain your rights for application information.",
      ],
    },
    {
      id: "children",
      heading: "Children's privacy",
      body: [
        "This website is not directed to children under 13, and we do not knowingly collect personal information from them. If you believe a child has sent us information, please contact us so we can delete it.",
      ],
    },
    {
      id: "links",
      heading: "Links to other websites",
      body: [
        "Our website links to other websites, such as a secure mortgage application portal, NMLS Consumer Access, and government agencies. Those websites have their own privacy policies, and we are not responsible for their practices.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      body: [
        "We may update this policy from time to time. When we do, we will post the updated policy on this page with its effective date. If we make material changes, we will take additional steps to tell you where the law requires.",
      ],
    },
    {
      id: "contact",
      heading: "How to contact us",
      body: [
        'To ask a question about this policy or make a request about your information, please send a message through our [Contact page](/contact) and choose "General Question."',
      ],
    },
  ],
};

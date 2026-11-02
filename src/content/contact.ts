/**
 * Contact page copy (/contact).
 *
 * Compliance notes (see COMPLIANCE_REVIEW.md): contact details come only from
 * src/config/company.ts and render only when supplied. No invented address,
 * phone, hours, or response-time promises. The form is not a loan
 * application; career inquiries go to /careers.
 */
export const contactContent = {
  hero: {
    eyebrow: "Contact Green Valor",
    title: "Let's Start a Conversation.",
    description:
      "Whether you have questions about a mortgage, would like to learn about our services, or want to connect with our team, we're here to help.",
  },

  info: {
    eyebrow: "Contact information",
    title: "How to Reach Us.",
    serviceArea: "Florida",
    serviceAreaNote: "We arrange mortgage loans only for properties located in Florida.",
    /** Shown when no phone or email has been published yet. */
    pending: "Direct phone and email details will be listed here soon. In the meantime, please use the form.",
  },

  form: {
    eyebrow: "Send us a message",
    title: "How Can We Help?",
    description:
      "Share a few details and a member of our team will follow up. Please don't include Social Security numbers, account numbers, or other sensitive financial information.",
    careerNotice: {
      title: "Career inquiries have their own form.",
      description:
        "To keep applicants separate from borrower inquiries, career interest goes through our recruitment form on the Careers page.",
      cta: { label: "Go to the Careers Form", href: "/careers#apply" },
    },
  },

  borrowerCta: {
    title: "Ready to Explore Mortgage Options?",
    description: "Take the first step toward residential or Non-QM financing for your Florida home.",
    cta: { label: "Get Started", href: "/get-started" },
  },

  careersCta: {
    title: "Interested in Joining Our Team?",
    description: "Learn about opportunities for licensed loan officers and driven professionals.",
    cta: { label: "Explore Careers", href: "/careers" },
  },
};

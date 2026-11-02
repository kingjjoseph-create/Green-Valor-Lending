/**
 * Accessibility statement. Describe only practices that are implemented and
 * tested (see QA_REPORT.md). Do not claim WCAG conformance, an independent
 * audit, or screen reader testing until they have actually been done.
 */
import type { LegalPageContent } from "./types";

export const accessibilityContent: LegalPageContent = {
  eyebrow: "Legal",
  title: "Accessibility Statement",
  description:
    "How we build and test this website so that everyone can use it, and how to tell us about a barrier.",
  draftNote:
    "This statement is a draft prepared for review before the website launches. It describes the practices in place today and will be updated as testing continues.",
  sections: [
    {
      id: "commitment",
      heading: "Our commitment",
      body: [
        "Green Valor Lending LLC wants everyone to be able to learn about mortgage options and reach our team, including people who use assistive technology. We aim for this website to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.",
      ],
    },
    {
      id: "practices",
      heading: "What we have built in",
      body: [
        [
          "A skip link to the main content, and clearly labeled navigation, header, main, and footer regions",
          "Full keyboard access to menus, forms, accordions, and the calculator, with a visible focus outline",
          "Headings in a logical order and descriptive page titles",
          "Text and interface colors chosen to meet WCAG AA contrast ratios",
          "Form fields with visible labels, instructions, and error messages that explain how to fix the problem; errors are announced, and focus moves to the first problem",
          "Status messages, such as a confirmed form submission, announced to screen readers",
          "Form inputs at least 16 pixels in size and buttons and links sized for touch",
          "Layouts that adapt to screens as narrow as 320 pixels without sideways scrolling, and that support browser zoom",
          "Animation that turns off when your device is set to reduce motion",
          "Text alternatives for meaningful images, with decorative images hidden from assistive technology",
          "Links that open a new tab say so to screen reader users",
        ],
      ],
    },
    {
      id: "testing",
      heading: "How we test",
      body: [
        "During development, every page is checked with automated accessibility testing (axe-core, against WCAG 2.1 A and AA rules) at five screen widths from 320 to 1,440 pixels. We also run keyboard checks of the navigation and forms and Lighthouse accessibility audits on our main pages.",
        "Automated tools cannot find every barrier. We have not yet completed an independent accessibility audit or full testing with screen readers, and we plan to do both.",
      ],
    },
    {
      id: "limitations",
      heading: "Known limitations",
      body: [
        "Some services we link to are operated by others, such as a secure mortgage application portal, government websites, and, if enabled on our forms, a security challenge from Cloudflare. Their accessibility is outside our control, but please tell us if one of them is a barrier and we will help you another way.",
      ],
    },
    {
      id: "feedback",
      heading: "Feedback and help",
      body: [
        "If you have trouble using any part of this website, or need information in another format, please let us know through our [Contact page](/contact). Tell us the page and what happened, and we will work to help you and to fix the problem.",
      ],
    },
  ],
};

export type NavItem = {
  title: string;
  href: string;
  description?: string;
};

/** Primary navigation. Mirrors the eight approved pages. */
export const mainNav: NavItem[] = [
  { title: "Residential Loans", href: "/residential-loans" },
  { title: "Non-QM Loans", href: "/non-qm" },
  { title: "Resources", href: "/resources" },
  { title: "About", href: "/about" },
  { title: "Careers", href: "/careers" },
  { title: "Contact", href: "/contact" },
];

export const primaryCta: NavItem = { title: "Get Started", href: "/get-started" };

/** Supporting legal and licensing pages. */
export const legalNav: NavItem[] = [
  { title: "Licensing & Disclosures", href: "/licensing" },
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Terms of Use", href: "/terms" },
  { title: "Accessibility", href: "/accessibility" },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Borrowers",
    items: [
      { title: "Residential Loans", href: "/residential-loans" },
      { title: "Non-QM Loans", href: "/non-qm" },
      { title: "Resources", href: "/resources" },
      { title: "Get Started", href: "/get-started" },
    ],
  },
  {
    heading: "Company",
    items: [
      { title: "About Us", href: "/about" },
      { title: "Careers", href: "/careers" },
      { title: "Contact", href: "/contact" },
    ],
  },
  { heading: "Legal", items: legalNav },
];

/** Every internal route that must exist. Used by tests and the sitemap. */
export const allRoutes: string[] = [
  "/",
  ...mainNav.map((i) => i.href),
  primaryCta.href,
  ...legalNav.map((i) => i.href),
];

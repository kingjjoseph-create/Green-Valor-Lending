export type NavItem = {
  title: string;
  href: string;
  /** Opens an external site in a new tab. */
  external?: boolean;
  /** Visually emphasized in the primary nav (e.g. Careers). */
  emphasis?: boolean;
};

/** Primary navigation: simple, no mega menus. */
export const mainNav: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Residential Loans", href: "/residential-loans" },
  { title: "Non-QM Loans", href: "/non-qm" },
  { title: "Resources", href: "/resources" },
  { title: "About Us", href: "/about" },
  { title: "Careers", href: "/careers", emphasis: true },
  { title: "Contact", href: "/contact" },
];

export const primaryCta: NavItem = { title: "Get Started", href: "/get-started" };

/** Supporting legal and licensing pages. */
export const legalNav: NavItem[] = [
  { title: "Licensing", href: "/licensing" },
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms of Use", href: "/terms-of-use" },
  { title: "Accessibility", href: "/accessibility" },
  { title: "Consumer Complaints", href: "/consumer-complaints" },
];

export const nmlsConsumerAccess: NavItem = {
  title: "NMLS Consumer Access",
  href: "https://www.nmlsconsumeraccess.org/",
  external: true,
};

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Mortgage Options",
    items: [
      { title: "Residential Loans", href: "/residential-loans" },
      { title: "Non-QM Loans", href: "/non-qm" },
      { title: "Resources", href: "/resources" },
      primaryCta,
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
  { heading: "Legal & Licensing", items: [...legalNav, nmlsConsumerAccess] },
];

/** Every internal route that must exist. Used by tests and the sitemap. */
export const allRoutes: string[] = Array.from(
  new Set([...mainNav.map((i) => i.href), primaryCta.href, ...legalNav.map((i) => i.href)]),
);

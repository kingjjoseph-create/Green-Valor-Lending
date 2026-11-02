import Link from "next/link";
import { ExternalLink, House } from "lucide-react";

import { company } from "@/config/company";
import { footerNav, type NavItem } from "@/config/navigation";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";
import { formatAddress, getContactChannels, getNmlsLine, getSocialLinks } from "@/lib/company";
import { Container } from "./container";
import { Logo } from "./logo";

const socialLabels = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  x: "X",
} as const;

async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

const linkClass =
  "rounded-sm text-white/80 transition-colors duration-200 hover:text-white hover:underline hover:decoration-gv-gold hover:underline-offset-4";

function FooterLink({ item }: { item: NavItem }) {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${linkClass} inline-flex items-center gap-1.5`}
      >
        {item.title}
        <ExternalLink className="size-3.5" aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={item.href} className={linkClass}>
      {item.title}
    </Link>
  );
}

/** Deep-green site footer. Every contact/licensing detail comes from company config and hides when unset. */
export function Footer() {
  const contact = getContactChannels();
  const social = getSocialLinks();
  const nmls = getNmlsLine();
  const address = company.address ? formatAddress(company.address) : null;

  return (
    <footer className="surface-inverse">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <Logo variant="mark-reversed" height={72} />
              <div>
                <p className="font-serif text-2xl font-semibold text-white">{company.displayName}</p>
                <p className="mt-1 type-eyebrow">{company.identity}</p>
              </div>
            </div>
            <p className="mt-6 max-w-md type-support text-white/80">{company.shortDescription}</p>
            <p className="mt-6 font-serif text-xl text-white">{company.brand.tagline}</p>

            {(contact.length > 0 || address) && (
              <address className="mt-6 space-y-1.5 type-support not-italic">
                {contact.map((c) => (
                  <p key={c.type}>
                    <a href={c.href} className={linkClass}>
                      {c.label}
                    </a>
                  </p>
                ))}
                {address?.map((line) => (
                  <p key={line} className="text-white/80">
                    {line}
                  </p>
                ))}
              </address>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-7">
            {footerNav.map((group) => (
              <nav
                key={group.heading}
                aria-label={group.heading}
                className={group.heading === "Legal & Licensing" ? "col-span-2 sm:col-span-1" : undefined}
              >
                <h2 className="type-eyebrow font-sans">{group.heading}</h2>
                <ul className="mt-5 space-y-3 type-support">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <FooterLink item={item} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {social.length > 0 && (
          <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 type-support" aria-label="Social media">
            {social.map((s) => (
              <li key={s.network}>
                <FooterLink item={{ title: socialLabels[s.network], href: s.href, external: true }} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-14 border-t border-white/15 pt-8">
          <LegalDisclaimer
            include={["brokerStatement", "serviceArea", "noCommitment"]}
            className="max-w-5xl"
          />
          {company.licensing.equalHousingApproved && (
            <p className="mt-5 flex items-center gap-2 type-legal text-white/80">
              {/* Replace with the official Equal Housing Opportunity logo file when supplied. */}
              <House className="size-5 text-white" aria-hidden="true" />
              Equal Housing Opportunity
            </p>
          )}
          <p className="mt-6 type-legal text-white/70">
            &copy; <CopyrightYear /> {company.legalName}. All rights reserved.
            {nmls ? ` ${nmls}.` : null}
          </p>
        </div>
      </Container>
    </footer>
  );
}

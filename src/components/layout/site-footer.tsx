import Link from "next/link";

import { company } from "@/config/company";
import { footerNav } from "@/config/navigation";
import { disclosures } from "@/content/disclosures";
import { getContactChannels, getNmlsLine, getSocialLinks } from "@/lib/company";
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

export function SiteFooter() {
  const contact = getContactChannels();
  const social = getSocialLinks();
  const nmls = getNmlsLine();

  return (
    <footer className="bg-gv-green text-white/85">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <Logo tone="light" variant="horizontal-reversed" />
            <p className="max-w-sm font-serif text-2xl leading-snug text-white">{company.brand.tagline}</p>
            <p className="text-xs font-semibold tracking-[0.25em] text-gv-gold-bright uppercase">
              {company.brand.positioning}
            </p>
            {contact.length > 0 && (
              <ul className="space-y-1 text-sm">
                {contact.map((c) => (
                  <li key={c.type}>
                    <a href={c.href} className="hover:text-white hover:underline">
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {footerNav.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <h2 className="font-sans text-xs font-semibold tracking-[0.2em] text-gv-gold-bright uppercase">
                  {group.heading}
                </h2>
                <ul className="mt-4 space-y-3 text-sm">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="transition-colors hover:text-white">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {social.length > 0 && (
          <ul className="mt-12 flex flex-wrap gap-5 text-sm" aria-label="Social media">
            {social.map((s) => (
              <li key={s.network}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline"
                >
                  {socialLabels[s.network]}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-14 space-y-3 border-t border-white/15 pt-8 text-xs leading-relaxed text-white/70">
          <p>{disclosures.brokerStatement}</p>
          <p>{disclosures.serviceArea}</p>
          <p>{disclosures.noCommitment}</p>
          <p>{disclosures.equalHousing}</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 pt-2">
            <span>
              &copy; <CopyrightYear /> {company.legalName}
              {nmls ? ` · ${nmls}` : null}
            </span>
            <a
              href={company.licensing.nmlsConsumerAccessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:text-white hover:underline"
            >
              NMLS Consumer Access
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}

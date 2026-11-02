import { Mail, Phone } from "lucide-react";

import { company } from "@/config/company";
import { formatAddress, getContactChannels } from "@/lib/company";

/** Verified company contact details from config. Renders nothing when none are published. */
export function ContactDetails() {
  const channels = getContactChannels();
  const address = company.address ? formatAddress(company.address) : null;
  if (channels.length === 0 && !address) return null;
  return (
    <address className="space-y-2 not-italic" data-testid="company-contact-details">
      <p className="font-semibold">{company.legalName}</p>
      {channels.map((ch) => {
        const Icon = ch.type === "phone" ? Phone : Mail;
        return (
          <p key={ch.type} className="flex items-center gap-2">
            <Icon className="size-4 text-gv-gold-deep" aria-hidden="true" />
            <a href={ch.href} className="font-semibold text-gv-green underline underline-offset-2">
              {ch.label}
            </a>
          </p>
        );
      })}
      {address?.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </address>
  );
}

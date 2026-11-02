import { company, type PostalAddress, type SocialLinks } from "@/config/company";

/** True when a config value is present and safe to render publicly. */
export function hasValue<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

/** Format a US phone number for display, e.g. "(555) 555-0100". Returns input if not 10 digits. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  if (digits.length !== 10) return raw;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function phoneHref(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`;
}

export function formatAddress(address: PostalAddress): string[] {
  return [
    [address.street, address.suite].filter(Boolean).join(", "),
    `${address.city}, ${address.state} ${address.postalCode}`,
  ];
}

export type ContactChannel = { type: "phone" | "email"; label: string; href: string };

/** Only the contact channels that are actually configured. */
export function getContactChannels(): ContactChannel[] {
  const channels: ContactChannel[] = [];
  if (hasValue(company.phone)) {
    channels.push({ type: "phone", label: formatPhone(company.phone), href: phoneHref(company.phone) });
  }
  if (hasValue(company.email)) {
    channels.push({ type: "email", label: company.email, href: `mailto:${company.email}` });
  }
  return channels;
}

/** Social links that are configured, in display order. */
export function getSocialLinks(): { network: keyof SocialLinks; href: string }[] {
  return (Object.entries(company.social) as [keyof SocialLinks, string | null][])
    .filter((entry): entry is [keyof SocialLinks, string] => hasValue(entry[1]))
    .map(([network, href]) => ({ network, href }));
}

/**
 * The NMLS line for footers and disclosures, or null while the ID is pending.
 * We never print "NMLS #Pending" or similar placeholders publicly.
 */
export function getNmlsLine(): string | null {
  const id = company.licensing.nmlsId;
  return hasValue(id) ? `NMLS #${id}` : null;
}

export function getServiceStateNames(): string[] {
  return company.licensedStates.map((s) => s.name);
}

export function getPublishedProducts() {
  return company.productCategories.filter((p) => p.published);
}

/** Absolute site URL for metadata. Falls back to localhost in development only. */
export function getSiteUrl(): URL {
  if (hasValue(company.urls.site)) return new URL(company.urls.site);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}

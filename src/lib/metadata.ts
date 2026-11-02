import type { Metadata } from "next";
import { company } from "@/config/company";

/** Default social share image (official stacked logo on Warm Ivory, 1200x630). */
export const defaultOgImage = {
  url: "/images/og-default.png",
  width: 1200,
  height: 630,
  alt: `${company.displayName} logo`,
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

/** Consistent per-page metadata: title, description, canonical URL and Open Graph. */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${company.displayName}`,
      description,
      url: path,
      siteName: company.displayName,
      locale: "en_US",
      type: "website",
      images: [defaultOgImage],
    },
  };
}

import type { Metadata } from "next";
import { company } from "@/config/company";

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
    },
  };
}

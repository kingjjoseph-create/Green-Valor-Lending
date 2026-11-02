import * as React from "react";
import Link from "next/link";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const linkClass = "font-semibold text-gv-green underline underline-offset-2 hover:decoration-gv-gold";

/** Renders text with [label](href) links. External links open in a new tab and say so. */
export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const [whole, label, href] = m;
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (href.startsWith("/") || href.startsWith("#")) {
      parts.push(
        <Link key={m.index} href={href} className={linkClass}>
          {label}
        </Link>,
      );
    } else {
      parts.push(
        <a key={m.index} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>,
      );
    }
    last = m.index + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** Plain text of a rich-text string (links reduced to their labels), for tests and summaries. */
export function plainText(text: string): string {
  return text.replace(LINK, "$1");
}

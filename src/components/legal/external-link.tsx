import { ExternalLink as ExternalIcon } from "lucide-react";

/** Inline external link that opens a new tab and says so. */
export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold break-words text-gv-green underline underline-offset-2 hover:decoration-gv-gold"
    >
      {children}
      <ExternalIcon className="ml-1 inline size-3.5 align-[-2px]" aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

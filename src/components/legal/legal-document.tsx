import * as React from "react";
import { FileWarning } from "lucide-react";

import type { LegalBlock, LegalSection } from "@/content/legal/types";
import { RichText } from "./rich-text";

export function LegalBlocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, i) =>
        typeof block === "string" ? (
          <p key={i}>
            <RichText text={block} />
          </p>
        ) : (
          <ul key={i} className="list-disc space-y-2 pl-6 marker:text-gv-gold-deep">
            {block.map((item) => (
              <li key={item}>
                <RichText text={item} />
              </li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}

/** "Draft for legal review" banner, shown until counsel approves the legal pages. */
export function DraftBanner({ note }: { note: string }) {
  return (
    <div
      role="note"
      aria-label="Draft status"
      data-testid="legal-draft-banner"
      className="flex gap-3 rounded-lg border border-gv-gold/50 bg-surface-alt p-5 type-support text-foreground"
    >
      <FileWarning className="mt-0.5 size-5 shrink-0 text-gv-gold-deep" aria-hidden="true" />
      <div>
        <p className="font-semibold">Draft for legal review</p>
        <p className="mt-1">{note}</p>
      </div>
    </div>
  );
}

type LegalDocumentProps = {
  sections: LegalSection[];
  /** Approval date (YYYY-MM-DD) once counsel signs off; null while in draft. */
  approvedOn: string | null;
  draftNote: string;
  /** Extra content rendered inside a named section, keyed by section id (e.g. live contact details). */
  slots?: Record<string, React.ReactNode>;
  /** Content shown between the status line and the first section. */
  intro?: React.ReactNode;
};

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

/** Long-form legal page: status line, table of contents, numbered sections. */
export function LegalDocument({ sections, approvedOn, draftNote, slots = {}, intro }: LegalDocumentProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <nav aria-label="On this page" className="lg:col-span-4 xl:col-span-3">
        <div className="lg:sticky lg:top-28">
          <h2 className="type-eyebrow font-sans">On this page</h2>
          <ol className="mt-4 space-y-2.5 type-support">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex min-h-6 rounded-sm text-muted-foreground hover:text-gv-green hover:underline hover:underline-offset-4"
                >
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <div className="min-w-0 lg:col-span-8 xl:col-span-9">
        {approvedOn ? (
          <p className="type-support text-muted-foreground">Effective {longDate(approvedOn)}</p>
        ) : (
          <DraftBanner note={draftNote} />
        )}
        {intro}
        <div className="mt-10 space-y-12">
          {sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`} className="scroll-mt-28">
              <h2 id={`${s.id}-heading`} className="type-card-title">
                {s.heading}
              </h2>
              <div className="mt-4 max-w-3xl space-y-4 type-body text-foreground/90">
                <LegalBlocks blocks={s.body} />
                {slots[s.id]}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

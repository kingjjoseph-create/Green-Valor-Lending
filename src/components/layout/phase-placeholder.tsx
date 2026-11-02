import { SectionContainer } from "./section-container";

/**
 * Temporary body for routes scaffolded ahead of their content phase.
 * Remove every usage before launch (tracked in DEVELOPMENT_PROGRESS.md).
 */
export function PhasePlaceholder({ note }: { note?: string }) {
  return (
    <SectionContainer data-placeholder="page-content" reveal={false}>
      <div className="max-w-2xl rounded-lg border border-dashed border-gv-gold/60 bg-white p-8">
        <p className="type-eyebrow">In development</p>
        <p className="mt-3 type-body text-muted-foreground">
          {note ?? "This page is being prepared and will be available soon."}
        </p>
      </div>
    </SectionContainer>
  );
}

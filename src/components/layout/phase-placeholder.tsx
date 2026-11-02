import { Container, Section } from "./container";

/**
 * Temporary body for routes that are scaffolded in Phase 1 but built in a
 * later phase. Remove every usage before launch (tracked in DEVELOPMENT_PROGRESS.md).
 */
export function PhasePlaceholder({ note }: { note?: string }) {
  return (
    <Section data-placeholder="page-content">
      <Container>
        <div className="max-w-2xl rounded-lg border border-dashed border-gv-gold/60 bg-white p-8">
          <p className="text-sm font-semibold tracking-[0.2em] text-gv-gold-deep uppercase">In development</p>
          <p className="mt-3 text-muted-foreground">
            {note ?? "This page is being prepared and will be available soon."}
          </p>
        </div>
      </Container>
    </Section>
  );
}

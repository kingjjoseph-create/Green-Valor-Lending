import { Container } from "./container";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

/** Standard interior page heading band on Warm Ivory. */
export function PageIntro({ eyebrow, title, description, children }: PageIntroProps) {
  return (
    <div className="border-b border-border bg-gv-ivory">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="text-xs font-semibold tracking-[0.25em] text-gv-gold-deep uppercase">{eyebrow}</p>
          )}
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl lg:text-6xl">{title}</h1>
          {description && <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{description}</p>}
          {children}
        </div>
      </Container>
    </div>
  );
}

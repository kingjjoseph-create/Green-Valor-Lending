import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
};

/** Eyebrow + heading + supporting copy. Colors adapt to light or green surfaces. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="mb-4 type-eyebrow">{eyebrow}</p>}
      <Heading id={id} className={Heading === "h3" ? "type-card-title" : "type-section-title"}>
        {title}
      </Heading>
      {align === "center" ? (
        <span className="mx-auto mt-5 block h-0.5 w-12 rounded-full bg-gv-gold" aria-hidden="true" />
      ) : (
        <span className="mt-5 block h-0.5 w-12 rounded-full bg-gv-gold" aria-hidden="true" />
      )}
      {description && <p className="mt-5 type-lead text-muted-foreground">{description}</p>}
    </div>
  );
}

import Link from "next/link";

import { Container, Section } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Section>
      <Container className="max-w-2xl text-center">
        <p className="text-xs font-semibold tracking-[0.25em] text-gv-gold-deep uppercase">Page not found</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">We couldn&apos;t find that page.</h1>
        <p className="mt-4 text-muted-foreground">The page may have moved, or the link may be incorrect.</p>
        <Button asChild className="mt-8">
          <Link href="/">Return home</Link>
        </Button>
      </Container>
    </Section>
  );
}

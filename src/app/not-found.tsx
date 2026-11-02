import Link from "next/link";

import { SectionContainer } from "@/components/layout/section-container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <SectionContainer spacing="spacious" reveal={false} innerClassName="max-w-2xl text-center">
      <p className="type-eyebrow">Page not found</p>
      <h1 className="mt-4 type-page-title">We couldn&apos;t find that page.</h1>
      <p className="mt-4 text-muted-foreground">The page may have moved, or the link may be incorrect.</p>
      <Button asChild className="mt-8">
        <Link href="/">Return home</Link>
      </Button>
    </SectionContainer>
  );
}

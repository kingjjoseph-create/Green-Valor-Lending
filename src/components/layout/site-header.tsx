import Link from "next/link";

import { company } from "@/config/company";
import { mainNav, primaryCta } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "./container";
import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Logo priority height={44} imageClassName="h-11! sm:h-14!" />
        <MainNav items={mainNav} />
        <div className="flex items-center gap-2">
          <Button asChild variant="accent" className="hidden sm:inline-flex">
            <Link href={primaryCta.href}>{primaryCta.title}</Link>
          </Button>
          <MobileNav items={mainNav} cta={primaryCta} tagline={company.brand.tagline} />
        </div>
      </Container>
    </header>
  );
}

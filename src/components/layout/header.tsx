import Link from "next/link";

import { company } from "@/config/company";
import { mainNav, primaryCta } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "./container";
import { DesktopNav } from "./desktop-nav";
import { Logo } from "./logo";
import { MobileNavigation } from "./mobile-navigation";

/** Sticky site header: logo, primary nav (≥1280px), Get Started CTA, mobile drawer. */
export function Header() {
  return (
    <header className="border-gv-border sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <Container className="flex h-[4.5rem] items-center justify-between gap-3 sm:h-20 sm:gap-4">
        <Logo priority height={48} imageClassName="h-8! min-[380px]:h-9! sm:h-11! xl:h-12!" />
        <DesktopNav items={mainNav} />
        <div className="flex items-center gap-1 min-[380px]:gap-1.5 sm:gap-2">
          <Button
            asChild
            variant="accent"
            size="sm"
            className="px-3 min-[380px]:px-4 sm:h-11 sm:px-6 sm:text-sm"
          >
            <Link href={primaryCta.href}>{primaryCta.title}</Link>
          </Button>
          <MobileNavigation items={mainNav} cta={primaryCta} tagline={company.brand.tagline} />
        </div>
      </Container>
    </header>
  );
}

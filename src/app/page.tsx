import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { company } from "@/config/company";
import { Container, Section } from "@/components/layout/container";
import { PhasePlaceholder } from "@/components/layout/phase-placeholder";
import { Button } from "@/components/ui/button";
import { getPublishedProducts } from "@/lib/company";

/**
 * Phase 1 home shell: brand hero + product entry points only.
 * The full home page (photography, sections, education, recruiting) is Phase 2.
 */
export default function HomePage() {
  const products = getPublishedProducts();

  return (
    <>
      <div className="relative overflow-hidden bg-gv-green text-white">
        <Container className="relative py-24 sm:py-28 lg:py-36">
          <p className="text-xs font-semibold tracking-[0.3em] text-gv-gold-bright uppercase">
            {company.identity}
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold text-white sm:text-6xl lg:text-7xl">
            {company.brand.borrowerMessage}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            {company.brand.tagline} A Florida wholesale mortgage brokerage helping you compare residential and
            Non-QM options from wholesale lending partners.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="/get-started">
                Get Started <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:border-white hover:bg-white/10"
            >
              <Link href="/careers">Loan Officer Careers</Link>
            </Button>
          </div>
        </Container>
      </div>

      <Section className="bg-white">
        <Container>
          <h2 className="text-3xl font-semibold sm:text-4xl">Mortgage options for Florida</h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {products.map((p) => (
              <li key={p.id}>
                <Link
                  href={p.href}
                  className="group block h-full rounded-lg border border-border bg-gv-ivory/50 p-8 transition-colors hover:border-gv-gold"
                >
                  <h3 className="text-2xl font-semibold">{p.name}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{p.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gv-green">
                    Learn more
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <PhasePlaceholder note="Additional home page sections are scheduled for Phase 2." />
    </>
  );
}

import { Clock, MapPinned, MessagesSquare, ShieldCheck } from "lucide-react";

import { company } from "@/config/company";
import { getStartedContent } from "@/content/get-started";
import { InquiryWizard } from "@/components/get-started/inquiry-wizard";
import { PageHero } from "@/components/layout/page-hero";
import { SectionContainer } from "@/components/layout/section-container";
import { IconListItem } from "@/components/shared/icon-list-item";
import { licenseVerified } from "@/lib/compliance";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Get Started",
  description:
    "Tell Green Valor Lending about your Florida financing goals in four short steps. A preliminary inquiry, not a loan application.",
  path: "/get-started",
});

const asideIcons = [Clock, ShieldCheck, MessagesSquare, MapPinned];

/**
 * Only an https portal URL is linked (ARIVE borrower portal), and only once
 * licensing is verified: no mortgage applications are taken before then.
 */
function approvedApplicationUrl(url: string | null): string | null {
  if (!url || !licenseVerified) return null;
  try {
    return new URL(url).protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

export default function GetStartedPage() {
  const { hero, aside } = getStartedContent;
  return (
    <>
      <PageHero
        breadcrumbs={[{ title: "Get Started", href: "/get-started" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
      />
      <SectionContainer aria-label="Mortgage inquiry" reveal={false}>
        <div className="grid gap-10 lg:grid-cols-[1.75fr_1fr] lg:gap-14">
          <div className="min-w-0">
            <InquiryWizard applicationUrl={approvedApplicationUrl(company.urls.borrowerApplication)} />
          </div>
          <aside aria-labelledby="gs-aside" className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-surface-alt p-6 sm:p-8">
              <h2 id="gs-aside" className="type-eyebrow">
                {aside.title}
              </h2>
              <ul className="mt-6 space-y-6">
                {aside.points.map((p, i) => (
                  <IconListItem
                    key={p.title}
                    icon={asideIcons[i]!}
                    title={p.title}
                    description={p.description}
                  />
                ))}
              </ul>
              <p className="mt-8 border-t border-border pt-6 type-legal text-muted-foreground">
                {aside.note}
              </p>
            </div>
          </aside>
        </div>
      </SectionContainer>
    </>
  );
}

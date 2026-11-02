import { Building2, Landmark, MessageSquareWarning, SearchCheck } from "lucide-react";

import { complaintsContent as c } from "@/content/legal/complaints";
import { cfpb, floridaOfr, nmlsConsumerAccessService } from "@/content/regulators";
import { PageHero } from "@/components/layout/page-hero";
import { SectionContainer } from "@/components/layout/section-container";
import { ContactDetails } from "@/components/legal/contact-details";
import { DraftBanner } from "@/components/legal/legal-document";
import { ExternalLink } from "@/components/legal/external-link";
import { CTAButton } from "@/components/shared/cta-button";
import { legalContentApproved } from "@/lib/compliance";
import { getContactChannels, phoneHref } from "@/lib/company";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: c.title,
  description: c.description,
  path: "/consumer-complaints",
});

function Card({
  icon: Icon,
  title,
  children,
  testId,
}: {
  icon: typeof Landmark;
  title: string;
  children: React.ReactNode;
  testId?: string;
}) {
  return (
    <section
      aria-label={title}
      className="rounded-lg border border-border bg-card p-6 sm:p-8"
      data-testid={testId}
    >
      <div className="flex items-start gap-4">
        <span
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-gv-gold/60 text-gv-gold-deep"
          aria-hidden="true"
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="type-card-title">{title}</h3>
          <div className="mt-3 space-y-3 type-body">{children}</div>
        </div>
      </div>
    </section>
  );
}

const Tel = ({ number }: { number: string }) => (
  <a
    href={phoneHref(number)}
    className="font-semibold whitespace-nowrap text-gv-green underline underline-offset-2"
  >
    {number}
  </a>
);

export default function ConsumerComplaintsPage() {
  const hasChannels = getContactChannels().length > 0;
  return (
    <>
      <PageHero
        breadcrumbs={[{ title: c.title, href: "/consumer-complaints" }]}
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
      />
      <SectionContainer spacing="compact" reveal={false}>
        <div className="max-w-4xl space-y-12">
          {!legalContentApproved && <DraftBanner note={c.draftNote} />}

          <section aria-labelledby="company-heading">
            <h2 id="company-heading" className="type-section-title">
              {c.company.heading}
            </h2>
            <div className="mt-5 max-w-3xl space-y-5 type-body">
              <p>{c.company.body}</p>
              {hasChannels ? (
                <ContactDetails />
              ) : (
                <p data-testid="no-company-channels">{c.company.noChannels}</p>
              )}
              <CTAButton href={c.company.formLink.href} variant="default">
                {c.company.formLink.label}
              </CTAButton>
            </div>
          </section>

          <section aria-labelledby="regulators-heading">
            <h2 id="regulators-heading" className="type-section-title">
              {c.regulators.heading}
            </h2>
            <p className="mt-4 max-w-3xl type-body">{c.regulators.body}</p>
            <div className="mt-8 space-y-6">
              <Card icon={Landmark} title={floridaOfr.name} testId="regulator-ofr">
                <p>{floridaOfr.role}</p>
                <ul className="space-y-2">
                  <li>
                    <ExternalLink href={floridaOfr.complaintUrl}>
                      Submit a complaint to the Florida OFR
                    </ExternalLink>
                  </li>
                  <li>
                    Phone: <Tel number={floridaOfr.phone} />
                  </li>
                  <li>
                    Mail: {floridaOfr.name}, {floridaOfr.mailingAddress.join(", ")}
                  </li>
                </ul>
              </Card>
              <Card icon={Building2} title={cfpb.name} testId="regulator-cfpb">
                <p>{cfpb.role}</p>
                <ul className="space-y-2">
                  <li>
                    <ExternalLink href={cfpb.complaintUrl}>Submit a complaint to the CFPB</ExternalLink>
                  </li>
                  <li>
                    Phone: <Tel number={cfpb.phone} /> (TTY/TDD <Tel number={cfpb.tty} />
                    ), {cfpb.hours}
                  </li>
                </ul>
              </Card>
            </div>
          </section>

          <section aria-labelledby="verify-heading">
            <h2 id="verify-heading" className="type-section-title">
              {c.verify.heading}
            </h2>
            <p className="mt-4 max-w-3xl type-body">{c.verify.body}</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card icon={SearchCheck} title={nmlsConsumerAccessService.name}>
                <p>{nmlsConsumerAccessService.role}</p>
                <p>
                  <ExternalLink href={nmlsConsumerAccessService.url}>
                    Search NMLS Consumer Access
                  </ExternalLink>
                </p>
              </Card>
              <Card icon={MessageSquareWarning} title="Florida OFR license search">
                <p>Look up licenses issued by the Florida Office of Financial Regulation.</p>
                <p>
                  <ExternalLink href={floridaOfr.verifyLicenseUrl}>Verify a Florida license</ExternalLink>
                </p>
              </Card>
            </div>
          </section>
        </div>
      </SectionContainer>
    </>
  );
}

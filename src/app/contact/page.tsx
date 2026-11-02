import { Building2, Clock, Mail, MapPin, MapPinned, Phone, type LucideIcon } from "lucide-react";

import { company } from "@/config/company";
import { contactContent } from "@/content/contact";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { SectionContainer } from "@/components/layout/section-container";
import { CTAButton } from "@/components/shared/cta-button";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatAddress, formatPhone, hasValue, phoneHref } from "@/lib/company";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Green Valor Lending, a veteran-owned Florida mortgage brokerage, with questions about residential or Non-QM mortgage options or our services.",
  path: "/contact",
});

type Row = { key: string; icon: LucideIcon; label: string; value: React.ReactNode };

/** Only rows with a verified, configured value. Blank rows are never rendered. */
function contactRows(): Row[] {
  const rows: Row[] = [{ key: "company", icon: Building2, label: "Company", value: company.legalName }];
  if (hasValue(company.email))
    rows.push({
      key: "email",
      icon: Mail,
      label: "Email",
      value: (
        <a
          href={`mailto:${company.email}`}
          className="break-all text-gv-green underline-offset-4 hover:underline"
        >
          {company.email}
        </a>
      ),
    });
  if (hasValue(company.phone))
    rows.push({
      key: "phone",
      icon: Phone,
      label: "Phone",
      value: (
        <a href={phoneHref(company.phone)} className="text-gv-green underline-offset-4 hover:underline">
          {formatPhone(company.phone)}
        </a>
      ),
    });
  rows.push({
    key: "service",
    icon: MapPinned,
    label: "Service state",
    value: contactContent.info.serviceArea,
  });
  if (hasValue(company.businessHours))
    rows.push({ key: "hours", icon: Clock, label: "Business hours", value: company.businessHours });
  if (company.address)
    rows.push({
      key: "address",
      icon: MapPin,
      label: "Office",
      value: (
        <address className="not-italic">
          {formatAddress(company.address).map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      ),
    });
  return rows;
}

export default function ContactPage() {
  const { hero, info, form, borrowerCta, careersCta } = contactContent;
  const rows = contactRows();
  const hasDirectChannel = hasValue(company.email) || hasValue(company.phone);

  return (
    <>
      <PageHero
        breadcrumbs={[{ title: "Contact", href: "/contact" }]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
      />

      {/* 1 & 2. Contact information and general contact form */}
      <SectionContainer aria-label="Contact information and form" reveal={false}>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <section aria-labelledby="contact-info" className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading id="contact-info" eyebrow={info.eyebrow} title={info.title} />
            <ul
              className="mt-8 divide-y divide-border rounded-2xl border border-border bg-surface-alt"
              data-testid="contact-info"
            >
              {rows.map(({ key, icon: Icon, label, value }) => (
                <li key={key} className="flex gap-4 px-5 py-4 sm:px-6" data-row={key}>
                  <Icon
                    className="mt-0.5 size-5 shrink-0 text-gv-green"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                      {label}
                    </p>
                    <div className="mt-1 type-body text-gv-charcoal">{value}</div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 type-legal text-muted-foreground">{info.serviceAreaNote}</p>
            {!hasDirectChannel && (
              <p className="mt-2 type-legal text-muted-foreground" data-testid="contact-pending">
                {info.pending}
              </p>
            )}
          </section>

          <section aria-labelledby="contact-form-title">
            <SectionHeading
              id="contact-form-title"
              eyebrow={form.eyebrow}
              title={form.title}
              description={form.description}
            />
            <div className="mt-8">
              <ContactForm />
            </div>
          </section>
        </div>
      </SectionContainer>

      {/* 3 & 4. Borrower callout (primary) and careers callout (smaller) */}
      <section aria-label="Next steps" className="border-t border-border bg-surface-alt">
        <Container className="grid gap-6 py-16 sm:py-20 lg:grid-cols-[1.7fr_1fr] lg:py-24">
          <div className="surface-inverse relative flex flex-col justify-between gap-8 overflow-hidden rounded-2xl p-8 sm:p-10 lg:p-12">
            <div className="relative max-w-xl">
              <h2 id="contact-borrower-cta" className="type-section-title">
                {borrowerCta.title}
              </h2>
              <p className="mt-4 type-lead text-muted-foreground">{borrowerCta.description}</p>
            </div>
            <CTAButton href={borrowerCta.cta.href} variant="accent" className="relative self-start">
              {borrowerCta.cta.label}
            </CTAButton>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-7 sm:p-8">
            <div>
              <h2 id="contact-careers-cta" className="type-card-title">
                {careersCta.title}
              </h2>
              <p className="mt-3 type-support text-muted-foreground">{careersCta.description}</p>
            </div>
            <CTAButton href={careersCta.cta.href} variant="outline" size="default" className="self-start">
              {careersCta.cta.label}
            </CTAButton>
          </div>
        </Container>
      </section>
    </>
  );
}

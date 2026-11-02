import { BadgeCheck, CircleAlert, UserRound } from "lucide-react";

import { company } from "@/config/company";
import { licensingContent as c } from "@/content/legal/licensing";
import { floridaOfr, nmlsConsumerAccessService } from "@/content/regulators";
import { PageHero } from "@/components/layout/page-hero";
import { SectionContainer } from "@/components/layout/section-container";
import { DraftBanner } from "@/components/legal/legal-document";
import { ExternalLink } from "@/components/legal/external-link";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";
import { complianceApprovals, legalContentApproved, licenseVerified } from "@/lib/compliance";
import { hasValue } from "@/lib/company";
import { isNmlsId } from "@/lib/release-blockers.mjs";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: c.title, description: c.description, path: "/licensing" });

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { dateStyle: "long", timeZone: "UTC" });

export default function LicensingPage() {
  const florida = company.licensedStates[0];
  const nmlsId = isNmlsId(company.licensing.nmlsId) ? company.licensing.nmlsId : null;
  const licenseNumber = hasValue(florida.licenseNumber) ? florida.licenseNumber : null;
  const verifiedOn = complianceApprovals.licenseVerification?.verifiedOn ?? null;

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Legal company name", value: company.legalName },
    { label: "Florida mortgage broker license number", value: licenseNumber ?? c.notIssued },
    { label: "Company NMLS ID", value: nmlsId ?? c.notIssued },
    {
      label: "Verified license status",
      value:
        licenseVerified && verifiedOn
          ? `Active (verified ${longDate(verifiedOn)})`
          : "Pending; not yet verified",
    },
    { label: "Licensed state(s)", value: licenseVerified ? florida.name : c.plannedState },
    {
      label: "Regulator",
      value: <ExternalLink href={floridaOfr.website}>{floridaOfr.name}</ExternalLink>,
    },
    {
      label: "NMLS Consumer Access",
      value: (
        <>
          <ExternalLink href={nmlsConsumerAccessService.url}>nmlsconsumeraccess.org</ExternalLink>
          <span className="mt-1 block type-support text-muted-foreground">{c.consumerAccessHelp}</span>
        </>
      ),
    },
  ];

  return (
    <>
      <PageHero
        breadcrumbs={[{ title: c.title, href: "/licensing" }]}
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
      />
      <SectionContainer spacing="compact" reveal={false}>
        <div className="max-w-4xl space-y-10">
          {!legalContentApproved && (
            <DraftBanner note="This page is a draft prepared for review by legal counsel before the website launches." />
          )}

          <div
            className="flex gap-4 rounded-lg border border-border bg-card p-6"
            data-testid={licenseVerified ? "license-verified" : "license-pending"}
          >
            {licenseVerified ? (
              <BadgeCheck className="mt-1 size-6 shrink-0 text-gv-green" aria-hidden="true" />
            ) : (
              <CircleAlert className="mt-1 size-6 shrink-0 text-gv-gold-deep" aria-hidden="true" />
            )}
            <div>
              <h2 className="type-card-title">{licenseVerified ? c.verified.heading : c.pending.heading}</h2>
              {!licenseVerified && <p className="mt-2 type-body">{c.pending.body}</p>}
            </div>
          </div>

          <table className="w-full border-collapse text-left type-body" data-testid="licensing-table">
            <caption className="mb-4 text-left type-card-title">Company licensing details</caption>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.label}
                  className="block border-t border-border py-4 align-top last:border-b sm:table-row sm:py-0"
                >
                  <th scope="row" className="block pr-4 font-semibold sm:table-cell sm:w-1/3 sm:py-4">
                    {r.label}
                  </th>
                  <td className="mt-1 block break-words sm:mt-0 sm:table-cell sm:py-4">{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-4">
            <UserRound className="mt-1 size-6 shrink-0 text-gv-gold-deep" aria-hidden="true" />
            <div>
              <h2 className="type-card-title">Loan originator licensing</h2>
              <p className="mt-2 type-body">{c.originators}</p>
            </div>
          </div>

          <LegalDisclaimer
            include={["brokerStatement", "serviceArea", "noCommitment"]}
            label="Licensing disclosures"
            variant="boxed"
          />
        </div>
      </SectionContainer>
    </>
  );
}

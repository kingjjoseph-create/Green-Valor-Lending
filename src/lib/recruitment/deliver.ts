/**
 * Server-side delivery of recruitment inquiries. Never import from client
 * components: this module reads server-only secrets.
 *
 * Channels (configure one or both; see .env.example and DEPLOYMENT.md):
 *  - Webhook / CRM: RECRUITMENT_WEBHOOK_URL (HTTPS in production), optionally
 *    signed with RECRUITMENT_WEBHOOK_SECRET (HMAC-SHA256 of the raw body in the
 *    X-Green-Valor-Signature header).
 *  - Email via Resend: RESEND_API_KEY + RECRUITMENT_EMAIL_FROM, sent to
 *    RECRUITMENT_EMAIL_TO (falls back to NEXT_PUBLIC_RECRUITING_EMAIL).
 *
 * Applicant data is never logged. Recruitment inquiries are labeled
 * "recruitment_inquiry" and are never sent to borrower-lead destinations.
 */
import {
  envValue as val,
  postWebhook,
  renderRows,
  runChannels,
  sendResendEmail,
  type Fetch,
} from "@/lib/forms/delivery";

import {
  CONTACT_METHODS,
  EXPERIENCE_OPTIONS,
  labelFor,
  LICENSING_OPTIONS,
  PATHWAYS,
  type RecruitmentInquiry,
} from "./schema";

export type DeliveryConfig = {
  webhookUrl: string | null;
  webhookSecret: string | null;
  resendApiKey: string | null;
  emailFrom: string | null;
  emailTo: string | null;
};

export function readDeliveryConfig(env: NodeJS.ProcessEnv = process.env): DeliveryConfig {
  return {
    webhookUrl: val(env.RECRUITMENT_WEBHOOK_URL),
    webhookSecret: val(env.RECRUITMENT_WEBHOOK_SECRET),
    resendApiKey: val(env.RESEND_API_KEY),
    emailFrom: val(env.RECRUITMENT_EMAIL_FROM),
    emailTo: val(env.RECRUITMENT_EMAIL_TO) ?? val(env.NEXT_PUBLIC_RECRUITING_EMAIL),
  };
}

export function emailConfigured(c: DeliveryConfig) {
  return Boolean(c.resendApiKey && c.emailFrom && c.emailTo);
}

export function isDeliveryConfigured(c: DeliveryConfig) {
  return Boolean(c.webhookUrl) || emailConfigured(c);
}

/** The record sent to the recruiting workflow. Separate from any borrower lead schema. */
export function buildRecruitmentRecord(inquiry: RecruitmentInquiry, submittedAt = new Date()) {
  return {
    type: "recruitment_inquiry" as const,
    category: "careers" as const,
    source: "website:/careers",
    submittedAt: submittedAt.toISOString(),
    applicant: {
      fullName: inquiry.fullName,
      email: inquiry.email,
      phone: inquiry.phone,
      location: inquiry.location,
      currentProfession: inquiry.profession,
      mortgageExperience: labelFor(EXPERIENCE_OPTIONS, inquiry.experience),
      licensingStatus: labelFor(LICENSING_OPTIONS, inquiry.licensingStatus),
      nmlsId: inquiry.nmlsId || null,
      careerPathway: labelFor(PATHWAYS, inquiry.pathway),
      whyGreenValor: inquiry.why,
      preferredContactMethod: labelFor(CONTACT_METHODS, inquiry.contactMethod),
      consentAcknowledged: inquiry.consent,
    },
  };
}

export type RecruitmentRecord = ReturnType<typeof buildRecruitmentRecord>;

export function renderEmail(record: RecruitmentRecord) {
  const a = record.applicant;
  const rows: [string, string][] = [
    ["Full name", a.fullName],
    ["Email", a.email],
    ["Phone", a.phone],
    ["Location", a.location],
    ["Current profession", a.currentProfession],
    ["Mortgage industry experience", a.mortgageExperience],
    ["MLO licensing status", a.licensingStatus],
    ["NMLS ID", a.nmlsId ?? "Not provided"],
    ["Career pathway", a.careerPathway],
    ["Preferred contact", a.preferredContactMethod],
    ["Why Green Valor Lending?", a.whyGreenValor],
  ];
  const { text, html } = renderRows(
    "New recruitment inquiry",
    "Careers inquiry from the website. Not a borrower lead.",
    rows,
    record.submittedAt,
  );
  return { subject: `Recruitment inquiry: ${a.fullName} (${a.careerPathway})`, text, html };
}

async function sendWebhook(record: RecruitmentRecord, c: DeliveryConfig, f: Fetch) {
  await postWebhook(c.webhookUrl!, record, c.webhookSecret, f);
}

async function sendEmail(record: RecruitmentRecord, c: DeliveryConfig, f: Fetch) {
  const { subject, text, html } = renderEmail(record);
  await sendResendEmail(
    {
      apiKey: c.resendApiKey!,
      from: c.emailFrom!,
      to: c.emailTo!,
      replyTo: record.applicant.email,
      subject,
      text,
      html,
    },
    f,
  );
}

export type DeliveryResult = { delivered: boolean; channels: { name: string; ok: boolean }[] };

/** Deliver to every configured channel. Succeeds when at least one channel accepted the record. */
export async function deliverRecruitment(
  record: RecruitmentRecord,
  config: DeliveryConfig = readDeliveryConfig(),
  f: Fetch = fetch,
): Promise<DeliveryResult> {
  const jobs: { name: string; run: () => Promise<void> }[] = [];
  if (config.webhookUrl) jobs.push({ name: "webhook", run: () => sendWebhook(record, config, f) });
  if (emailConfigured(config)) jobs.push({ name: "email", run: () => sendEmail(record, config, f) });

  return runChannels("recruitment", jobs);
}

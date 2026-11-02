/**
 * Server-side delivery of general contact inquiries. Never import from client
 * components: this module reads server-only secrets.
 *
 * Channels (configure one or both; see .env.example and DEPLOYMENT.md):
 *  - CRM / webhook: CONTACT_WEBHOOK_URL, optionally signed with
 *    CONTACT_WEBHOOK_SECRET (X-Green-Valor-Signature: sha256=<HMAC of body>).
 *  - Email via Resend: RESEND_API_KEY + CONTACT_EMAIL_FROM, sent to
 *    CONTACT_EMAIL_TO (falls back to NEXT_PUBLIC_COMPANY_EMAIL). Mortgage
 *    inquiries go to CONTACT_MORTGAGE_EMAIL_TO when it is set.
 *
 * Message contents are never logged.
 */
import {
  envValue as val,
  postWebhook,
  renderRows,
  runChannels,
  sendResendEmail,
  type Fetch,
} from "@/lib/forms/delivery";
import { reasonLabel, type ContactInquiry, type ContactRoutedReason } from "./schema";

export type ContactDeliveryConfig = {
  webhookUrl: string | null;
  webhookSecret: string | null;
  resendApiKey: string | null;
  emailFrom: string | null;
  generalTo: string | null;
  mortgageTo: string | null;
};

export function readContactConfig(env: NodeJS.ProcessEnv = process.env): ContactDeliveryConfig {
  return {
    webhookUrl: val(env.CONTACT_WEBHOOK_URL),
    webhookSecret: val(env.CONTACT_WEBHOOK_SECRET),
    resendApiKey: val(env.RESEND_API_KEY),
    emailFrom: val(env.CONTACT_EMAIL_FROM),
    generalTo: val(env.CONTACT_EMAIL_TO) ?? val(env.NEXT_PUBLIC_COMPANY_EMAIL),
    mortgageTo: val(env.CONTACT_MORTGAGE_EMAIL_TO),
  };
}

const MORTGAGE_REASONS: ContactRoutedReason[] = ["residential", "non-qm"];

/** CRM classification. Mortgage reasons are borrower inquiries (not applications); the rest are general. */
export function classify(reason: ContactRoutedReason) {
  const mortgage = MORTGAGE_REASONS.includes(reason);
  return {
    category: mortgage ? ("mortgage_inquiry" as const) : ("general_inquiry" as const),
    leadType: mortgage ? ("borrower" as const) : ("general" as const),
    product: mortgage ? (reason as "residential" | "non-qm") : null,
  };
}

/** Which inbox receives this inquiry by email. */
export function emailRecipient(reason: ContactRoutedReason, c: ContactDeliveryConfig): string | null {
  return (MORTGAGE_REASONS.includes(reason) ? (c.mortgageTo ?? c.generalTo) : c.generalTo) ?? null;
}

export function contactEmailConfigured(c: ContactDeliveryConfig) {
  return Boolean(c.resendApiKey && c.emailFrom && c.generalTo);
}

export function isContactDeliveryConfigured(c: ContactDeliveryConfig) {
  return Boolean(c.webhookUrl) || contactEmailConfigured(c);
}

export function buildContactRecord(inquiry: ContactInquiry, submittedAt = new Date()) {
  const { category, leadType, product } = classify(inquiry.reason);
  return {
    type: "contact_inquiry" as const,
    category,
    source: "website:/contact",
    submittedAt: submittedAt.toISOString(),
    crm: { leadType, product, reason: reasonLabel(inquiry.reason) },
    contact: {
      fullName: inquiry.fullName,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
      consentAcknowledged: inquiry.consent,
    },
  };
}

export type ContactRecord = ReturnType<typeof buildContactRecord>;

export function renderContactEmail(record: ContactRecord) {
  const c = record.contact;
  const { text, html } = renderRows(
    "New website contact inquiry",
    record.category === "mortgage_inquiry"
      ? `Mortgage inquiry (${record.crm.reason}). This is not a loan application.`
      : `General inquiry (${record.crm.reason}).`,
    [
      ["Reason", record.crm.reason],
      ["Full name", c.fullName],
      ["Email", c.email],
      ["Phone", c.phone],
      ["Message", c.message],
    ],
    record.submittedAt,
  );
  return { subject: `Website inquiry: ${record.crm.reason} from ${c.fullName}`, text, html };
}

export async function deliverContact(
  record: ContactRecord,
  reason: ContactRoutedReason,
  config: ContactDeliveryConfig = readContactConfig(),
  f: Fetch = fetch,
) {
  const jobs: { name: string; run: () => Promise<void> }[] = [];
  if (config.webhookUrl)
    jobs.push({
      name: "webhook",
      run: () => postWebhook(config.webhookUrl!, record, config.webhookSecret, f),
    });
  const to = emailRecipient(reason, config);
  if (contactEmailConfigured(config) && to) {
    const { subject, text, html } = renderContactEmail(record);
    jobs.push({
      name: "email",
      run: () =>
        sendResendEmail(
          {
            apiKey: config.resendApiKey!,
            from: config.emailFrom!,
            to,
            replyTo: record.contact.email,
            subject,
            text,
            html,
          },
          f,
        ),
    });
  }
  return runChannels("contact", jobs);
}

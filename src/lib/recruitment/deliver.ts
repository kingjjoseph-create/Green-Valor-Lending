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
import { createHmac } from "node:crypto";

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

const val = (v: string | undefined) => (v && v.trim() !== "" ? v.trim() : null);

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

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

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
  const text = [
    "New recruitment inquiry (careers, not a borrower lead)",
    `Submitted: ${record.submittedAt}`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
  ].join("\n");
  const html = `<h2>New recruitment inquiry</h2><p>Careers inquiry from the website. Not a borrower lead.</p><table cellpadding="6">${rows
    .map(
      ([k, v]) =>
        `<tr><th align="left" valign="top">${escapeHtml(k)}</th><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("")}</table><p>Submitted ${escapeHtml(record.submittedAt)}</p>`;
  return { subject: `Recruitment inquiry: ${a.fullName} (${a.careerPathway})`, text, html };
}

type Fetch = typeof fetch;
const TIMEOUT_MS = 10_000;

async function sendWebhook(record: RecruitmentRecord, c: DeliveryConfig, f: Fetch) {
  const body = JSON.stringify(record);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "GreenValorWebsite/1.0",
  };
  if (c.webhookSecret) {
    headers["X-Green-Valor-Signature"] =
      `sha256=${createHmac("sha256", c.webhookSecret).update(body).digest("hex")}`;
  }
  const res = await f(c.webhookUrl!, {
    method: "POST",
    headers,
    body,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`webhook responded ${res.status}`);
}

async function sendEmail(record: RecruitmentRecord, c: DeliveryConfig, f: Fetch) {
  const { subject, text, html } = renderEmail(record);
  const res = await f("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${c.resendApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: c.emailFrom,
      to: [c.emailTo],
      reply_to: record.applicant.email,
      subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`email provider responded ${res.status}`);
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

  const results = await Promise.allSettled(jobs.map((j) => j.run()));
  const channels = jobs.map((j, i) => ({ name: j.name, ok: results[i]!.status === "fulfilled" }));
  for (const [i, r] of results.entries()) {
    // Log the channel and reason only. Never log applicant data.
    if (r.status === "rejected")
      console.error(
        `[recruitment] ${jobs[i]!.name} delivery failed: ${String((r.reason as Error)?.message ?? r.reason)}`,
      );
  }
  return { delivered: channels.some((c) => c.ok), channels };
}

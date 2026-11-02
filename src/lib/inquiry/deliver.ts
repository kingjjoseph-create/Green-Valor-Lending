/**
 * Server-side delivery of Get Started mortgage inquiries (borrower leads).
 * Never import from client components: reads server-only secrets.
 *
 * Channels (configure one or both; see .env.example and DEPLOYMENT.md):
 *  - CRM / webhook: INQUIRY_WEBHOOK_URL, optionally signed with
 *    INQUIRY_WEBHOOK_SECRET (X-Green-Valor-Signature: sha256=<HMAC of body>).
 *  - Email notification via Resend: RESEND_API_KEY + INQUIRY_EMAIL_FROM
 *    (falls back to CONTACT_EMAIL_FROM), sent to INQUIRY_EMAIL_TO (falls back
 *    to CONTACT_MORTGAGE_EMAIL_TO, CONTACT_EMAIL_TO, NEXT_PUBLIC_COMPANY_EMAIL).
 *
 * Applicant details are never logged.
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
  GOALS,
  labelFor,
  OCCUPANCY,
  PROPERTY_TYPES,
  stateName,
  TIMELINES,
  type Goal,
  type MortgageInquiry,
} from "./schema";

export type InquiryDeliveryConfig = {
  webhookUrl: string | null;
  webhookSecret: string | null;
  resendApiKey: string | null;
  emailFrom: string | null;
  emailTo: string | null;
};

export function readInquiryConfig(env: NodeJS.ProcessEnv = process.env): InquiryDeliveryConfig {
  return {
    webhookUrl: val(env.INQUIRY_WEBHOOK_URL),
    webhookSecret: val(env.INQUIRY_WEBHOOK_SECRET),
    resendApiKey: val(env.RESEND_API_KEY),
    emailFrom: val(env.INQUIRY_EMAIL_FROM) ?? val(env.CONTACT_EMAIL_FROM),
    emailTo:
      val(env.INQUIRY_EMAIL_TO) ??
      val(env.CONTACT_MORTGAGE_EMAIL_TO) ??
      val(env.CONTACT_EMAIL_TO) ??
      val(env.NEXT_PUBLIC_COMPANY_EMAIL),
  };
}

export const inquiryEmailConfigured = (c: InquiryDeliveryConfig) =>
  Boolean(c.resendApiKey && c.emailFrom && c.emailTo);
export const isInquiryDeliveryConfigured = (c: InquiryDeliveryConfig) =>
  Boolean(c.webhookUrl) || inquiryEmailConfigured(c);

const PRODUCT_BY_GOAL: Record<Goal, "residential" | "non-qm" | "residential-or-non-qm" | "undetermined"> = {
  purchase: "residential",
  refinance: "residential",
  "non-qm": "non-qm",
  investment: "residential-or-non-qm",
  other: "undetermined",
};

/** CRM classification for routing and follow-up priority. */
export function classifyInquiry(i: MortgageInquiry) {
  return {
    leadType: "borrower" as const,
    goal: i.goal,
    goalLabel: labelFor(GOALS, i.goal),
    productInterest: PRODUCT_BY_GOAL[i.goal],
    transaction:
      i.goal === "purchase"
        ? ("purchase" as const)
        : i.goal === "refinance"
          ? ("refinance" as const)
          : ("unspecified" as const),
    occupancy: i.occupancy,
    followUp:
      i.timeline === "asap" || i.timeline === "1-3-months"
        ? ("near-term" as const)
        : i.timeline === "exploring"
          ? ("nurture" as const)
          : ("later" as const),
  };
}

export function buildInquiryRecord(i: MortgageInquiry, submittedAt = new Date()) {
  const classification = classifyInquiry(i);
  return {
    type: "mortgage_inquiry" as const,
    category: "borrower_lead" as const,
    source: "website:/get-started",
    submittedAt: submittedAt.toISOString(),
    note: "Preliminary inquiry, not a loan application.",
    classification,
    property: {
      state: i.propertyState,
      location: i.location,
      type: labelFor(PROPERTY_TYPES, i.propertyType),
      occupancy: labelFor(OCCUPANCY, i.occupancy),
      estimatedValue: i.estimatedValue,
    },
    financing: {
      approximateAmount: i.loanAmount,
      timeline: labelFor(TIMELINES, i.timeline),
      notes: i.notes || null,
    },
    contact: {
      fullName: i.fullName,
      email: i.email,
      phone: i.phone,
      preferredContactMethod: labelFor(CONTACT_METHODS, i.contactMethod),
      message: i.message || null,
      consentAcknowledged: i.consent,
    },
  };
}

export type InquiryRecord = ReturnType<typeof buildInquiryRecord>;

const usd = (n: number | null) =>
  n === null
    ? "Not provided"
    : n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function renderInquiryEmail(r: InquiryRecord) {
  const { text, html } = renderRows(
    "New Get Started mortgage inquiry",
    `${r.classification.goalLabel}. Follow-up: ${r.classification.followUp}. This is a preliminary inquiry, not a loan application.`,
    [
      ["Goal", r.classification.goalLabel],
      ["Property", `${r.property.location}, ${stateName(r.property.state)}`],
      ["Property type", r.property.type],
      ["Occupancy", r.property.occupancy],
      ["Estimated price or value", usd(r.property.estimatedValue)],
      ["Approximate financing", usd(r.financing.approximateAmount)],
      ["Timeline", r.financing.timeline],
      ["Financing notes", r.financing.notes ?? "None"],
      ["Full name", r.contact.fullName],
      ["Email", r.contact.email],
      ["Phone", r.contact.phone],
      ["Preferred contact", r.contact.preferredContactMethod],
      ["Message", r.contact.message ?? "None"],
    ],
    r.submittedAt,
  );
  return { subject: `Mortgage inquiry: ${r.classification.goalLabel} (${r.contact.fullName})`, text, html };
}

export async function deliverInquiry(
  record: InquiryRecord,
  config: InquiryDeliveryConfig = readInquiryConfig(),
  f: Fetch = fetch,
) {
  const jobs: { name: string; run: () => Promise<void> }[] = [];
  if (config.webhookUrl)
    jobs.push({ name: "crm", run: () => postWebhook(config.webhookUrl!, record, config.webhookSecret, f) });
  if (inquiryEmailConfigured(config)) {
    const { subject, text, html } = renderInquiryEmail(record);
    jobs.push({
      name: "email",
      run: () =>
        sendResendEmail(
          {
            apiKey: config.resendApiKey!,
            from: config.emailFrom!,
            to: config.emailTo!,
            replyTo: record.contact.email,
            subject,
            text,
            html,
          },
          f,
        ),
    });
  }
  return runChannels("inquiry", jobs);
}

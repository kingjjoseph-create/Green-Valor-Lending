/**
 * General contact inquiry: fields, options and validation shared by the form
 * (client) and POST /api/contact (server). The server always re-validates.
 *
 * Deliberately no mortgage application fields (income, SSN, credit, property
 * details). Career inquiries are routed to /careers and its recruitment
 * workflow, never through this endpoint.
 */

export const CONTACT_REASONS = [
  { value: "residential", label: "Residential Mortgage Inquiry" },
  { value: "non-qm", label: "Non-QM Mortgage Inquiry" },
  { value: "general", label: "General Question" },
  { value: "career", label: "Career Opportunity" },
  { value: "other", label: "Other" },
] as const;

export type ContactReason = (typeof CONTACT_REASONS)[number]["value"];
/** Reasons this endpoint accepts. "career" goes to the recruitment workflow instead. */
export type ContactRoutedReason = Exclude<ContactReason, "career">;

export type ContactInquiry = {
  fullName: string;
  email: string;
  phone: string;
  reason: ContactRoutedReason;
  message: string;
  consent: true;
};

export type ContactField = keyof ContactInquiry;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const CONTACT_LIMITS = {
  fullName: 100,
  email: 254,
  phone: 25,
  messageMin: 10,
  messageMax: 2000,
} as const;

export const CONTACT_FIELD_ORDER: ContactField[] = [
  "fullName",
  "email",
  "phone",
  "reason",
  "message",
  "consent",
];

/** Honeypot field: hidden from people; bots fill it. */
export const CONTACT_HONEYPOT = "website";

export const CAREER_REASON = "career" as const;

export function isContactReason(value: unknown): value is ContactReason {
  return typeof value === "string" && CONTACT_REASONS.some((r) => r.value === value);
}

export function reasonLabel(value: string) {
  return CONTACT_REASONS.find((r) => r.value === value)?.label ?? value;
}

function clean(value: unknown, { multiline = false } = {}): string {
  if (typeof value !== "string") return "";
  const noControl = value.replace(multiline ? /[^\P{Cc}\n]/gu : /\p{Cc}/gu, " ");
  return multiline
    ? noControl
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    : noControl.replace(/\s+/g, " ").trim();
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ContactValidation = { ok: true; data: ContactInquiry } | { ok: false; errors: ContactErrors };

export function validateContact(input: Record<string, unknown>): ContactValidation {
  const errors: ContactErrors = {};

  const fullName = clean(input.fullName);
  if (!fullName) errors.fullName = "Enter your full name.";
  else if (fullName.length > CONTACT_LIMITS.fullName)
    errors.fullName = `Use ${CONTACT_LIMITS.fullName} characters or fewer.`;

  const email = clean(input.email).toLowerCase();
  if (!email) errors.email = "Enter your email address.";
  else if (email.length > CONTACT_LIMITS.email || !EMAIL.test(email))
    errors.email = "Enter a valid email address, like name@example.com.";

  const phone = clean(input.phone);
  const digits = phone.replace(/\D/g, "");
  if (!phone) errors.phone = "Enter your phone number.";
  else if (
    phone.length > CONTACT_LIMITS.phone ||
    !/^[\d\s()+.-]+$/.test(phone) ||
    digits.length < 10 ||
    digits.length > 15
  )
    errors.phone = "Enter a valid phone number, including area code, like (813) 555-0100.";

  if (!isContactReason(input.reason)) errors.reason = "Choose a reason for contacting us.";
  else if (input.reason === CAREER_REASON)
    errors.reason = "Career inquiries use our recruitment form on the Careers page.";

  const message = clean(input.message, { multiline: true });
  if (!message) errors.message = "Enter a message.";
  else if (message.length < CONTACT_LIMITS.messageMin)
    errors.message = `Please write at least ${CONTACT_LIMITS.messageMin} characters.`;
  else if (message.length > CONTACT_LIMITS.messageMax)
    errors.message = `Please shorten your message to ${CONTACT_LIMITS.messageMax.toLocaleString("en-US")} characters or fewer.`;

  if (input.consent !== true && input.consent !== "on" && input.consent !== "true")
    errors.consent = "Please confirm the acknowledgment to send your message.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    data: { fullName, email, phone, reason: input.reason as ContactRoutedReason, message, consent: true },
  };
}

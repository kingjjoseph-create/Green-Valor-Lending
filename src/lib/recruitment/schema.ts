/**
 * Recruitment inquiry: fields, options and validation, shared by the form
 * (client) and the /api/recruitment endpoint (server). The server always
 * re-validates; client validation is only for faster feedback.
 *
 * This is a CAREERS inquiry. It deliberately has no mortgage/borrower fields
 * (loan amount, property, income, SSN, credit) and is never routed as a
 * borrower lead.
 */

export const PATHWAYS = [
  { value: "licensed", label: "Licensed Mortgage Loan Originator" },
  { value: "aspiring", label: "Aspiring Mortgage Loan Originator" },
  { value: "entrepreneur", label: "Entrepreneur / Career Transition" },
  { value: "other", label: "Other Professional Opportunity" },
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: "none", label: "No mortgage industry experience" },
  { value: "under-1", label: "Less than 1 year" },
  { value: "1-3", label: "1 to 3 years" },
  { value: "3-5", label: "3 to 5 years" },
  { value: "5-plus", label: "More than 5 years" },
] as const;

export const LICENSING_OPTIONS = [
  { value: "licensed-active", label: "Currently licensed MLO" },
  { value: "in-progress", label: "Working toward licensing (education or exam)" },
  { value: "previously-licensed", label: "Previously licensed, not currently active" },
  { value: "not-licensed", label: "Not licensed" },
] as const;

export const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
] as const;

type Values<T extends readonly { value: string }[]> = T[number]["value"];
export type Pathway = Values<typeof PATHWAYS>;

export type RecruitmentInquiry = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  profession: string;
  experience: Values<typeof EXPERIENCE_OPTIONS>;
  licensingStatus: Values<typeof LICENSING_OPTIONS>;
  nmlsId: string;
  pathway: Pathway;
  why: string;
  contactMethod: Values<typeof CONTACT_METHODS>;
  consent: true;
};

export type RecruitmentField = keyof RecruitmentInquiry;
export type RecruitmentErrors = Partial<Record<RecruitmentField, string>>;

export const LIMITS = {
  fullName: 100,
  email: 254,
  phone: 25,
  location: 120,
  profession: 120,
  nmlsId: 12,
  whyMin: 20,
  whyMax: 2000,
} as const;

/** Field names in form order, used for focusing the first error. */
export const FIELD_ORDER: RecruitmentField[] = [
  "fullName",
  "email",
  "phone",
  "location",
  "profession",
  "experience",
  "licensingStatus",
  "nmlsId",
  "pathway",
  "why",
  "contactMethod",
  "consent",
];

/** Honeypot field name: real people never see or fill it. */
export const HONEYPOT_FIELD = "company_website";

export function isPathway(value: unknown): value is Pathway {
  return typeof value === "string" && PATHWAYS.some((p) => p.value === value);
}

/** Collapse whitespace and drop control characters (except newlines in long text). */
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

// Pragmatic email check: one @, no spaces, a dot in the domain, sane length.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function oneOf<T extends readonly { value: string }[]>(options: T, value: unknown): value is Values<T> {
  return typeof value === "string" && options.some((o) => o.value === value);
}

export type ValidationResult =
  { ok: true; data: RecruitmentInquiry } | { ok: false; errors: RecruitmentErrors };

/** Validate raw input (form values or JSON body). Unknown keys are ignored. */
export function validateRecruitment(input: Record<string, unknown>): ValidationResult {
  const errors: RecruitmentErrors = {};

  const fullName = clean(input.fullName);
  if (!fullName) errors.fullName = "Enter your full name.";
  else if (fullName.length > LIMITS.fullName) errors.fullName = `Use ${LIMITS.fullName} characters or fewer.`;

  const email = clean(input.email).toLowerCase();
  if (!email) errors.email = "Enter your email address.";
  else if (email.length > LIMITS.email || !EMAIL.test(email))
    errors.email = "Enter a valid email address, like name@example.com.";

  const phone = clean(input.phone);
  const digits = phone.replace(/\D/g, "");
  if (!phone) errors.phone = "Enter your phone number.";
  else if (
    phone.length > LIMITS.phone ||
    !/^[\d\s()+.-]+$/.test(phone) ||
    digits.length < 10 ||
    digits.length > 15
  )
    errors.phone = "Enter a valid phone number, including area code.";

  const location = clean(input.location);
  if (!location) errors.location = "Enter your Florida location or intended work location.";
  else if (location.length > LIMITS.location) errors.location = `Use ${LIMITS.location} characters or fewer.`;

  const profession = clean(input.profession);
  if (!profession) errors.profession = "Enter your current profession.";
  else if (profession.length > LIMITS.profession)
    errors.profession = `Use ${LIMITS.profession} characters or fewer.`;

  if (!oneOf(EXPERIENCE_OPTIONS, input.experience))
    errors.experience = "Select your mortgage industry experience.";
  if (!oneOf(LICENSING_OPTIONS, input.licensingStatus))
    errors.licensingStatus = "Select your current licensing status.";

  const nmlsId = clean(input.nmlsId).replace(/^#/, "");
  if (nmlsId && !/^\d{1,12}$/.test(nmlsId))
    errors.nmlsId = "An NMLS ID contains numbers only. Leave it blank if you don't have one.";

  if (!isPathway(input.pathway)) errors.pathway = "Select a career pathway.";

  const why = clean(input.why, { multiline: true });
  if (!why) errors.why = "Tell us briefly why you're interested in Green Valor Lending.";
  else if (why.length < LIMITS.whyMin) errors.why = `Please write at least ${LIMITS.whyMin} characters.`;
  else if (why.length > LIMITS.whyMax) errors.why = `Use ${LIMITS.whyMax} characters or fewer.`;

  if (!oneOf(CONTACT_METHODS, input.contactMethod))
    errors.contactMethod = "Choose how you'd like us to contact you.";

  if (input.consent !== true && input.consent !== "on" && input.consent !== "true")
    errors.consent = "Please confirm the acknowledgment to submit your inquiry.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      fullName,
      email,
      phone,
      location,
      profession,
      experience: input.experience as RecruitmentInquiry["experience"],
      licensingStatus: input.licensingStatus as RecruitmentInquiry["licensingStatus"],
      nmlsId,
      pathway: input.pathway as Pathway,
      why,
      contactMethod: input.contactMethod as RecruitmentInquiry["contactMethod"],
      consent: true,
    },
  };
}

export function labelFor<T extends readonly { value: string; label: string }[]>(
  options: T,
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

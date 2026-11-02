/**
 * Get Started mortgage inquiry: options, step-by-step validation, and full
 * validation shared by the wizard (client) and POST /api/inquiry (server).
 *
 * This is a lead intake form, NOT a loan application. It never asks for SSN,
 * date of birth, account numbers, tax returns, paystubs, driver's license,
 * credit reports, or full application data. Applications and documents go
 * through the secure ARIVE borrower portal.
 */

export const GOALS = [
  {
    value: "purchase",
    label: "Purchase a Home",
    description: "Buy a primary residence or second home in Florida.",
  },
  {
    value: "refinance",
    label: "Refinance an Existing Mortgage",
    description: "Explore new terms on a home you already own.",
  },
  {
    value: "non-qm",
    label: "Explore a Non-QM Mortgage",
    description: "Alternative documentation, such as bank statement or 1099 options.",
  },
  {
    value: "investment",
    label: "Finance an Investment Property",
    description: "Purchase or refinance a rental or other investment property.",
  },
  {
    value: "other",
    label: "Other Mortgage Inquiry",
    description: "Something else on your mind? Tell us about it.",
  },
] as const;

export const PROPERTY_TYPES = [
  { value: "single-family", label: "Single-family home" },
  { value: "condo", label: "Condominium" },
  { value: "townhouse", label: "Townhouse" },
  { value: "multi-unit", label: "2 to 4 unit property" },
  { value: "other", label: "Other or not sure" },
] as const;

export const OCCUPANCY = [
  { value: "primary", label: "Primary residence" },
  { value: "second-home", label: "Second home" },
  { value: "investment", label: "Investment property" },
] as const;

export const TIMELINES = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3-months", label: "Within 1 to 3 months" },
  { value: "3-6-months", label: "In 3 to 6 months" },
  { value: "6-plus-months", label: "In 6 months or more" },
  { value: "exploring", label: "Just exploring options" },
] as const;

export const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
] as const;

/** All U.S. states and DC. Only Florida is an active service state. */
export const STATES = [
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["DC", "District of Columbia"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
] as const;

/** Hidden honeypot field name: people never see or fill it. */
export const INQUIRY_HONEYPOT = "company_name";

export const SERVICE_STATE = "FL";
export const FLORIDA_ONLY_MESSAGE =
  "Green Valor Lending currently serves properties in Florida only, so we aren't able to help with a property in this state.";

type Values<T extends readonly { value: string }[]> = T[number]["value"];
export type Goal = Values<typeof GOALS>;

export const LIMITS = {
  fullName: 100,
  email: 254,
  phone: 25,
  location: 120,
  notes: 1000,
  message: 1000,
  minAmount: 10_000,
  maxAmount: 100_000_000,
} as const;

/** Raw wizard values (strings), as the form holds them. */
export type InquiryValues = {
  goal: string;
  propertyState: string;
  location: string;
  propertyType: string;
  occupancy: string;
  estimatedValue: string;
  loanAmount: string;
  timeline: string;
  notes: string;
  fullName: string;
  email: string;
  phone: string;
  contactMethod: string;
  message: string;
  consent: boolean;
};

export const emptyInquiry: InquiryValues = {
  goal: "",
  propertyState: "",
  location: "",
  propertyType: "",
  occupancy: "",
  estimatedValue: "",
  loanAmount: "",
  timeline: "",
  notes: "",
  fullName: "",
  email: "",
  phone: "",
  contactMethod: "",
  message: "",
  consent: false,
};

export type InquiryField = keyof InquiryValues;
export type InquiryErrors = Partial<Record<InquiryField, string>>;

export const STEPS: { id: string; title: string; fields: InquiryField[] }[] = [
  { id: "goal", title: "Financing goal", fields: ["goal"] },
  {
    id: "property",
    title: "Property details",
    fields: ["propertyState", "location", "propertyType", "occupancy", "estimatedValue"],
  },
  { id: "financing", title: "Financing details", fields: ["loanAmount", "timeline", "notes"] },
  {
    id: "contact",
    title: "Contact information",
    fields: ["fullName", "email", "phone", "contactMethod", "message", "consent"],
  },
];

export type MortgageInquiry = {
  goal: Goal;
  propertyState: typeof SERVICE_STATE;
  location: string;
  propertyType: Values<typeof PROPERTY_TYPES>;
  occupancy: Values<typeof OCCUPANCY>;
  estimatedValue: number | null;
  loanAmount: number | null;
  timeline: Values<typeof TIMELINES>;
  notes: string;
  fullName: string;
  email: string;
  phone: string;
  contactMethod: Values<typeof CONTACT_METHODS>;
  message: string;
  consent: true;
};

export const labelFor = (options: readonly { value: string; label: string }[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value;
export const stateName = (code: string) => STATES.find(([c]) => c === code)?.[1] ?? code;

function oneOf<T extends readonly { value: string }[]>(options: T, value: unknown): value is Values<T> {
  return typeof value === "string" && options.some((o) => o.value === value);
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

/**
 * Parse an optional dollar amount: "450,000", "$450000", "450000.00".
 * Returns null for blank, NaN for anything that is not a plain amount.
 */
export function parseAmount(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : Number.NaN;
  if (typeof raw !== "string") return Number.NaN;
  const s = raw.replace(/[\s$,]/g, "");
  if (s === "") return null;
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return Number.NaN;
  return Number(s);
}

/** Flags text that looks like an SSN or a bank/card account number. */
export function looksSensitive(text: string): boolean {
  return (
    /\b\d{3}-\d{2}-\d{4}\b/.test(text) || // SSN with dashes
    /(?<![\d$,.])\d{9}(?![\d,.])/.test(text) || // bare 9 digits (SSN or routing number)
    /(?<![\d$,.])\d{12,19}(?![\d,.])/.test(text) || // long account or card number
    /\b(?:\d{4}[ -]){3}\d{1,7}\b/.test(text) // card number in groups
  );
}

const SENSITIVE_MESSAGE =
  "Please remove anything that looks like a Social Security, account, or card number. We never need those here.";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function checkAmount(raw: unknown, label: string): { value: number | null; error?: string } {
  const n = parseAmount(raw);
  if (n === null) return { value: null };
  if (Number.isNaN(n)) return { value: null, error: `Enter the ${label} as a dollar amount, like 350,000.` };
  if (n < LIMITS.minAmount)
    return {
      value: null,
      error: `Enter at least $${LIMITS.minAmount.toLocaleString("en-US")}, or leave it blank.`,
    };
  if (n > LIMITS.maxAmount)
    return { value: null, error: `That ${label} looks too high. Please check the amount.` };
  return { value: Math.round(n) };
}

/** Validate a subset of fields (one wizard step). Returns errors for those fields only. */
export function validateFields(input: Record<string, unknown>, fields: InquiryField[]): InquiryErrors {
  const all = collect(input);
  const out: InquiryErrors = {};
  for (const f of fields) if (all.errors[f]) out[f] = all.errors[f];
  return out;
}

export type InquiryValidation = { ok: true; data: MortgageInquiry } | { ok: false; errors: InquiryErrors };

export function validateInquiry(input: Record<string, unknown>): InquiryValidation {
  const { errors, data } = collect(input);
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: data as MortgageInquiry };
}

function collect(input: Record<string, unknown>) {
  const errors: InquiryErrors = {};

  if (!oneOf(GOALS, input.goal)) errors.goal = "Choose what you would like to accomplish.";

  const state = clean(input.propertyState).toUpperCase();
  if (!state) errors.propertyState = "Select the state where the property is located.";
  else if (!STATES.some(([c]) => c === state)) errors.propertyState = "Select a state from the list.";
  else if (state !== SERVICE_STATE) errors.propertyState = FLORIDA_ONLY_MESSAGE;

  const location = clean(input.location);
  if (!location) errors.location = "Enter a city, county, or area in Florida.";
  else if (location.length > LIMITS.location) errors.location = `Use ${LIMITS.location} characters or fewer.`;

  if (!oneOf(PROPERTY_TYPES, input.propertyType)) errors.propertyType = "Select a property type.";
  if (!oneOf(OCCUPANCY, input.occupancy)) errors.occupancy = "Select how the property will be used.";

  const value = checkAmount(input.estimatedValue, "estimated price or value");
  if (value.error) errors.estimatedValue = value.error;
  const loan = checkAmount(input.loanAmount, "financing amount");
  if (loan.error) errors.loanAmount = loan.error;
  else if (loan.value !== null && value.value !== null && loan.value > value.value)
    errors.loanAmount = "The financing amount can't be more than the estimated price or value.";

  if (!oneOf(TIMELINES, input.timeline)) errors.timeline = "Select a general timeline.";

  const notes = clean(input.notes, { multiline: true });
  if (notes.length > LIMITS.notes)
    errors.notes = `Use ${LIMITS.notes.toLocaleString("en-US")} characters or fewer.`;
  else if (looksSensitive(notes)) errors.notes = SENSITIVE_MESSAGE;

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
    errors.phone = "Enter a valid phone number, including area code, like (813) 555-0100.";

  if (!oneOf(CONTACT_METHODS, input.contactMethod))
    errors.contactMethod = "Choose how you'd like us to contact you.";

  const message = clean(input.message, { multiline: true });
  if (message.length > LIMITS.message)
    errors.message = `Use ${LIMITS.message.toLocaleString("en-US")} characters or fewer.`;
  else if (looksSensitive(message)) errors.message = SENSITIVE_MESSAGE;

  if (input.consent !== true && input.consent !== "on" && input.consent !== "true")
    errors.consent = "Please confirm the acknowledgment to send your inquiry.";

  const data = {
    goal: input.goal,
    propertyState: SERVICE_STATE,
    location,
    propertyType: input.propertyType,
    occupancy: input.occupancy,
    estimatedValue: value.value,
    loanAmount: loan.value,
    timeline: input.timeline,
    notes,
    fullName,
    email,
    phone,
    contactMethod: input.contactMethod,
    message,
    consent: true,
  };
  return { errors, data };
}

"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleAlert,
  CircleCheck,
  ExternalLink,
  House,
  type LucideIcon,
  MessageCircleQuestion,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { FormStatus } from "@/components/forms/form-status";
import { Turnstile, type TurnstileHandle } from "@/components/contact/turnstile";
import { Button } from "@/components/ui/button";
import {
  CONTACT_METHODS,
  emptyInquiry,
  FLORIDA_ONLY_MESSAGE,
  GOALS,
  INQUIRY_HONEYPOT,
  LIMITS,
  OCCUPANCY,
  parseAmount,
  PROPERTY_TYPES,
  SERVICE_STATE,
  STATES,
  STEPS,
  TIMELINES,
  validateFields,
  validateInquiry,
  type InquiryErrors,
  type InquiryField,
  type InquiryValues,
} from "@/lib/inquiry/schema";
import { cn } from "@/lib/utils";

export const SUCCESS_MESSAGE =
  "Thank you for contacting Green Valor Lending. Your inquiry has been received. Our team will review your request and follow up using the contact information provided.";

const SUBMIT_TIMEOUT_MS = 20_000;
const goalIcons: Record<string, LucideIcon> = {
  purchase: House,
  refinance: RefreshCw,
  "non-qm": TrendingUp,
  investment: Building2,
  other: MessageCircleQuestion,
};

const control =
  "block w-full rounded-md border border-input bg-white px-4 text-base text-gv-charcoal shadow-[inset_0_1px_2px_rgb(32_40_36/0.05)] transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus-visible:border-gv-green focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring aria-invalid:border-destructive";

const id = (name: string) => `gs-${name}`;
const describedBy = (name: string, hint: boolean, error?: string) =>
  [hint && `${id(name)}-hint`, error && `${id(name)}-error`].filter(Boolean).join(" ") || undefined;

function Field({
  name,
  label,
  optional,
  hint,
  error,
  children,
  className,
}: {
  name: InquiryField;
  label: string;
  optional?: boolean;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id(name)} className="block text-sm font-semibold text-gv-charcoal">
        {label}
        {optional ? (
          <span className="ml-1.5 font-normal text-muted-foreground">(optional)</span>
        ) : (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p id={`${id(name)}-hint`} className="type-legal text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id(name)}-error`} className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** "350000" -> "350,000" on blur; leaves anything unparseable as typed so validation can explain. */
function formatAmount(raw: string) {
  const n = parseAmount(raw);
  return n === null || Number.isNaN(n) ? raw : Math.round(n).toLocaleString("en-US");
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || null;

type Props = {
  /** Approved ARIVE borrower portal URL. When absent, no application button is shown. */
  applicationUrl?: string | null;
};

export function InquiryWizard({ applicationUrl }: Props) {
  const [step, setStep] = React.useState(0);
  const [values, setValues] = React.useState<InquiryValues>({
    ...emptyInquiry,
    propertyState: SERVICE_STATE,
  });
  const [honeypot, setHoneypot] = React.useState("");
  const [errors, setErrors] = React.useState<InquiryErrors>({});
  const [busy, setBusy] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<React.ReactNode>(null);
  const [accepted, setAccepted] = React.useState(false);
  const [token, setToken] = React.useState("");
  const [dirty, setDirty] = React.useState(false);
  const startedAt = React.useRef<number | null>(null);
  const inFlight = React.useRef(false);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const successRef = React.useRef<HTMLHeadingElement>(null);
  const turnstile = React.useRef<TurnstileHandle>(null);
  const moved = React.useRef(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Move focus to the new step's heading after Back/Next (not on first render).
  React.useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [step]);

  React.useEffect(() => {
    if (accepted) successRef.current?.focus();
  }, [accepted]);

  // Guard against losing entries by closing or reloading the tab mid-way.
  React.useEffect(() => {
    if (!dirty || accepted) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, accepted]);

  const set =
    <K extends keyof InquiryValues>(key: K) =>
    (value: InquiryValues[K]) => {
      setDirty(true);
      setValues((v) => ({ ...v, [key]: value }));
      setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
    };

  const current = STEPS[step]!;
  const last = step === STEPS.length - 1;
  const outOfState = values.propertyState !== "" && values.propertyState !== SERVICE_STATE;

  function go(to: number) {
    moved.current = true;
    setSubmitError(null);
    setStep(to);
    formRef.current?.scrollIntoView?.({ block: "start", behavior: "smooth" });
  }

  function next() {
    const stepErrors = validateFields(values, current.fields);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((e) => ({ ...e, ...stepErrors }));
      const first = current.fields.find((f) => stepErrors[f]);
      requestAnimationFrame(() =>
        document.getElementById(id(first === "goal" ? "goal-purchase" : first!))?.focus(),
      );
      return;
    }
    go(step + 1);
  }

  function back() {
    // Entries are kept; only this step's error messages are cleared.
    setErrors({});
    go(step - 1);
  }

  async function submit() {
    if (inFlight.current) return; // No duplicate submissions from double clicks or repeated Enter.
    setSubmitError(null);

    const check = validateInquiry(values);
    if (!check.ok) {
      setErrors(check.errors);
      const firstStep = STEPS.findIndex((s) => s.fields.some((f) => check.errors[f]));
      if (firstStep !== step) go(firstStep);
      return;
    }
    if (turnstileSiteKey && !token) {
      setSubmitError("Please complete the verification check above the Submit button.");
      return;
    }

    inFlight.current = true;
    setBusy(true);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          [INQUIRY_HONEYPOT]: honeypot,
          elapsedMs: startedAt.current ? Date.now() - startedAt.current : 0,
          turnstileToken: token || undefined,
        }),
        signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        errors?: InquiryErrors;
      };
      if (res.ok && body.ok === true) {
        setAccepted(true);
        return;
      }
      if (res.status === 400 && body.error === "validation" && body.errors) {
        setErrors(body.errors);
        const firstStep = STEPS.findIndex((s) => s.fields.some((f) => body.errors![f]));
        if (firstStep >= 0 && firstStep !== step) go(firstStep);
        return;
      }
      if (body.error === "spam_check") turnstile.current?.reset();
      setSubmitError(messageFor(res.status, body.error));
    } catch (err) {
      const timedOut =
        err instanceof DOMException && (err.name === "TimeoutError" || err.name === "AbortError");
      setSubmitError(
        timedOut
          ? "We couldn't confirm that your inquiry was received because the connection timed out. Please try again. If it already went through, we won't create a duplicate."
          : "We couldn't send your inquiry. Please check your connection and try again. Your entries are still here.",
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (last) void submit();
    else next();
  }

  if (accepted) {
    return (
      <div
        className="rounded-2xl border border-success/30 bg-card p-7 sm:p-10"
        role="status"
        data-testid="inquiry-success"
      >
        <CircleCheck className="size-10 text-success" aria-hidden="true" />
        <h2 ref={successRef} tabIndex={-1} className="mt-5 type-card-title outline-none">
          Inquiry received
        </h2>
        <p className="mt-3 type-body text-gv-charcoal">{SUCCESS_MESSAGE}</p>
        {applicationUrl && (
          <div className="mt-8 rounded-xl border border-border bg-surface-alt p-6" data-testid="arive-cta">
            <p className="font-serif text-xl font-semibold text-heading">
              Ready to Continue? Start Your Secure Mortgage Application.
            </p>
            <p className="mt-2 type-support text-muted-foreground">
              Applications and documents are handled through our secure borrower portal.
            </p>
            <a
              href={applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-md bg-gv-gold px-6 py-3 font-semibold text-gv-charcoal transition-colors hover:bg-gv-gold/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Start Your Secure Mortgage Application
              <ExternalLink className="size-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        )}
      </div>
    );
  }

  const v = values;
  const e = errors;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="gs-step-title"
      className="rounded-2xl border border-border bg-card p-5 min-[380px]:p-6 sm:p-10"
    >
      {/* Progress indicator */}
      <nav aria-label="Inquiry progress">
        <p className="type-eyebrow" data-testid="step-count">
          Step {step + 1} of {STEPS.length}
        </p>
        <ol className="mt-4 grid grid-cols-4 gap-2" data-testid="progress">
          {STEPS.map((s, i) => (
            <li key={s.id} aria-current={i === step ? "step" : undefined} className="min-w-0">
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-colors",
                  i < step ? "bg-gv-green" : i === step ? "bg-gv-gold" : "bg-border",
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "mt-2 hidden items-center gap-1.5 text-xs font-semibold sm:flex",
                  i === step ? "text-gv-charcoal" : "text-muted-foreground",
                )}
              >
                {i < step && <Check className="size-3.5 text-gv-green" aria-hidden="true" />}
                {s.title}
              </span>
              <span className="sr-only">
                {s.title}
                {i < step ? " (completed)" : i === step ? " (current step)" : ""}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <h2 id="gs-step-title" ref={headingRef} tabIndex={-1} className="mt-8 type-card-title outline-none">
        {
          [
            "What would you like to accomplish?",
            "Tell us about the property.",
            "General financing details.",
            "How can we reach you?",
          ][step]
        }
      </h2>

      {step === 0 && (
        <fieldset className="mt-6">
          <legend className="sr-only">What would you like to accomplish?</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {GOALS.map((g) => {
              const Icon = goalIcons[g.value]!;
              const checked = v.goal === g.value;
              return (
                <label
                  key={g.value}
                  className={cn(
                    "flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring sm:p-5",
                    checked ? "border-gv-green bg-gv-green/5" : "border-border bg-white hover:border-gv-gold",
                    g.value === "other" && "sm:col-span-2",
                  )}
                >
                  <input
                    type="radio"
                    id={id(`goal-${g.value}`)}
                    name="goal"
                    value={g.value}
                    checked={checked}
                    onChange={() => set("goal")(g.value)}
                    aria-describedby={e.goal ? "gs-goal-error" : undefined}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "inline-flex size-11 shrink-0 items-center justify-center rounded-full",
                      checked ? "bg-gv-green text-gv-gold" : "border border-gv-gold/60 text-gv-green",
                    )}
                    aria-hidden="true"
                  >
                    {checked ? <Check className="size-5" /> : <Icon className="size-5" strokeWidth={1.75} />}
                  </span>
                  <span>
                    <span className="block font-semibold text-gv-charcoal">{g.label}</span>
                    <span className="mt-1 block type-support text-muted-foreground">{g.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {e.goal && (
            <p id="gs-goal-error" role="alert" className="mt-3 text-sm font-medium text-destructive">
              {e.goal}
            </p>
          )}
        </fieldset>
      )}

      {step === 1 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Field name="propertyState" label="Property state" error={outOfState ? undefined : e.propertyState}>
            <select
              id={id("propertyState")}
              name="propertyState"
              value={v.propertyState}
              onChange={(ev) => set("propertyState")(ev.target.value)}
              aria-required="true"
              aria-invalid={e.propertyState || outOfState ? true : undefined}
              aria-describedby={
                outOfState ? "gs-florida-only" : describedBy("propertyState", false, e.propertyState)
              }
              className={cn(control, "h-12 pr-10")}
            >
              <option value="">Select a state</option>
              <option value="FL">Florida</option>
              <optgroup label="Other states (not currently served)">
                {STATES.filter(([c]) => c !== SERVICE_STATE).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </optgroup>
            </select>
          </Field>
          <Field
            name="location"
            label="General property location"
            hint="City, county, or area, e.g. Tampa or Orange County."
            error={e.location}
          >
            <input
              id={id("location")}
              name="location"
              autoComplete="address-level2"
              value={v.location}
              maxLength={LIMITS.location}
              onChange={(ev) => set("location")(ev.target.value)}
              aria-required="true"
              aria-invalid={e.location ? true : undefined}
              aria-describedby={describedBy("location", true, e.location)}
              className={cn(control, "h-12")}
            />
          </Field>
          {outOfState && (
            <div
              id="gs-florida-only"
              role="alert"
              className="flex gap-3 rounded-lg border border-gv-gold/50 bg-gv-gold/[0.07] p-4 sm:col-span-2"
              data-testid="florida-only"
            >
              <CircleAlert className="mt-0.5 size-5 shrink-0 text-gv-gold-deep" aria-hidden="true" />
              <p className="type-support text-gv-charcoal">
                {FLORIDA_ONLY_MESSAGE} If you also have a Florida property in mind, choose Florida to
                continue.
              </p>
            </div>
          )}
          <Field name="propertyType" label="Property type" error={e.propertyType}>
            <select
              id={id("propertyType")}
              name="propertyType"
              value={v.propertyType}
              onChange={(ev) => set("propertyType")(ev.target.value)}
              aria-required="true"
              aria-invalid={e.propertyType ? true : undefined}
              aria-describedby={describedBy("propertyType", false, e.propertyType)}
              className={cn(control, "h-12 pr-10")}
            >
              <option value="">Select one</option>
              {PROPERTY_TYPES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field name="occupancy" label="Intended occupancy" error={e.occupancy}>
            <select
              id={id("occupancy")}
              name="occupancy"
              value={v.occupancy}
              onChange={(ev) => set("occupancy")(ev.target.value)}
              aria-required="true"
              aria-invalid={e.occupancy ? true : undefined}
              aria-describedby={describedBy("occupancy", false, e.occupancy)}
              className={cn(control, "h-12 pr-10")}
            >
              <option value="">Select one</option>
              {OCCUPANCY.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            name="estimatedValue"
            label="Estimated purchase price or property value"
            optional
            hint="A rough estimate is fine."
            error={e.estimatedValue}
            className="sm:col-span-2"
          >
            <MoneyInput
              name="estimatedValue"
              value={v.estimatedValue}
              onChange={set("estimatedValue")}
              error={e.estimatedValue}
            />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Field
            name="loanAmount"
            label="Approximate financing amount"
            optional
            hint="How much you expect to borrow, if you know."
            error={e.loanAmount}
          >
            <MoneyInput
              name="loanAmount"
              value={v.loanAmount}
              onChange={set("loanAmount")}
              error={e.loanAmount}
            />
          </Field>
          <Field name="timeline" label="General timeline" error={e.timeline}>
            <select
              id={id("timeline")}
              name="timeline"
              value={v.timeline}
              onChange={(ev) => set("timeline")(ev.target.value)}
              aria-required="true"
              aria-invalid={e.timeline ? true : undefined}
              aria-describedby={describedBy("timeline", false, e.timeline)}
              className={cn(control, "h-12 pr-10")}
            >
              <option value="">Select one</option>
              {TIMELINES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            name="notes"
            label="Financing notes"
            optional
            hint={`Anything that would help us prepare, such as self-employment or a recent move. Please don't include account or Social Security numbers. ${v.notes.length} / ${LIMITS.notes.toLocaleString("en-US")}`}
            error={e.notes}
            className="sm:col-span-2"
          >
            <textarea
              id={id("notes")}
              name="notes"
              rows={4}
              value={v.notes}
              maxLength={LIMITS.notes}
              onChange={(ev) => set("notes")(ev.target.value)}
              aria-invalid={e.notes ? true : undefined}
              aria-describedby={describedBy("notes", true, e.notes)}
              className={cn(control, "py-3")}
            />
          </Field>
          <p className="flex gap-3 rounded-lg bg-surface-alt p-4 type-legal text-gv-charcoal sm:col-span-2">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gv-green" aria-hidden="true" />
            We never ask for your Social Security number, date of birth, bank account numbers, tax returns,
            paystubs, driver&apos;s license, or credit report on this form. When you are ready to apply, those
            are collected through our secure application portal.
          </p>
        </div>
      )}

      {step === 3 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Field name="fullName" label="Full name" error={e.fullName} className="sm:col-span-2">
            <input
              id={id("fullName")}
              name="fullName"
              autoComplete="name"
              value={v.fullName}
              maxLength={LIMITS.fullName}
              onChange={(ev) => set("fullName")(ev.target.value)}
              aria-required="true"
              aria-invalid={e.fullName ? true : undefined}
              aria-describedby={describedBy("fullName", false, e.fullName)}
              className={cn(control, "h-12")}
            />
          </Field>
          <Field name="email" label="Email address" error={e.email}>
            <input
              id={id("email")}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              value={v.email}
              maxLength={LIMITS.email}
              onChange={(ev) => set("email")(ev.target.value)}
              aria-required="true"
              aria-invalid={e.email ? true : undefined}
              aria-describedby={describedBy("email", false, e.email)}
              className={cn(control, "h-12")}
            />
          </Field>
          <Field name="phone" label="Phone number" error={e.phone}>
            <input
              id={id("phone")}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={v.phone}
              maxLength={LIMITS.phone}
              onChange={(ev) => set("phone")(ev.target.value)}
              aria-required="true"
              aria-invalid={e.phone ? true : undefined}
              aria-describedby={describedBy("phone", false, e.phone)}
              className={cn(control, "h-12")}
            />
          </Field>
          <fieldset
            className="sm:col-span-2"
            aria-describedby={e.contactMethod ? "gs-contactMethod-error" : undefined}
          >
            <legend className="text-sm font-semibold text-gv-charcoal">
              Preferred contact method
              <span className="ml-1 text-destructive" aria-hidden="true">
                *
              </span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {CONTACT_METHODS.map((o) => (
                <label
                  key={o.value}
                  className={cn(
                    "flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 text-base transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring",
                    v.contactMethod === o.value ? "border-gv-green bg-gv-green/5" : "border-input bg-white",
                  )}
                >
                  <input
                    type="radio"
                    id={id(`contactMethod-${o.value}`)}
                    name="contactMethod"
                    value={o.value}
                    checked={v.contactMethod === o.value}
                    onChange={() => set("contactMethod")(o.value)}
                    className="size-4 accent-gv-green"
                  />
                  {o.label}
                </label>
              ))}
            </div>
            {e.contactMethod && (
              <p id="gs-contactMethod-error" className="mt-2 text-sm font-medium text-destructive">
                {e.contactMethod}
              </p>
            )}
          </fieldset>
          <Field
            name="message"
            label="Message"
            optional
            hint={`${v.message.length} / ${LIMITS.message.toLocaleString("en-US")}`}
            error={e.message}
            className="sm:col-span-2"
          >
            <textarea
              id={id("message")}
              name="message"
              rows={3}
              value={v.message}
              maxLength={LIMITS.message}
              onChange={(ev) => set("message")(ev.target.value)}
              aria-invalid={e.message ? true : undefined}
              aria-describedby={describedBy("message", true, e.message)}
              className={cn(control, "py-3")}
            />
          </Field>

          {/* Honeypot: hidden from people and assistive technology. */}
          <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor={id(INQUIRY_HONEYPOT)}>Company name</label>
            <input
              id={id(INQUIRY_HONEYPOT)}
              name={INQUIRY_HONEYPOT}
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(ev) => setHoneypot(ev.target.value)}
            />
          </div>

          <div className="rounded-lg border border-border bg-surface-alt p-5 sm:col-span-2 sm:p-6">
            <label htmlFor={id("consent")} className="flex cursor-pointer items-start gap-3">
              <input
                id={id("consent")}
                name="consent"
                type="checkbox"
                checked={v.consent}
                onChange={(ev) => set("consent")(ev.target.checked)}
                aria-required="true"
                aria-invalid={e.consent ? true : undefined}
                aria-describedby={e.consent ? "gs-consent-error" : undefined}
                className="mt-1 size-5 shrink-0 accent-gv-green"
              />
              <span className="type-support text-gv-charcoal">
                I agree that Green Valor Lending may contact me by email or phone about this inquiry using the
                information I provided, and I have read the{" "}
                <Link href="/privacy" className="font-semibold text-gv-green underline underline-offset-2">
                  Privacy Policy
                </Link>
                . I understand this is a preliminary inquiry, not a loan application, and that it does not
                lock a rate or guarantee approval. Green Valor Lending is a mortgage broker; lending partners
                make all credit decisions.
                <span className="ml-1 text-destructive" aria-hidden="true">
                  *
                </span>
              </span>
            </label>
            {e.consent && (
              <p id="gs-consent-error" className="mt-2 pl-8 text-sm font-medium text-destructive">
                {e.consent}
              </p>
            )}
          </div>

          {turnstileSiteKey && (
            <div className="sm:col-span-2">
              <Turnstile ref={turnstile} siteKey={turnstileSiteKey} onToken={setToken} />
            </div>
          )}
        </div>
      )}

      <FormStatus className="mt-6" status={busy ? "submitting" : "idle"} message="Sending your inquiry…" />
      {submitError && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
          data-testid="inquiry-submit-error"
        >
          <CircleAlert className="mt-px size-4 shrink-0" aria-hidden="true" />
          <p>{submitError}</p>
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={back}
            disabled={busy}
            className="min-h-12"
          >
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>
        ) : (
          <span />
        )}
        {last ? (
          <Button type="submit" variant="accent" size="lg" disabled={busy} className="min-h-12">
            {busy ? "Sending…" : "Submit Inquiry"}
          </Button>
        ) : (
          <Button type="submit" variant="default" size="lg" className="min-h-12">
            Next
            <ArrowRight aria-hidden="true" />
          </Button>
        )}
      </div>
    </form>
  );
}

function MoneyInput({
  name,
  value,
  onChange,
  error,
}: {
  name: "estimatedValue" | "loanAmount";
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground"
        aria-hidden="true"
      >
        $
      </span>
      <input
        id={id(name)}
        name={name}
        inputMode="numeric"
        autoComplete="off"
        value={value}
        maxLength={16}
        onChange={(ev) => onChange(ev.target.value)}
        onBlur={(ev) => onChange(formatAmount(ev.target.value))}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, true, error)}
        className={cn(control, "h-12 pl-8")}
      />
    </div>
  );
}

function messageFor(status: number, error?: string): string {
  if (error === "spam_check")
    return "We couldn't verify this submission. Please wait a moment, then submit again.";
  if (status === 503)
    return "Online inquiries aren't available right now, so your inquiry was not sent. Please try again later or use our Contact page.";
  if (status === 429)
    return "Too many submissions from this connection. Please wait a few minutes and try again.";
  return "We couldn't send your inquiry because of a problem on our end. Your entries are still here, so please try again.";
}

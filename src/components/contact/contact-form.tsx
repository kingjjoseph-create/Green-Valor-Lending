"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CircleAlert, CircleCheck, Info } from "lucide-react";

import { company } from "@/config/company";
import { contactContent } from "@/content/contact";
import { FormStatus, type FormStatusState } from "@/components/forms/form-status";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  CAREER_REASON,
  CONTACT_FIELD_ORDER,
  CONTACT_HONEYPOT,
  CONTACT_LIMITS,
  CONTACT_REASONS,
  validateContact,
  type ContactErrors,
  type ContactField,
} from "@/lib/contact/schema";
import { cn } from "@/lib/utils";
import { Turnstile, type TurnstileHandle } from "./turnstile";

type Values = {
  fullName: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
  consent: boolean;
  [CONTACT_HONEYPOT]: string;
};

const empty: Values = {
  fullName: "",
  email: "",
  phone: "",
  reason: "",
  message: "",
  consent: false,
  [CONTACT_HONEYPOT]: "",
};

const control =
  "block w-full rounded-md border border-input bg-white px-4 text-base text-gv-charcoal shadow-[inset_0_1px_2px_rgb(32_40_36/0.05)] transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus-visible:border-gv-green focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring aria-invalid:border-destructive";

const id = (name: string) => `cf-${name}`;
const describedBy = (name: string, hint: boolean, error?: string) =>
  [hint && `${id(name)}-hint`, error && `${id(name)}-error`].filter(Boolean).join(" ") || undefined;

function Field({
  name,
  label,
  hint,
  error,
  children,
  className,
}: {
  name: ContactField;
  label: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id(name)} className="block text-sm font-semibold text-gv-charcoal">
        {label}
        <span className="ml-1 text-destructive" aria-hidden="true">
          *
        </span>
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

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || null;

export function ContactForm() {
  const [values, setValues] = React.useState<Values>(empty);
  const [errors, setErrors] = React.useState<ContactErrors>({});
  const [status, setStatus] = React.useState<FormStatusState>("idle");
  const [submitError, setSubmitError] = React.useState<React.ReactNode>(null);
  const [sentTo, setSentTo] = React.useState<string | null>(null);
  const [token, setToken] = React.useState("");
  const startedAt = React.useRef<number | null>(null);
  const inFlight = React.useRef(false);
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const successRef = React.useRef<HTMLHeadingElement>(null);
  const turnstile = React.useRef<TurnstileHandle>(null);

  React.useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  React.useEffect(() => {
    if (sentTo !== null) successRef.current?.focus();
  }, [sentTo]);

  const set =
    <K extends keyof Values>(key: K) =>
    (value: Values[K]) => {
      setValues((v) => ({ ...v, [key]: value }));
      if (errors[key as ContactField]) setErrors((e) => ({ ...e, [key]: undefined }));
    };

  const isCareer = values.reason === CAREER_REASON;
  const errorList = CONTACT_FIELD_ORDER.filter((f) => errors[f] && !(isCareer && f === "reason"));
  const busy = status === "submitting";

  function showErrors(next: ContactErrors) {
    setErrors(next);
    setStatus("idle");
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Guard against double clicks / repeated Enter while a request is in flight.
    if (inFlight.current || isCareer) return;
    setSubmitError(null);

    const check = validateContact(values);
    if (!check.ok) return showErrors(check.errors);
    if (turnstileSiteKey && !token) {
      setStatus("error");
      setSubmitError("Please complete the verification check above the Send button.");
      return;
    }

    inFlight.current = true;
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          elapsedMs: startedAt.current ? Date.now() - startedAt.current : 0,
          turnstileToken: token || undefined,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        errors?: ContactErrors;
      };

      if (res.ok && body.ok === true) {
        setStatus("success");
        setSentTo(check.data.email);
        return;
      }
      if (res.status === 400 && body.error === "validation" && body.errors) return showErrors(body.errors);
      setStatus("error");
      setSubmitError(messageFor(res.status, body.error));
      if (body.error === "spam_check") turnstile.current?.reset();
    } catch {
      setStatus("error");
      setSubmitError(messageFor(0));
    } finally {
      inFlight.current = false;
    }
  }

  if (sentTo !== null) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-success/30 bg-card p-8 sm:p-10"
        data-testid="contact-success"
      >
        <CircleCheck className="size-10 text-success" aria-hidden="true" />
        <h3 ref={successRef} tabIndex={-1} className="mt-5 type-card-title outline-none">
          Thank you. Your message was sent.
        </h3>
        <p className="mt-3 type-body text-muted-foreground">
          We received your message and will follow up using the contact details you provided ({sentTo}).
          Sending a message does not start a loan application.
        </p>
      </div>
    );
  }

  const v = values;
  const e = errors;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="contact-form-title"
      className="rounded-2xl border border-border bg-card p-5 min-[380px]:p-6 sm:p-10"
    >
      <p className="type-support text-muted-foreground">
        All fields marked <span className="text-destructive">*</span> are required.
      </p>

      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 p-4 outline-none"
          data-testid="contact-error-summary"
        >
          <p className="text-sm font-semibold text-destructive">
            Please correct {errorList.length === 1 ? "1 field" : `${errorList.length} fields`}:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-destructive">
            {errorList.map((f) => (
              <li key={f}>
                <a href={`#${id(f)}`} className="underline underline-offset-2">
                  {e[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className="mt-6 grid gap-6 sm:grid-cols-2" disabled={busy}>
        <legend className="sr-only">Your contact details</legend>
        <Field name="fullName" label="Full name" error={e.fullName} className="sm:col-span-2">
          <input
            id={id("fullName")}
            name="fullName"
            autoComplete="name"
            value={v.fullName}
            maxLength={CONTACT_LIMITS.fullName}
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
            maxLength={CONTACT_LIMITS.email}
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
            maxLength={CONTACT_LIMITS.phone}
            onChange={(ev) => set("phone")(ev.target.value)}
            aria-required="true"
            aria-invalid={e.phone ? true : undefined}
            aria-describedby={describedBy("phone", false, e.phone)}
            className={cn(control, "h-12")}
          />
        </Field>
        <Field
          name="reason"
          label="Reason for contact"
          error={isCareer ? undefined : e.reason}
          className="sm:col-span-2"
        >
          <select
            id={id("reason")}
            name="reason"
            value={v.reason}
            onChange={(ev) => set("reason")(ev.target.value)}
            aria-required="true"
            aria-invalid={e.reason && !isCareer ? true : undefined}
            aria-describedby={isCareer ? "cf-career-notice" : describedBy("reason", false, e.reason)}
            className={cn(control, "h-12 pr-10")}
          >
            <option value="">Select one</option>
            {CONTACT_REASONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </fieldset>

      {isCareer ? (
        <div
          id="cf-career-notice"
          className="mt-8 rounded-lg border border-gv-gold/40 bg-gv-gold/[0.06] p-5 sm:p-6"
          data-testid="contact-career-notice"
          aria-live="polite"
        >
          <p className="flex gap-3 font-semibold text-gv-charcoal">
            <Info className="mt-0.5 size-5 shrink-0 text-gv-green" aria-hidden="true" />
            {contactContent.form.careerNotice.title}
          </p>
          <p className="mt-2 type-support text-muted-foreground sm:pl-8">
            {contactContent.form.careerNotice.description}
          </p>
          <Link
            href={contactContent.form.careerNotice.cta.href}
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "mt-5 h-auto min-h-12 max-w-full py-3 whitespace-normal sm:ml-8",
            )}
          >
            {contactContent.form.careerNotice.cta.label}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <>
          <fieldset className="mt-6" disabled={busy}>
            <legend className="sr-only">Your message</legend>
            <Field
              name="message"
              label="Message"
              hint={
                <>
                  {v.message.length.toLocaleString("en-US")} /{" "}
                  {CONTACT_LIMITS.messageMax.toLocaleString("en-US")} characters
                </>
              }
              error={e.message}
            >
              <textarea
                id={id("message")}
                name="message"
                rows={6}
                value={v.message}
                maxLength={CONTACT_LIMITS.messageMax}
                onChange={(ev) => set("message")(ev.target.value)}
                aria-required="true"
                aria-invalid={e.message ? true : undefined}
                aria-describedby={describedBy("message", true, e.message)}
                className={cn(control, "py-3")}
              />
            </Field>
          </fieldset>

          {/* Honeypot: hidden from people and assistive technology. */}
          <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor={id(CONTACT_HONEYPOT)}>Website</label>
            <input
              id={id(CONTACT_HONEYPOT)}
              name={CONTACT_HONEYPOT}
              tabIndex={-1}
              autoComplete="off"
              value={v[CONTACT_HONEYPOT]}
              onChange={(ev) => set(CONTACT_HONEYPOT)(ev.target.value)}
            />
          </div>

          <div className="mt-8 rounded-lg border border-border bg-surface-alt p-5 sm:p-6">
            <label htmlFor={id("consent")} className="flex cursor-pointer items-start gap-3">
              <input
                id={id("consent")}
                name="consent"
                type="checkbox"
                checked={v.consent}
                onChange={(ev) => set("consent")(ev.target.checked)}
                aria-required="true"
                aria-invalid={e.consent ? true : undefined}
                aria-describedby={e.consent ? `${id("consent")}-error` : undefined}
                disabled={busy}
                className="mt-1 size-5 shrink-0 accent-gv-green"
              />
              <span className="type-support text-gv-charcoal">
                I agree that Green Valor Lending may contact me by email or phone about this inquiry using the
                information I provided, and I have read the{" "}
                <Link href="/privacy" className="font-semibold text-gv-green underline underline-offset-2">
                  Privacy Policy
                </Link>
                . I understand this message is not a loan application and does not lock a rate or guarantee
                approval.
                <span className="ml-1 text-destructive" aria-hidden="true">
                  *
                </span>
              </span>
            </label>
            {e.consent && (
              <p id={`${id("consent")}-error`} className="mt-2 pl-8 text-sm font-medium text-destructive">
                {e.consent}
              </p>
            )}
          </div>

          {turnstileSiteKey && (
            <div className="mt-6">
              <Turnstile ref={turnstile} siteKey={turnstileSiteKey} onToken={setToken} />
            </div>
          )}

          <FormStatus className="mt-6" status={busy ? "submitting" : "idle"} />
          {submitError && (
            <div
              role="alert"
              className="mt-3 flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
              data-testid="contact-submit-error"
            >
              <CircleAlert className="mt-px size-4 shrink-0" aria-hidden="true" />
              <p>{submitError}</p>
            </div>
          )}

          <Button type="submit" variant="accent" size="lg" className="mt-6 w-full sm:w-auto" disabled={busy}>
            {busy ? "Sending…" : "Send Message"}
          </Button>
        </>
      )}
    </form>
  );
}

function messageFor(status: number, error?: string): React.ReactNode {
  const fallback = company.email ? (
    <>
      {" "}
      You can also email{" "}
      <a href={`mailto:${company.email}`} className="underline underline-offset-2">
        {company.email}
      </a>
      .
    </>
  ) : null;
  if (error === "spam_check")
    return <>We couldn&apos;t verify this submission. Please wait a moment, then try sending again.</>;
  if (error === "use_careers")
    return (
      <>
        Career inquiries use the{" "}
        <Link href="/careers#apply" className="underline underline-offset-2">
          recruitment form on our Careers page
        </Link>
        .
      </>
    );
  if (status === 503)
    return <>Online messages aren&apos;t available right now, so your message was not sent.{fallback}</>;
  if (status === 429)
    return <>Too many messages from this connection. Please wait a few minutes and try again.</>;
  return (
    <>We couldn&apos;t send your message. Your information is still here, so please try again.{fallback}</>
  );
}

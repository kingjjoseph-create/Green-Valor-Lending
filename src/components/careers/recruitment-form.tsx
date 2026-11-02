"use client";

import * as React from "react";
import Link from "next/link";
import { CircleAlert, CircleCheck } from "lucide-react";

import { company } from "@/config/company";
import { FormStatus, type FormStatusState } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import {
  CONTACT_METHODS,
  EXPERIENCE_OPTIONS,
  FIELD_ORDER,
  HONEYPOT_FIELD,
  isPathway,
  LICENSING_OPTIONS,
  LIMITS,
  PATHWAYS,
  validateRecruitment,
  type Pathway,
  type RecruitmentErrors,
  type RecruitmentField,
} from "@/lib/recruitment/schema";
import { cn } from "@/lib/utils";

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  profession: string;
  experience: string;
  licensingStatus: string;
  nmlsId: string;
  pathway: string;
  why: string;
  contactMethod: string;
  consent: boolean;
  [HONEYPOT_FIELD]: string;
};

const empty: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  profession: "",
  experience: "",
  licensingStatus: "",
  nmlsId: "",
  pathway: "",
  why: "",
  contactMethod: "",
  consent: false,
  [HONEYPOT_FIELD]: "",
};

const control =
  "block w-full rounded-md border border-input bg-white px-4 text-base text-gv-charcoal shadow-[inset_0_1px_2px_rgb(32_40_36/0.05)] transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus-visible:border-gv-green focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring aria-invalid:border-destructive";

const id = (name: string) => `rf-${name}`;

function Field({
  name,
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  name: RecruitmentField;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id(name)} className="block text-sm font-semibold text-gv-charcoal">
        {label}
        {required ? (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 font-normal text-muted-foreground">(optional)</span>
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

function describedBy(name: string, hint: boolean, error?: string) {
  return [hint && `${id(name)}-hint`, error && `${id(name)}-error`].filter(Boolean).join(" ") || undefined;
}

type SubmitError = { message: React.ReactNode };

export function RecruitmentForm({ requestedPathway }: { requestedPathway?: string | null }) {
  const [values, setValues] = React.useState<FormValues>(empty);
  const [errors, setErrors] = React.useState<RecruitmentErrors>({});
  const [status, setStatus] = React.useState<FormStatusState>("idle");
  const [submitError, setSubmitError] = React.useState<SubmitError | null>(null);
  const [submittedName, setSubmittedName] = React.useState<string | null>(null);
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const successRef = React.useRef<HTMLHeadingElement>(null);

  // A pathway CTA elsewhere on the page (?pathway=...) preselects the category.
  // Adjusted during render when the requested pathway changes (no effect needed).
  const [appliedPathway, setAppliedPathway] = React.useState<string | null | undefined>(undefined);
  if (requestedPathway !== appliedPathway) {
    setAppliedPathway(requestedPathway);
    if (isPathway(requestedPathway)) {
      setValues((v) => ({ ...v, pathway: requestedPathway }));
      setErrors((e) => ({ ...e, pathway: undefined }));
    }
  }

  React.useEffect(() => {
    if (submittedName !== null) successRef.current?.focus();
  }, [submittedName]);

  const set =
    <K extends keyof FormValues>(key: K) =>
    (value: FormValues[K]) => {
      setValues((v) => ({ ...v, [key]: value }));
      if (errors[key as RecruitmentField]) setErrors((e) => ({ ...e, [key]: undefined }));
    };

  const errorList = FIELD_ORDER.filter((f) => errors[f]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setSubmitError(null);

    const check = validateRecruitment(values);
    if (!check.ok) {
      setErrors(check.errors);
      setStatus("idle");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/recruitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        errors?: RecruitmentErrors;
        error?: string;
      };

      if (res.ok && body.ok === true) {
        setStatus("success");
        setSubmittedName(check.data.fullName.split(" ")[0] ?? check.data.fullName);
        return;
      }
      if (res.status === 400 && body.errors) {
        setErrors(body.errors);
        setStatus("idle");
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      setStatus("error");
      setSubmitError({ message: messageFor(res.status) });
    } catch {
      setStatus("error");
      setSubmitError({ message: messageFor(0) });
    }
  }

  if (submittedName !== null) {
    return (
      <div
        className="rounded-2xl border border-success/30 bg-card p-8 sm:p-10"
        data-testid="recruitment-success"
      >
        <CircleCheck className="size-10 text-success" aria-hidden="true" />
        <h3 ref={successRef} tabIndex={-1} className="mt-5 type-card-title outline-none">
          Thank you, {submittedName}. We received your inquiry.
        </h3>
        <p className="mt-3 type-body text-muted-foreground">
          A member of our team will review your information and reach out using your preferred contact method.
          Submitting an inquiry does not guarantee an interview or employment.
        </p>
      </div>
    );
  }

  const v = values;
  const e = errors;
  const busy = status === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="careers-apply"
      className="rounded-2xl border border-border bg-card p-5 min-[380px]:p-6 sm:p-10"
    >
      <p className="type-support text-muted-foreground">
        Fields marked <span className="text-destructive">*</span> are required. This form is for career
        inquiries only. It is not a mortgage application.
      </p>

      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 p-4 outline-none"
          data-testid="recruitment-error-summary"
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

      <fieldset className="mt-8" disabled={busy}>
        <legend className="type-eyebrow">About you</legend>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <Field name="fullName" label="Full name" required error={e.fullName} className="sm:col-span-2">
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
          <Field name="email" label="Email" required error={e.email}>
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
          <Field name="phone" label="Phone" required error={e.phone}>
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
          <Field
            name="location"
            label="Florida location or intended work location"
            required
            hint="City or county, e.g. Tampa or Orange County."
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
          <Field name="profession" label="Current profession" required error={e.profession}>
            <input
              id={id("profession")}
              name="profession"
              autoComplete="organization-title"
              value={v.profession}
              maxLength={LIMITS.profession}
              onChange={(ev) => set("profession")(ev.target.value)}
              aria-required="true"
              aria-invalid={e.profession ? true : undefined}
              aria-describedby={describedBy("profession", false, e.profession)}
              className={cn(control, "h-12")}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-10" disabled={busy}>
        <legend className="type-eyebrow">Experience and licensing</legend>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <Field name="experience" label="Mortgage industry experience" required error={e.experience}>
            <select
              id={id("experience")}
              name="experience"
              value={v.experience}
              onChange={(ev) => set("experience")(ev.target.value)}
              aria-required="true"
              aria-invalid={e.experience ? true : undefined}
              aria-describedby={describedBy("experience", false, e.experience)}
              className={cn(control, "h-12 pr-10")}
            >
              <option value="">Select one</option>
              {EXPERIENCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            name="licensingStatus"
            label="Current MLO licensing status"
            required
            error={e.licensingStatus}
          >
            <select
              id={id("licensingStatus")}
              name="licensingStatus"
              value={v.licensingStatus}
              onChange={(ev) => set("licensingStatus")(ev.target.value)}
              aria-required="true"
              aria-invalid={e.licensingStatus ? true : undefined}
              aria-describedby={describedBy("licensingStatus", false, e.licensingStatus)}
              className={cn(control, "h-12 pr-10")}
            >
              <option value="">Select one</option>
              {LICENSING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field name="nmlsId" label="NMLS ID" hint="Only if you have one." error={e.nmlsId}>
            <input
              id={id("nmlsId")}
              name="nmlsId"
              inputMode="numeric"
              autoComplete="off"
              value={v.nmlsId}
              maxLength={LIMITS.nmlsId + 1}
              onChange={(ev) => set("nmlsId")(ev.target.value)}
              aria-invalid={e.nmlsId ? true : undefined}
              aria-describedby={describedBy("nmlsId", true, e.nmlsId)}
              className={cn(control, "h-12")}
            />
          </Field>
          <Field name="pathway" label="Career pathway" required error={e.pathway}>
            <select
              id={id("pathway")}
              name="pathway"
              value={v.pathway}
              onChange={(ev) => set("pathway")(ev.target.value as Pathway | "")}
              aria-required="true"
              aria-invalid={e.pathway ? true : undefined}
              aria-describedby={describedBy("pathway", false, e.pathway)}
              className={cn(control, "h-12 pr-10")}
            >
              <option value="">Select one</option>
              {PATHWAYS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-10" disabled={busy}>
        <legend className="type-eyebrow">Your interest</legend>
        <div className="mt-5 space-y-6">
          <Field
            name="why"
            label="Why Green Valor Lending?"
            required
            hint={`A few sentences about your goals (${LIMITS.whyMin} to ${LIMITS.whyMax} characters).`}
            error={e.why}
          >
            <textarea
              id={id("why")}
              name="why"
              rows={5}
              value={v.why}
              maxLength={LIMITS.whyMax}
              onChange={(ev) => set("why")(ev.target.value)}
              aria-required="true"
              aria-invalid={e.why ? true : undefined}
              aria-describedby={describedBy("why", true, e.why)}
              className={cn(control, "py-3")}
            />
          </Field>

          <div
            role="radiogroup"
            aria-labelledby="rf-contactMethod-label"
            aria-required="true"
            aria-invalid={e.contactMethod ? true : undefined}
            aria-describedby={e.contactMethod ? "rf-contactMethod-error" : undefined}
            id={id("contactMethod")}
            tabIndex={-1}
            className="outline-none"
          >
            <p id="rf-contactMethod-label" className="text-sm font-semibold text-gv-charcoal">
              Preferred contact method
              <span className="ml-1 text-destructive" aria-hidden="true">
                *
              </span>
            </p>
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
              <p id="rf-contactMethod-error" className="mt-2 text-sm font-medium text-destructive">
                {e.contactMethod}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Honeypot: hidden from people and assistive technology. */}
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={id(HONEYPOT_FIELD)}>Company website</label>
        <input
          id={id(HONEYPOT_FIELD)}
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          value={v[HONEYPOT_FIELD]}
          onChange={(ev) => set(HONEYPOT_FIELD)(ev.target.value)}
        />
      </div>

      <div className="mt-10 rounded-lg border border-border bg-surface-alt p-5 sm:p-6">
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
            I agree that Green Valor Lending may contact me about career opportunities using the information I
            provided, and I have read the{" "}
            <Link href="/privacy" className="font-semibold text-gv-green underline underline-offset-2">
              Privacy Policy
            </Link>
            . I understand this is a career inquiry, not a mortgage application, and that submitting it does
            not guarantee an interview, employment, licensing sponsorship, or training.
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

      {/* Progress is announced politely; failures are announced by the alert below. */}
      <FormStatus className="mt-6" status={status === "submitting" ? "submitting" : "idle"} />
      {submitError && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
          data-testid="recruitment-submit-error"
        >
          <CircleAlert className="mt-px size-4 shrink-0" aria-hidden="true" />
          <p>{submitError.message}</p>
        </div>
      )}

      <Button type="submit" variant="accent" size="lg" className="mt-6 w-full sm:w-auto" disabled={busy}>
        {busy ? "Sending…" : "Submit Inquiry"}
      </Button>
      <p className="mt-4 type-legal text-muted-foreground">
        Please don&apos;t include Social Security numbers, financial account details, or other sensitive
        personal information. Resumes can be shared later in the conversation.
      </p>
    </form>
  );
}

function messageFor(status: number): React.ReactNode {
  const fallback = company.recruitingEmail ? (
    <>
      {" "}
      You can also email{" "}
      <a href={`mailto:${company.recruitingEmail}`} className="underline underline-offset-2">
        {company.recruitingEmail}
      </a>
      .
    </>
  ) : null;
  if (status === 503)
    return (
      <>Online career inquiries aren&apos;t available right now, so your inquiry was not sent.{fallback}</>
    );
  if (status === 429)
    return <>Too many submissions from this connection. Please wait a few minutes and try again.</>;
  return (
    <>We couldn&apos;t send your inquiry. Your information is still here, so please try again.{fallback}</>
  );
}

import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type FormStatusState = "idle" | "submitting" | "success" | "error";

type FormStatusProps = {
  status: FormStatusState;
  message?: string;
  className?: string;
};

const defaults: Record<Exclude<FormStatusState, "idle">, string> = {
  submitting: "Sending…",
  success: "Thank you. Your message has been received.",
  error: "Something went wrong. Please try again.",
};

/**
 * Announces form progress and results to assistive tech. The live region is
 * always mounted so screen readers pick up changes.
 */
export function FormStatus({ status, message, className }: FormStatusProps) {
  const isError = status === "error";
  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={className}
    >
      {status !== "idle" && (
        <p
          className={cn(
            "flex items-start gap-3 rounded-md border px-4 py-3 text-sm font-medium",
            status === "success" && "border-success/30 bg-success/5 text-success",
            status === "error" && "border-destructive/30 bg-destructive/5 text-destructive",
            status === "submitting" && "border-border bg-surface-alt text-gv-charcoal",
          )}
        >
          {status === "success" && <CircleCheck className="mt-px size-4 shrink-0" aria-hidden="true" />}
          {status === "error" && <CircleAlert className="mt-px size-4 shrink-0" aria-hidden="true" />}
          {status === "submitting" && (
            <LoaderCircle className="mt-px size-4 shrink-0 animate-spin" aria-hidden="true" />
          )}
          {message ?? defaults[status]}
        </p>
      )}
    </div>
  );
}

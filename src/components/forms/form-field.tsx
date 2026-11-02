import * as React from "react";

import { cn } from "@/lib/utils";

type BaseProps = {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

type InputProps = BaseProps & { as?: "input" } & Omit<React.ComponentProps<"input">, "name" | "required">;
type TextareaProps = BaseProps & { as: "textarea" } & Omit<
    React.ComponentProps<"textarea">,
    "name" | "required"
  >;
type SelectProps = BaseProps & {
  as: "select";
  options: { value: string; label: string }[];
  placeholder?: string;
} & Omit<React.ComponentProps<"select">, "name" | "required">;

export type FormFieldProps = InputProps | TextareaProps | SelectProps;

const controlClass =
  "block w-full rounded-md border border-input bg-white px-4 text-base text-gv-charcoal shadow-[inset_0_1px_2px_rgb(32_40_36/0.05)] transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus-visible:border-gv-green focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Labeled form control with hint and error text wired up through
 * aria-describedby / aria-invalid. Works in Server and Client Components.
 */
export function FormField(props: FormFieldProps) {
  const { label, name, hint, error, required, className } = props;
  const id = `field-${name}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const shared = {
    id,
    name,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  } as const;

  let control: React.ReactNode;
  if (props.as === "textarea") {
    const { as, label, hint, error, className, required, name, ...rest } = props;
    control = <textarea {...rest} {...shared} rows={rest.rows ?? 5} className={cn(controlClass, "py-3")} />;
  } else if (props.as === "select") {
    const { as, label, hint, error, className, required, name, options, placeholder, ...rest } = props;
    control = (
      <select
        {...rest}
        {...shared}
        defaultValue={rest.defaultValue ?? ""}
        className={cn(controlClass, "h-12 pr-10")}
      >
        <option value="" disabled>
          {placeholder ?? "Select an option"}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else {
    const { as, label, hint, error, className, required, name, ...rest } = props;
    control = <input type="text" {...rest} {...shared} className={cn(controlClass, "h-12")} />;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-sm font-semibold text-gv-charcoal">
        {label}
        {required ? (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 font-normal text-muted-foreground">(optional)</span>
        )}
      </label>
      {control}
      {hint && (
        <p id={hintId} className="type-support text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

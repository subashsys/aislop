import type { InputHTMLAttributes, ReactNode } from "react";

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Inline validation message shown below the control in red. */
  error?: string;
  type?: "text" | "password" | "date" | "tel";
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  autoFocus?: boolean;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  required?: boolean;
  /** Renders a textarea instead of an input. */
  textarea?: boolean;
  rows?: number;
  /** Muted, right-aligned hint under the control (e.g. a character counter). */
  counter?: ReactNode;
  /** Element pinned inside the control (e.g. a password show/hide toggle). */
  endAdornment?: ReactNode;
  /** Element placed next to the control (e.g. a submit button). */
  action?: ReactNode;
}

/**
 * Shared form field: label + control + error (and optional counter,
 * in-control adornment or trailing action).
 */
export default function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  autoFocus,
  placeholder,
  autoComplete,
  maxLength,
  required,
  textarea = false,
  rows,
  counter,
  endAdornment,
  action,
}: FieldProps) {
  const errorId = `${id}-error`;
  const counterId = `${id}-counter`;
  const describedBy =
    [error ? errorId : null, counter ? counterId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const controlClasses = [
    "block w-full rounded-md border bg-surface px-3 text-sm text-ink transition-colors duration-150 placeholder:text-ink-muted",
    "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20",
    error ? "border-danger" : "border-line-strong",
    textarea ? "min-h-32 resize-y py-2.5 leading-6" : "h-11",
    endAdornment && !textarea ? "pr-11" : "",
  ].join(" ");

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-ink"
      >
        {label}
      </label>
      <div className="mt-1.5 flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          {textarea ? (
            <textarea
              id={id}
              name={id}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={placeholder}
              maxLength={maxLength}
              required={required}
              rows={rows}
              aria-invalid={Boolean(error)}
              aria-describedby={describedBy}
              className={controlClasses}
            />
          ) : (
            <input
              id={id}
              name={id}
              type={type}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={placeholder}
              autoComplete={autoComplete}
              inputMode={inputMode}
              autoFocus={autoFocus}
              maxLength={maxLength}
              required={required}
              aria-invalid={Boolean(error)}
              aria-describedby={describedBy}
              className={controlClasses}
            />
          )}
          {endAdornment && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              {endAdornment}
            </div>
          )}
        </div>
        {action}
      </div>
      {(error || counter) && (
        <div className="mt-1.5 flex items-start justify-between gap-3">
          {error ? (
            <p id={errorId} role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : (
            <span aria-hidden="true" />
          )}
          {counter && (
            <span
              id={counterId}
              className="shrink-0 text-xs tabular-nums text-ink-muted"
            >
              {counter}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

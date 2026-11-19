"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, signIn } from "@/lib/storage";
import { focusRing, inputBase, primaryButton } from "@/lib/ui";

const MAX_LENGTH = 20;
const CREDENTIAL = "slop";

type FieldKey = "id" | "password" | "commonPassword";
type FieldValues = Record<FieldKey, string>;
type FieldErrors = Partial<Record<FieldKey, string>>;

interface LoginFieldProps {
  field: FieldKey;
  label: string;
  inputType: "text" | "password";
  autoComplete: string;
  value: string;
  error?: string;
  toggle?: { revealed: boolean; onToggle: () => void };
  onChange: (field: FieldKey, value: string) => void;
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M1 1l22 22" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  );
}

function LoginField({
  field,
  label,
  inputType,
  autoComplete,
  value,
  error,
  toggle,
  onChange,
}: LoginFieldProps) {
  const inputId = `login-${field}`;
  const errorId = `${inputId}-error`;
  const revealed = toggle?.revealed ?? false;
  const describedBy = error ? errorId : undefined;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={inputId}
          name={field}
          type={inputType === "password" && revealed ? "text" : inputType}
          value={value}
          onChange={(event) => onChange(field, event.target.value)}
          maxLength={MAX_LENGTH}
          autoComplete={autoComplete}
          aria-invalid={error !== undefined}
          aria-describedby={describedBy}
          className={`${inputBase} ${inputType === "password" ? "pr-12" : ""}`}
        />
        {toggle && (
          <button
            type="button"
            onClick={toggle.onToggle}
            aria-label={`${revealed ? "Hide" : "Show"} ${label}`}
            aria-pressed={revealed}
            className={`absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-zinc-500 transition hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 ${focusRing}`}
          >
            {revealed ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Demo login: ID, Password and Common Password must all equal "slop".
 * Validation happens client-side only; the session flag lives in localStorage.
 */
export default function LoginPage() {
  const router = useRouter();
  const [values, setValues] = useState<FieldValues>({
    id: "",
    password: "",
    commonPassword: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCommon, setShowCommon] = useState(false);

  // Already signed in? Head back to the home screen once hydration settles.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (isAuthenticated()) router.replace("/");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  const handleFieldChange = (field: FieldKey, value: string): void => {
    if (value.length > MAX_LENGTH) {
      // Belt and braces: the maxLength attribute already caps typing/pasting.
      setErrors((current) => ({
        ...current,
        [field]: `Must be ${MAX_LENGTH} characters or fewer.`,
      }));
      return;
    }

    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const id = values.id.trim();
    const password = values.password.trim();
    const commonPassword = values.commonPassword.trim();

    const nextErrors: FieldErrors = {};
    if (id.length === 0) nextErrors.id = "ID is required.";
    else if (values.id.length > MAX_LENGTH)
      nextErrors.id = `Must be ${MAX_LENGTH} characters or fewer.`;
    if (password.length === 0) nextErrors.password = "Password is required.";
    else if (values.password.length > MAX_LENGTH)
      nextErrors.password = `Must be ${MAX_LENGTH} characters or fewer.`;
    if (commonPassword.length === 0)
      nextErrors.commonPassword = "Common Password is required.";
    else if (values.commonPassword.length > MAX_LENGTH)
      nextErrors.commonPassword = `Must be ${MAX_LENGTH} characters or fewer.`;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      return;
    }

    if (
      id !== CREDENTIAL ||
      password !== CREDENTIAL ||
      commonPassword !== CREDENTIAL
    ) {
      setErrors({});
      setFormError(
        `ID, Password and Common Password must all be exactly "${CREDENTIAL}".`,
      );
      return;
    }

    setErrors({});
    setFormError(null);
    signIn();
    router.replace("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-sky-50 px-4 py-10 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-bold text-white shadow-md"
            >
              M
            </span>
            <h1 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Sign in to MineMemoSlop
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {formError && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
              >
                {formError}
              </p>
            )}

            <LoginField
              field="id"
              label="ID"
              inputType="text"
              autoComplete="username"
              value={values.id}
              error={errors.id}
              onChange={handleFieldChange}
            />

            <LoginField
              field="password"
              label="Password"
              inputType="password"
              autoComplete="current-password"
              value={values.password}
              error={errors.password}
              toggle={{
                revealed: showPassword,
                onToggle: () => setShowPassword((current) => !current),
              }}
              onChange={handleFieldChange}
            />

            <LoginField
              field="commonPassword"
              label="Common Password"
              inputType="password"
              autoComplete="current-password"
              value={values.commonPassword}
              error={errors.commonPassword}
              toggle={{
                revealed: showCommon,
                onToggle: () => setShowCommon((current) => !current),
              }}
              onChange={handleFieldChange}
            />

            <button type="submit" className={`${primaryButton} w-full`}>
              Sign in
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Demo access: all three fields must be slop.
          </p>
        </div>
      </div>
    </main>
  );
}

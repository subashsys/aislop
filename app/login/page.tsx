"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { isAuthenticated, signIn } from "@/lib/storage";
import { focusRing } from "@/lib/ui";

const MAX_LENGTH = 20;
const CREDENTIAL = "slop";

type FieldKey = "id" | "password" | "commonPassword";
type FieldValues = Record<FieldKey, string>;
type FieldErrors = Partial<Record<FieldKey, string>>;

interface PasswordToggleProps {
  label: string;
  revealed: boolean;
  onToggle: () => void;
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

function PasswordToggle({
  label,
  revealed,
  onToggle,
}: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`${revealed ? "Hide" : "Show"} ${label}`}
      aria-pressed={revealed}
      title={`${revealed ? "Hide" : "Show"} ${label}`}
      className={`flex h-11 w-11 items-center justify-center text-ink-muted transition-colors duration-150 hover:text-ink ${focusRing}`}
    >
      {revealed ? <EyeOffIcon /> : <EyeIcon />}
    </button>
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
    <main className="flex min-h-screen items-center justify-center bg-page px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-md border border-line bg-surface p-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-base font-semibold text-white"
            >
              M
            </span>
            <h1 className="text-2xl font-semibold text-ink">MineMemoSlop</h1>
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            Enter your credentials to continue.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            {formError && (
              <p
                role="alert"
                className="rounded-md border border-danger-border bg-danger-bg px-3.5 py-3 text-sm text-danger"
              >
                {formError}
              </p>
            )}

            <Field
              id="login-id"
              label="ID"
              type="text"
              autoComplete="username"
              value={values.id}
              onChange={(value) => handleFieldChange("id", value)}
              error={errors.id}
              maxLength={MAX_LENGTH}
            />

            <Field
              id="login-password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={values.password}
              onChange={(value) => handleFieldChange("password", value)}
              error={errors.password}
              maxLength={MAX_LENGTH}
              endAdornment={
                <PasswordToggle
                  label="Password"
                  revealed={showPassword}
                  onToggle={() => setShowPassword((current) => !current)}
                />
              }
            />

            <Field
              id="login-commonPassword"
              label="Common Password"
              type={showCommon ? "text" : "password"}
              autoComplete="current-password"
              value={values.commonPassword}
              onChange={(value) => handleFieldChange("commonPassword", value)}
              error={errors.commonPassword}
              maxLength={MAX_LENGTH}
              endAdornment={
                <PasswordToggle
                  label="Common Password"
                  revealed={showCommon}
                  onToggle={() => setShowCommon((current) => !current)}
                />
              }
            />

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-muted">
            Demo access: all three fields must be slop.
          </p>
        </div>
      </div>
    </main>
  );
}

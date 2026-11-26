"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { getProfile, saveProfile } from "@/lib/profile";

const PHONE_PATTERN = /^\+?[\d\s()-]+$/;
const SUCCESS_CLOSE_MS = 800;

interface ProfileErrors {
  name?: string;
  phone?: string;
}

interface ProfilePanelProps {
  onClose: () => void;
}

/**
 * Small profile dialog anchored under the navbar icon: name + phone number,
 * validated on submit and stored in localStorage. Closes on outside click,
 * Escape, or shortly after a successful save.
 */
export default function ProfilePanel({ onClose }: ProfilePanelProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saved, setSaved] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Prefill from storage after mount (never during render: hydration-safe).
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const profile = getProfile();
      if (profile !== null) {
        setName(profile.name);
        setPhone(profile.phone);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Outside click closes the panel (the navbar toggle is excluded so it can flip state).
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent): void => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-profile-toggle]")) return;
      if (panelRef.current !== null && !panelRef.current.contains(target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [onClose]);

  // Escape closes the panel.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Let the success message show briefly, then close.
  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => onClose(), SUCCESS_CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [saved, onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const nextErrors: ProfileErrors = {};

    if (trimmedName.length === 0) nextErrors.name = "Name is required.";
    else if (trimmedName.length < 2 || trimmedName.length > 60)
      nextErrors.name = "Name must be 2 to 60 characters.";

    if (trimmedPhone.length === 0)
      nextErrors.phone = "Phone number is required.";
    else if (!PHONE_PATTERN.test(trimmedPhone))
      nextErrors.phone =
        "Use digits, spaces, dashes, parentheses and an optional leading +.";
    else if (
      trimmedPhone.replace(/\D/g, "").length < 7 ||
      trimmedPhone.replace(/\D/g, "").length > 15
    )
      nextErrors.phone = "Phone number must contain 7 to 15 digits.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setName(trimmedName);
    setPhone(trimmedPhone);
    saveProfile({ name: trimmedName, phone: trimmedPhone });
    setSaved(true);
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Profile"
      className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-md border border-line bg-surface p-6"
    >
      <h2 className="text-base font-medium text-ink">Your profile</h2>
      <p className="mt-1 text-sm text-ink-secondary">
        Saved on this device only.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-5">
        <Field
          id="profile-name"
          label="Name"
          value={name}
          onChange={(value) => {
            setName(value);
            setErrors((current) => ({ ...current, name: undefined }));
          }}
          error={errors.name}
          autoComplete="name"
          maxLength={60}
          autoFocus
        />
        <Field
          id="profile-phone"
          label="Phone number"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(value) => {
            setPhone(value);
            setErrors((current) => ({ ...current, phone: undefined }));
          }}
          error={errors.phone}
          autoComplete="tel"
        />

        {saved && (
          <p
            role="status"
            className="rounded-md border border-success-border bg-success-bg px-3 py-2 text-sm text-success"
          >
            Profile saved
          </p>
        )}

        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </div>
  );
}

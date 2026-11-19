"use client";

import { useState, type FormEvent } from "react";
import {
  createId,
  PREACHING_TYPES,
  useTodayKey,
  type PreachingRecord,
  type PreachingType,
} from "@/lib/storage";
import { inputBase, primaryButton } from "@/lib/ui";

const MAX_NAME_LENGTH = 60;
const MAX_WAY_LENGTH = 500;

interface PreachingFormProps {
  /** Receives a validated, trimmed record ready to be persisted. */
  onSave: (record: PreachingRecord) => void;
}

interface FieldErrors {
  date?: string;
  type?: string;
  personName?: string;
  preachingWay?: string;
}

/**
 * Preaching record form: date, type, person name and preaching way, with
 * inline validation, a live character counter and a success message.
 */
export default function PreachingForm({ onSave }: PreachingFormProps) {
  const today = useTodayKey();
  const [chosenDate, setChosenDate] = useState<string | null>(null);
  const [type, setType] = useState<PreachingType | "">("");
  const [personName, setPersonName] = useState("");
  const [preachingWay, setPreachingWay] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // null means "not chosen yet", which falls back to today once the client
  // knows the local date (the server always renders an empty date field).
  const date = chosenDate ?? today;

  const wayLength = preachingWay.length;
  const counterClass =
    wayLength >= MAX_WAY_LENGTH
      ? "text-red-600 dark:text-red-400"
      : wayLength >= MAX_WAY_LENGTH - 50
        ? "text-amber-600 dark:text-amber-400"
        : "text-zinc-500 dark:text-zinc-400";

  const clearError = (field: keyof FieldErrors): void => {
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const trimmedName = personName.trim();
    const trimmedWay = preachingWay.trim();
    const nextErrors: FieldErrors = {};

    if (date.length === 0) {
      nextErrors.date = "Please choose a date.";
    }
    if (type === "") {
      nextErrors.type = "Please select a preaching type.";
    }
    if (trimmedName.length === 0) {
      nextErrors.personName = "Please enter a person name.";
    } else if (personName.length > MAX_NAME_LENGTH) {
      nextErrors.personName = `Person name must be ${MAX_NAME_LENGTH} characters or fewer.`;
    }
    if (trimmedWay.length === 0) {
      nextErrors.preachingWay = "Please enter the preaching way.";
    } else if (preachingWay.length > MAX_WAY_LENGTH) {
      nextErrors.preachingWay = `Preaching way must be ${MAX_WAY_LENGTH} characters or fewer.`;
    }

    setErrors(nextErrors);
    setSavedMessage(null);

    if (Object.keys(nextErrors).length > 0 || type === "") return;

    onSave({
      id: createId(),
      date,
      type,
      personName: trimmedName,
      preachingWay: trimmedWay,
    });

    setSavedMessage("Record saved successfully.");
    setChosenDate(null);
    setType("");
    setPersonName("");
    setPreachingWay("");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Preaching details
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          All fields are required.
        </p>
      </div>

      {savedMessage && (
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
        >
          {savedMessage}
        </p>
      )}

      {/* 1. Date */}
      <div>
        <label
          htmlFor="preaching-date"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Date
        </label>
        <input
          id="preaching-date"
          name="date"
          type="date"
          required
          value={date}
          onChange={(event) => {
            setChosenDate(event.target.value);
            clearError("date");
            setSavedMessage(null);
          }}
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? "preaching-date-error" : undefined}
          className={`mt-1.5 ${inputBase}`}
        />
        {errors.date && (
          <p
            id="preaching-date-error"
            role="alert"
            className="mt-1.5 text-xs text-red-600 dark:text-red-400"
          >
            {errors.date}
          </p>
        )}
      </div>

      {/* 2. Type */}
      <fieldset>
        <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Type
        </legend>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PREACHING_TYPES.map((option) => {
            const selected = type === option;
            const optionClasses = selected
              ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "border-zinc-300 bg-white text-zinc-700 hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-700";

            return (
              <label key={option} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={option}
                  checked={selected}
                  onChange={() => {
                    setType(option);
                    clearError("type");
                    setSavedMessage(null);
                  }}
                  className="peer sr-only"
                  aria-describedby={
                    errors.type ? "preaching-type-error" : undefined
                  }
                />
                <span
                  className={`flex min-h-12 items-center justify-center rounded-xl border px-4 py-3 text-center text-sm font-medium transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-600 ${optionClasses}`}
                >
                  {option}
                </span>
              </label>
            );
          })}
        </div>
        {errors.type && (
          <p
            id="preaching-type-error"
            role="alert"
            className="mt-1.5 text-xs text-red-600 dark:text-red-400"
          >
            {errors.type}
          </p>
        )}
      </fieldset>

      {/* 3. Person name */}
      <div>
        <label
          htmlFor="preaching-person"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Person Name
        </label>
        <input
          id="preaching-person"
          name="personName"
          type="text"
          required
          maxLength={MAX_NAME_LENGTH}
          value={personName}
          onChange={(event) => {
            setPersonName(event.target.value);
            clearError("personName");
            setSavedMessage(null);
          }}
          placeholder="e.g. John Smith"
          aria-invalid={Boolean(errors.personName)}
          aria-describedby={
            errors.personName ? "preaching-person-error" : undefined
          }
          className={`mt-1.5 ${inputBase}`}
        />
        {errors.personName && (
          <p
            id="preaching-person-error"
            role="alert"
            className="mt-1.5 text-xs text-red-600 dark:text-red-400"
          >
            {errors.personName}
          </p>
        )}
      </div>

      {/* 4. Preaching way */}
      <div>
        <label
          htmlFor="preaching-way"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Preaching Way
        </label>
        <textarea
          id="preaching-way"
          name="preachingWay"
          required
          rows={5}
          maxLength={MAX_WAY_LENGTH}
          value={preachingWay}
          onChange={(event) => {
            const value = event.target.value;
            if (value.length > MAX_WAY_LENGTH) {
              setErrors((current) => ({
                ...current,
                preachingWay: `Preaching way must be ${MAX_WAY_LENGTH} characters or fewer.`,
              }));
              return;
            }
            setPreachingWay(value);
            clearError("preachingWay");
            setSavedMessage(null);
          }}
          placeholder="How did the conversation go?"
          aria-invalid={Boolean(errors.preachingWay)}
          aria-describedby={
            errors.preachingWay
              ? "preaching-way-error"
              : "preaching-way-counter"
          }
          className={`mt-1.5 resize-y ${inputBase}`}
        />
        <div className="mt-1 flex items-start justify-between gap-3">
          {errors.preachingWay ? (
            <p
              id="preaching-way-error"
              role="alert"
              className="text-xs text-red-600 dark:text-red-400"
            >
              {errors.preachingWay}
            </p>
          ) : (
            <span aria-hidden="true" />
          )}
          <span
            id="preaching-way-counter"
            className={`shrink-0 text-xs tabular-nums ${counterClass}`}
          >
            {wayLength}/{MAX_WAY_LENGTH}
          </span>
        </div>
      </div>

      <button type="submit" className={`${primaryButton} w-full`}>
        Save
      </button>
    </form>
  );
}

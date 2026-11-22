"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import {
  createId,
  PREACHING_TYPES,
  useTodayKey,
  type PreachingRecord,
  type PreachingType,
} from "@/lib/storage";

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
        <h2 className="text-lg font-semibold text-ink">Preaching details</h2>
        <p className="mt-1 text-sm text-ink-muted">All fields are required.</p>
      </div>

      {savedMessage && (
        <p
          role="status"
          className="rounded-md border border-success-border bg-success-bg px-3.5 py-3 text-sm text-success"
        >
          {savedMessage}
        </p>
      )}

      {/* 1. Date */}
      <Field
        id="preaching-date"
        label="Date"
        type="date"
        value={date}
        onChange={(value) => {
          setChosenDate(value);
          clearError("date");
          setSavedMessage(null);
        }}
        error={errors.date}
        required
      />

      {/* 2. Type */}
      <fieldset>
        <legend className="text-sm font-medium text-ink">Type</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-3">
          {PREACHING_TYPES.map((option) => {
            const selected = type === option;
            const optionClasses = selected
              ? "border-accent bg-accent-soft text-accent"
              : "border-line-strong bg-surface text-ink hover:bg-subtle";

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
                  className={`flex min-h-11 items-center justify-center rounded-md border px-3 py-2.5 text-center text-sm font-medium transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${optionClasses}`}
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
            className="mt-1.5 text-sm text-danger"
          >
            {errors.type}
          </p>
        )}
      </fieldset>

      {/* 3. Person name */}
      <Field
        id="preaching-person"
        label="Person Name"
        value={personName}
        onChange={(value) => {
          setPersonName(value);
          clearError("personName");
          setSavedMessage(null);
        }}
        error={errors.personName}
        placeholder="e.g. John Smith"
        maxLength={MAX_NAME_LENGTH}
        required
      />

      {/* 4. Preaching way */}
      <Field
        id="preaching-way"
        label="Preaching Way"
        value={preachingWay}
        onChange={(value) => {
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
        error={errors.preachingWay}
        placeholder="How did the conversation go?"
        maxLength={MAX_WAY_LENGTH}
        required
        textarea
        rows={5}
        counter={`${wayLength}/${MAX_WAY_LENGTH}`}
      />

      <div className="flex justify-end">
        <Button type="submit" className="w-full sm:w-auto">
          Save
        </Button>
      </div>
    </form>
  );
}

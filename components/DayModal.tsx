"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { formatFullDate } from "@/lib/date";
import type { CalendarEvent, PreachingRecord } from "@/lib/storage";
import {
  cardSurface,
  dangerButton,
  focusRing,
  inputBase,
  primaryButton,
  secondaryButton,
} from "@/lib/ui";

const MAX_TITLE_LENGTH = 100;

interface DayModalProps {
  /** Local date key (YYYY-MM-DD) this dialog is about. */
  dateKey: string;
  events: CalendarEvent[];
  records: PreachingRecord[];
  onAddEvent: (title: string) => void;
  onDeleteEvent: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  onClose: () => void;
}

/**
 * Dialog for a single day: lists events and preaching records for that date
 * (each deletable), plus a form to add a new event.
 * Closes on Escape, backdrop click and the Close buttons.
 */
export default function DayModal({
  dateKey,
  events,
  records,
  onAddEvent,
  onDeleteEvent,
  onDeleteRecord,
  onClose,
}: DayModalProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed = title.trim();

    if (trimmed.length === 0) {
      setError("Please enter an event title.");
      return;
    }
    if (title.length > MAX_TITLE_LENGTH) {
      setError(`Event titles must be ${MAX_TITLE_LENGTH} characters or fewer.`);
      return;
    }

    onAddEvent(trimmed);
    setTitle("");
    setError(null);
  };

  const handleTitleChange = (value: string): void => {
    if (value.length > MAX_TITLE_LENGTH) {
      setError(`Event titles must be ${MAX_TITLE_LENGTH} characters or fewer.`);
      return;
    }
    setTitle(value);
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/50 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-dialog-title"
        tabIndex={-1}
        className={`max-h-[85vh] w-full max-w-lg overflow-y-auto p-5 outline-none sm:p-6 ${cardSurface}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              Day details
            </p>
            <h2
              id="day-dialog-title"
              className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50 sm:text-xl"
            >
              {formatFullDate(dateKey)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 ${focusRing}`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <section className="mt-5" aria-labelledby="day-events-heading">
          <h3
            id="day-events-heading"
            className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
          >
            Events
          </h3>
          {events.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              No events on this day yet.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {events.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/60"
                >
                  <span className="min-w-0 break-words text-sm text-zinc-800 dark:text-zinc-100">
                    {item.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteEvent(item.id)}
                    className={dangerButton}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-5" aria-labelledby="day-records-heading">
          <h3
            id="day-records-heading"
            className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
          >
            Preaching records
          </h3>
          {records.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              No preaching records on this day.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {records.map((record) => (
                <li
                  key={record.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-800/60"
                >
                  <div className="min-w-0">
                    <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {record.type}
                    </span>
                    <p className="mt-1 break-words text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {record.personName}
                    </p>
                    <p className="mt-0.5 line-clamp-2 break-words text-xs text-zinc-500 dark:text-zinc-400">
                      {record.preachingWay}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteRecord(record.id)}
                    className={dangerButton}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <form onSubmit={handleSubmit} noValidate className="mt-6">
          <label
            htmlFor="day-event-title"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            New event
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="day-event-title"
              name="title"
              type="text"
              required
              maxLength={MAX_TITLE_LENGTH}
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="e.g. Evening service"
              aria-invalid={error !== null}
              aria-describedby={error ? "day-event-title-error" : undefined}
              className={inputBase}
            />
            <button type="submit" className={`${primaryButton} shrink-0`}>
              Add
            </button>
          </div>
          {error && (
            <p
              id="day-event-title-error"
              role="alert"
              className="mt-2 text-xs text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}
        </form>

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className={secondaryButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { formatFullDate } from "@/lib/date";
import type { CalendarEvent, PreachingRecord } from "@/lib/storage";
import { focusRing } from "@/lib/ui";

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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
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
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg border border-line bg-surface p-6 shadow-lg outline-none"
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="day-dialog-title"
            className="min-w-0 break-words text-lg font-semibold text-ink"
          >
            {formatFullDate(dateKey)}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            title="Close"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors duration-150 hover:bg-subtle hover:text-ink ${focusRing}`}
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

        <section className="mt-6" aria-labelledby="day-events-heading">
          <h3
            id="day-events-heading"
            className="text-base font-semibold text-ink"
          >
            Events
          </h3>
          {events.length === 0 ? (
            <p className="mt-2 text-sm text-ink-muted">
              No events on this day yet.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-line">
              {events.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <span className="min-w-0 break-words text-sm text-ink">
                    {item.title}
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteEvent(item.id)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-6" aria-labelledby="day-records-heading">
          <h3
            id="day-records-heading"
            className="text-base font-semibold text-ink"
          >
            Preaching records
          </h3>
          {records.length === 0 ? (
            <p className="mt-2 text-sm text-ink-muted">
              No preaching records on this day.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-line">
              {records.map((record) => (
                <li
                  key={record.id}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex rounded bg-tag px-2 py-0.5 text-xs font-medium text-ink-secondary">
                      {record.type}
                    </span>
                    <p className="mt-1.5 break-words text-sm font-medium text-ink">
                      {record.personName}
                    </p>
                    <p className="mt-0.5 break-words text-sm text-ink-secondary">
                      {record.preachingWay}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteRecord(record.id)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <form onSubmit={handleSubmit} noValidate className="mt-6">
          <Field
            id="day-event-title"
            label="New event"
            value={title}
            onChange={handleTitleChange}
            error={error ?? undefined}
            maxLength={MAX_TITLE_LENGTH}
            placeholder="e.g. Evening service"
            action={
              <Button type="submit" className="shrink-0">
                Add
              </Button>
            }
          />
        </form>

        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

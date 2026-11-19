"use client";

import PreachingForm from "@/components/PreachingForm";
import { formatFullDate } from "@/lib/date";
import {
  saveRecords,
  usePreachingRecords,
  type PreachingRecord,
} from "@/lib/storage";
import { cardSurface, dangerButton } from "@/lib/ui";

/**
 * Preaching form plus the list of saved records (newest first).
 * Records are written to localStorage and appear on the calendar for their
 * date.
 */
export default function AddPersonPage() {
  const records = usePreachingRecords();

  const handleSave = (record: PreachingRecord): void => {
    saveRecords([record, ...records]);
  };

  const handleDelete = (id: string): void => {
    saveRecords(records.filter((record) => record.id !== id));
  };

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-5">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Add Person
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Record a preaching visit. Saved records show up on the calendar for
            their date.
          </p>
        </header>

        <div className={`${cardSurface} p-5 sm:p-6`}>
          <PreachingForm onSave={handleSave} />
        </div>

        <section className="mt-8" aria-labelledby="saved-records-heading">
          <div className="flex items-center justify-between gap-3">
            <h2
              id="saved-records-heading"
              className="text-base font-semibold text-zinc-900 dark:text-zinc-50"
            >
              Saved records
            </h2>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {records.length} total
            </span>
          </div>

          {records.length === 0 ? (
            <p
              className={`mt-3 p-5 text-center text-sm text-zinc-500 dark:text-zinc-400 ${cardSurface}`}
            >
              Nothing saved yet — your records will appear here, newest first.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {records.map((record) => (
                <li key={record.id} className={`${cardSurface} p-4`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {record.type}
                      </span>
                      <p className="mt-2 break-words text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        {record.personName}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {formatFullDate(record.date)}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm text-zinc-600 dark:text-zinc-300">
                        {record.preachingWay}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(record.id)}
                      className={dangerButton}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

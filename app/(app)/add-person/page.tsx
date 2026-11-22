"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PreachingForm from "@/components/PreachingForm";
import { formatFullDate } from "@/lib/date";
import {
  saveRecords,
  usePreachingRecords,
  type PreachingRecord,
} from "@/lib/storage";
import { pageLead, pageShell, pageTitle, pageVertical } from "@/lib/ui";

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
    <div className={`${pageShell} ${pageVertical} max-w-2xl bg-page`}>
      <header className="mb-6">
        <h1 className={pageTitle}>Add Person</h1>
        <p className={pageLead}>
          Record a preaching visit. Saved records show up on the calendar for
          their date.
        </p>
      </header>

      <Card>
        <PreachingForm onSave={handleSave} />
      </Card>

      <section className="mt-8" aria-labelledby="saved-records-heading">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="saved-records-heading"
            className="text-lg font-semibold text-ink"
          >
            Saved records
          </h2>
          <span className="text-sm text-ink-muted">
            {records.length} total
          </span>
        </div>

        {records.length === 0 ? (
          <Card className="mt-4">
            <p className="text-center text-sm text-ink-muted">
              Nothing saved yet — your records will appear here, newest first.
            </p>
          </Card>
        ) : (
          <Card className="mt-4 p-0">
            <ul className="divide-y divide-line">
              {records.map((record) => (
                <li
                  key={record.id}
                  className="flex items-start justify-between gap-3 px-6 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-ink-muted">
                        {formatFullDate(record.date)}
                      </span>
                      <span className="rounded bg-tag px-2 py-0.5 text-xs font-medium text-ink-secondary">
                        {record.type}
                      </span>
                    </div>
                    <p className="mt-1.5 break-words text-sm font-medium text-ink">
                      {record.personName}
                    </p>
                    <p className="mt-1 break-words text-sm text-ink-secondary">
                      {record.preachingWay}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(record.id)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>
    </div>
  );
}

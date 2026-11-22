"use client";

import { useMemo } from "react";
import Button from "@/components/ui/Button";
import {
  buildMonthCells,
  formatFullDate,
  formatMonthYear,
  type MonthCell,
  type ViewMonth,
} from "@/lib/date";

interface CalendarGridProps {
  view: ViewMonth;
  /** Local date key of today ("" until the client knows it). */
  today: string;
  /** Number of items (events + preaching records) per date key. */
  counts: ReadonlyMap<string, number>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectDate: (dateKey: string) => void;
}

const WEEKDAYS: ReadonlyArray<{ short: string; long: string }> = [
  { short: "Sun", long: "Sunday" },
  { short: "Mon", long: "Monday" },
  { short: "Tue", long: "Tuesday" },
  { short: "Wed", long: "Wednesday" },
  { short: "Thu", long: "Thursday" },
  { short: "Fri", long: "Friday" },
  { short: "Sat", long: "Saturday" },
];

function chunkIntoWeeks(cells: MonthCell[]): MonthCell[][] {
  const weeks: MonthCell[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }
  return weeks;
}

/**
 * Sun-Sat month grid with prev/today/next controls in a header row.
 * Cells are divided by 1px lines inside a single outer border; days that
 * carry items show an accent indicator, clicking any date opens that
 * day's dialog.
 */
export default function CalendarGrid({
  view,
  today,
  counts,
  onPrevMonth,
  onNextMonth,
  onToday,
  onSelectDate,
}: CalendarGridProps) {
  const cells = useMemo(() => buildMonthCells(view), [view]);
  const weeks = useMemo(() => chunkIntoWeeks(cells), [cells]);

  return (
    <section aria-label="Month calendar">
      {/* Header row: month/year left, controls right */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink">
          {formatMonthYear(view)}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={onPrevMonth}
            aria-label="Previous month"
            className="px-3"
          >
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <Button variant="secondary" onClick={onToday}>
            Today
          </Button>
          <Button
            variant="secondary"
            onClick={onNextMonth}
            aria-label="Next month"
            className="px-3"
          >
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
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-line bg-surface">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              {WEEKDAYS.map((day, index) => (
                <th
                  key={day.long}
                  scope="col"
                  className={[
                    "border-b border-line bg-subtle px-1.5 py-2 text-left text-xs font-medium text-ink-muted sm:px-2",
                    index < 6 ? "border-r border-line" : "",
                  ].join(" ")}
                >
                  <span aria-hidden="true" className="hidden sm:inline">
                    {day.long}
                  </span>
                  <span aria-hidden="true" className="sm:hidden">
                    {day.short}
                  </span>
                  <span className="sr-only">{day.long}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={week[0].key}>
                {week.map((cell, cellIndex) => {
                  const count = counts.get(cell.key) ?? 0;
                  const isToday = cell.key === today;
                  const isLastRow = weekIndex === weeks.length - 1;

                  const tdClasses = [
                    "border-line p-0",
                    cellIndex < 6 ? "border-r" : "",
                    isLastRow ? "" : "border-b",
                  ].join(" ");

                  const buttonClasses = [
                    "flex min-h-20 w-full flex-col items-start justify-between gap-1 p-1.5 text-left transition-colors duration-150 hover:bg-subtle sm:min-h-28 sm:p-2",
                    "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent",
                  ].join(" ");

                  const labelParts = [formatFullDate(cell.key)];
                  if (isToday) labelParts.push("today");
                  if (count > 0) {
                    labelParts.push(
                      `${count} item${count === 1 ? "" : "s"}`,
                    );
                  }

                  return (
                    <td key={cell.key} className={tdClasses}>
                      <button
                        type="button"
                        onClick={() => onSelectDate(cell.key)}
                        aria-label={labelParts.join(", ")}
                        className={buttonClasses}
                      >
                        <span className="relative flex h-7 w-7 items-center justify-center">
                          {isToday && (
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 rounded-full bg-accent"
                            />
                          )}
                          <span
                            className={[
                              "relative text-sm font-medium",
                              isToday
                                ? "text-white"
                                : cell.inMonth
                                  ? "text-ink"
                                  : "text-ink-muted",
                            ].join(" ")}
                          >
                            {cell.day}
                          </span>
                        </span>
                        {count > 0 && (
                          <>
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 rounded-full bg-accent sm:hidden"
                            />
                            <span className="hidden text-xs text-accent sm:inline">
                              {count} event{count === 1 ? "" : "s"}
                            </span>
                          </>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

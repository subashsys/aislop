"use client";

import { useMemo } from "react";
import {
  buildMonthCells,
  formatFullDate,
  formatMonthYear,
  type MonthCell,
  type ViewMonth,
} from "@/lib/date";
import { cardSurface, focusRing, iconButton, secondaryButton } from "@/lib/ui";

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
 * Sun-Sat month grid with prev/next/today controls. Dates that carry items
 * show a count badge; clicking any date opens that day's dialog.
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
    <section aria-label="Month calendar" className={`${cardSurface} p-4 sm:p-5`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Previous month"
            className={iconButton}
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
          </button>

          <h2 className="min-w-[9.5rem] text-center text-base font-semibold text-zinc-900 dark:text-zinc-50 sm:text-lg">
            {formatMonthYear(view)}
          </h2>

          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
            className={iconButton}
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
          </button>
        </div>

        <button type="button" onClick={onToday} className={secondaryButton}>
          Today
        </button>
      </div>

      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            {WEEKDAYS.map((day) => (
              <th
                key={day.long}
                scope="col"
                className="pb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 sm:text-xs"
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
          {weeks.map((week) => (
            <tr key={week[0].key}>
              {week.map((cell) => {
                const count = counts.get(cell.key) ?? 0;
                const isToday = cell.key === today;

                const cellClasses = [
                  "flex min-h-11 w-full flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 transition sm:min-h-14 lg:min-h-16",
                  isToday
                    ? "bg-emerald-50 font-semibold text-emerald-700 ring-2 ring-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-400"
                    : cell.inMonth
                      ? "text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                      : "text-zinc-400 hover:bg-zinc-50 dark:text-zinc-500 dark:hover:bg-zinc-800/60",
                  focusRing,
                ].join(" ");

                const labelParts = [formatFullDate(cell.key)];
                if (isToday) labelParts.push("today");
                if (count > 0) {
                  labelParts.push(`${count} item${count === 1 ? "" : "s"}`);
                }

                return (
                  <td key={cell.key} className="p-0.5">
                    <button
                      type="button"
                      onClick={() => onSelectDate(cell.key)}
                      aria-label={labelParts.join(", ")}
                      className={cellClasses}
                    >
                      <span className="text-sm sm:text-base">{cell.day}</span>
                      {count > 0 && (
                        <span
                          className={
                            isToday
                              ? "inline-flex min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold leading-4 text-emerald-700"
                              : "inline-flex min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold leading-4 text-white"
                          }
                        >
                          {count > 99 ? "99+" : count}
                        </span>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/**
 * Local-date helpers.
 *
 * Date keys are always built from local year/month/day values — never from
 * `toISOString()` — so an event saved at 11pm never lands on the wrong day.
 */

export interface ViewMonth {
  /** Full year, e.g. 2026. */
  year: number;
  /** Zero-based month index (0 = January). */
  month: number;
}

export interface MonthCell {
  /** Local date key formatted as YYYY-MM-DD. */
  key: string;
  /** Day of month (1-31). */
  day: number;
  /** Whether the date belongs to the displayed month. */
  inMonth: boolean;
}

/** Formats a Date as a local YYYY-MM-DD key. */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Extracts the month view from a YYYY-MM-DD key, or null if malformed. */
export function viewFromKey(key: string): ViewMonth | null {
  if (key.length < 7) return null;
  const year = Number(key.slice(0, 4));
  const month = Number(key.slice(5, 7)) - 1;
  if (!Number.isInteger(year) || !Number.isInteger(month)) return null;
  if (month < 0 || month > 11) return null;
  return { year, month };
}

/** Human readable month label, e.g. "November 2026". */
export function formatMonthYear(view: ViewMonth): string {
  return new Date(view.year, view.month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/** Human readable day label, e.g. "Wednesday, November 19, 2026". */
export function formatFullDate(key: string): string {
  const view = viewFromKey(key);
  if (view === null || key.length < 10) return key;
  const day = Number(key.slice(8, 10));
  if (!Number.isInteger(day)) return key;
  const date = new Date(view.year, view.month, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Builds a fixed 6-row x 7-column grid (Sun-Sat) covering the given month,
 * including leading/trailing days from the neighbouring months.
 */
export function buildMonthCells(view: ViewMonth): MonthCell[] {
  const firstOfMonth = new Date(view.year, view.month, 1);
  const gridStart = new Date(view.year, view.month, 1 - firstOfMonth.getDay());

  const cells: MonthCell[] = [];
  for (let index = 0; index < 42; index += 1) {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    );
    cells.push({
      key: toDateKey(date),
      day: date.getDate(),
      inMonth: date.getMonth() === view.month && date.getFullYear() === view.year,
    });
  }
  return cells;
}

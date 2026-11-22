"use client";

import { useCallback, useMemo, useState } from "react";
import CalendarGrid from "@/components/CalendarGrid";
import DayModal from "@/components/DayModal";
import { viewFromKey, type ViewMonth } from "@/lib/date";
import {
  createId,
  saveEvents,
  saveRecords,
  useCalendarEvents,
  usePreachingRecords,
  useTodayKey,
} from "@/lib/storage";
import { pageLead, pageShell, pageTitle, pageVertical } from "@/lib/ui";

/**
 * Month grid + per-day dialog. Events and preaching records come straight
 * from the localStorage store, so records saved on /add-person show up here
 * for their date and can be deleted from the day dialog.
 */
export default function CalendarPage() {
  const today = useTodayKey();
  const events = useCalendarEvents();
  const records = usePreachingRecords();
  const [viewOverride, setViewOverride] = useState<ViewMonth | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const event of events) {
      map.set(event.date, (map.get(event.date) ?? 0) + 1);
    }
    for (const record of records) {
      map.set(record.date, (map.get(record.date) ?? 0) + 1);
    }
    return map;
  }, [events, records]);

  const todayView = viewFromKey(today);
  const handleClose = useCallback(() => setSelectedDate(null), []);

  // The server cannot know the visitor's local date: render a neutral
  // placeholder until the client store reports today's key.
  if (todayView === null) {
    return (
      <div className={`${pageShell} ${pageVertical} max-w-4xl bg-page`}>
        <div
          className="h-96 w-full rounded-md border border-line bg-surface"
          aria-hidden="true"
        />
        <p className="sr-only" role="status">
          Loading calendar…
        </p>
      </div>
    );
  }

  const view = viewOverride ?? todayView;

  const handlePrevMonth = (): void => {
    setViewOverride(
      view.month === 0
        ? { year: view.year - 1, month: 11 }
        : { year: view.year, month: view.month - 1 },
    );
  };

  const handleNextMonth = (): void => {
    setViewOverride(
      view.month === 11
        ? { year: view.year + 1, month: 0 }
        : { year: view.year, month: view.month + 1 },
    );
  };

  const handleToday = (): void => {
    setViewOverride(null);
  };

  const handleAddEvent = (title: string): void => {
    if (selectedDate === null) return;
    saveEvents([
      ...events,
      { id: createId(), date: selectedDate, title },
    ]);
  };

  const handleDeleteEvent = (id: string): void => {
    saveEvents(events.filter((event) => event.id !== id));
  };

  const handleDeleteRecord = (id: string): void => {
    saveRecords(records.filter((record) => record.id !== id));
  };

  const dayEvents =
    selectedDate === null
      ? []
      : events.filter((event) => event.date === selectedDate);
  const dayRecords =
    selectedDate === null
      ? []
      : records.filter((record) => record.date === selectedDate);

  return (
    <div className={`${pageShell} ${pageVertical} max-w-4xl bg-page`}>
      <header className="mb-6">
        <h1 className={pageTitle}>Calendar</h1>
        <p className={pageLead}>
          Select a date to view, add or delete items for that day.
        </p>
      </header>

      <CalendarGrid
        view={view}
        today={today}
        counts={counts}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onSelectDate={setSelectedDate}
      />

      {selectedDate !== null && (
        <DayModal
          dateKey={selectedDate}
          events={dayEvents}
          records={dayRecords}
          onAddEvent={handleAddEvent}
          onDeleteEvent={handleDeleteEvent}
          onDeleteRecord={handleDeleteRecord}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

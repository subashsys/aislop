/**
 * Typed localStorage helpers plus the small React hooks that read them.
 *
 * Design notes:
 * - Every raw access is guarded by `typeof window` and wrapped in try/catch,
 *   so SSR and privacy-mode browsers never throw.
 * - An in-memory copy is kept for keys that could not be written, so a failed
 *   write never makes the UI lose data it just saved.
 * - Reads are exposed through `useSyncExternalStore`, which lets client
 *   components read localStorage during render without `setState`-in-effect
 *   hydration mismatches.
 */

import { useSyncExternalStore } from "react";
import { toDateKey } from "@/lib/date";

export type PreachingType = "Simple Preaching" | "Connected Preaching";

export interface CalendarEvent {
  /** Unique record id. */
  id: string;
  /** Local calendar day formatted as YYYY-MM-DD. */
  date: string;
  /** Short event title. */
  title: string;
}

export interface PreachingRecord {
  /** Unique record id. */
  id: string;
  /** Local calendar day formatted as YYYY-MM-DD. */
  date: string;
  type: PreachingType;
  personName: string;
  preachingWay: string;
}

export const PREACHING_TYPES: readonly PreachingType[] = [
  "Simple Preaching",
  "Connected Preaching",
];

const AUTH_KEY = "minememoslop.auth";
const EVENTS_KEY = "minememoslop.events";
const RECORDS_KEY = "minememoslop.records";

type Listener = () => void;

/* ------------------------------------------------------------------ */
/* Low-level storage (always safe to call)                             */
/* ------------------------------------------------------------------ */

/** Session copy used whenever localStorage itself is unavailable. */
const memory = new Map<string, string>();

/** Flips to false the moment localStorage throws, so we stop retrying it. */
let storageHealthy = true;

function readItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  if (storageHealthy) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      // Private mode / disabled storage: fall back to the in-memory copy.
      storageHealthy = false;
    }
  }
  return memory.get(key) ?? null;
}

function writeItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  memory.set(key, value);
  if (storageHealthy) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Quota or blocked storage: keep serving the in-memory copy.
      storageHealthy = false;
    }
  }
}

function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  memory.delete(key);
  if (storageHealthy) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      storageHealthy = false;
    }
  }
}

/* ------------------------------------------------------------------ */
/* Per-key subscription + snapshot cache                               */
/* ------------------------------------------------------------------ */

const listeners = new Map<string, Set<Listener>>();

function subscribeKey(key: string, listener: Listener): () => void {
  const existing = listeners.get(key);
  const bucket = existing ?? new Set<Listener>();
  if (existing === undefined) {
    listeners.set(key, bucket);
  }
  bucket.add(listener);
  return () => {
    bucket.delete(listener);
  };
}

function notifyKey(key: string): void {
  const bucket = listeners.get(key);
  if (bucket === undefined) return;
  for (const listener of Array.from(bucket)) {
    listener();
  }
}

interface SnapshotCache {
  raw: string | null;
  value: unknown;
}

const snapshots = new Map<string, SnapshotCache>();

/** Parses on change only, so `getSnapshot` always returns a stable reference. */
function getSnapshot<T>(key: string, parse: (raw: string | null) => T): T {
  const raw = readItem(key);
  const cached = snapshots.get(key);
  if (cached !== undefined && cached.raw === raw) {
    return cached.value as T;
  }
  const value = parse(raw);
  snapshots.set(key, { raw, value });
  return value;
}

/* ------------------------------------------------------------------ */
/* Parsing + validation                                                */
/* ------------------------------------------------------------------ */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCalendarEvent(value: unknown): value is CalendarEvent {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.date === "string" &&
    typeof value.title === "string"
  );
}

function isPreachingRecord(value: unknown): value is PreachingRecord {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.date === "string" &&
    typeof value.personName === "string" &&
    typeof value.preachingWay === "string" &&
    (value.type === "Simple Preaching" || value.type === "Connected Preaching")
  );
}

function parseEvents(raw: string | null): CalendarEvent[] {
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCalendarEvent);
  } catch {
    return [];
  }
}

function parseRecords(raw: string | null): PreachingRecord[] {
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isPreachingRecord);
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Auth (client-side demo flag)                                        */
/* ------------------------------------------------------------------ */

/** True when the demo session flag is present. */
export function isAuthenticated(): boolean {
  return readItem(AUTH_KEY) === "1";
}

/** Marks the demo session as signed in. */
export function signIn(): void {
  writeItem(AUTH_KEY, "1");
}

/** Clears the demo session flag. */
export function signOut(): void {
  removeItem(AUTH_KEY);
}

/* ------------------------------------------------------------------ */
/* Getters / setters                                                   */
/* ------------------------------------------------------------------ */

export function loadEvents(): CalendarEvent[] {
  return getSnapshot(EVENTS_KEY, parseEvents);
}

export function saveEvents(events: readonly CalendarEvent[]): void {
  writeItem(EVENTS_KEY, JSON.stringify(events));
  notifyKey(EVENTS_KEY);
}

export function loadRecords(): PreachingRecord[] {
  return getSnapshot(RECORDS_KEY, parseRecords);
}

export function saveRecords(records: readonly PreachingRecord[]): void {
  writeItem(RECORDS_KEY, JSON.stringify(records));
  notifyKey(RECORDS_KEY);
}

/** Creates a collision-resistant id without assuming crypto exists. */
export function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

const subscribeEvents = (listener: Listener): (() => void) =>
  subscribeKey(EVENTS_KEY, listener);
const getEventsSnapshot = (): CalendarEvent[] => loadEvents();
const getServerEventsSnapshot = (): CalendarEvent[] => [];

/** Reactive list of calendar events (empty on the server). */
export function useCalendarEvents(): CalendarEvent[] {
  return useSyncExternalStore(
    subscribeEvents,
    getEventsSnapshot,
    getServerEventsSnapshot,
  );
}

const subscribeRecords = (listener: Listener): (() => void) =>
  subscribeKey(RECORDS_KEY, listener);
const getRecordsSnapshot = (): PreachingRecord[] => loadRecords();
const getServerRecordsSnapshot = (): PreachingRecord[] => [];

/** Reactive list of preaching records (empty on the server). */
export function usePreachingRecords(): PreachingRecord[] {
  return useSyncExternalStore(
    subscribeRecords,
    getRecordsSnapshot,
    getServerRecordsSnapshot,
  );
}

/**
 * Today's local date key. Empty string during SSR/hydration so callers can
 * render a neutral placeholder instead of mismatching the server markup.
 */
export function useTodayKey(): string {
  return useSyncExternalStore(subscribeNoop, getTodaySnapshot, getServerToday);
}

function subscribeNoop(): () => void {
  return () => undefined;
}

function getTodaySnapshot(): string {
  return toDateKey(new Date());
}

function getServerToday(): string {
  return "";
}

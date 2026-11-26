/**
 * Local profile (name + phone), stored in localStorage under "profile".
 * Kept separate from the activity-log data in lib/storage.ts.
 */

export type Profile = { name: string; phone: string };

const PROFILE_KEY = "profile";

function isProfile(value: unknown): value is Profile {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<Record<keyof Profile, unknown>>;
  return typeof candidate.name === "string" && typeof candidate.phone === "string";
}

/** Returns the saved profile, or null when absent/unreadable (or on the server). */
export function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return isProfile(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Persists the profile; silently ignores storage failures. */
export function saveProfile(profile: Profile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Storage unavailable (private mode / quota) — nothing sensible to do.
  }
}

/**
 * Shared Tailwind class strings.
 *
 * Every class is written out as a complete literal (never assembled from
 * fragments) so Tailwind's scanner can pick them up from this file.
 */

/** Consistent, visible keyboard focus ring. */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";

/** Base classes for text inputs, textareas and date inputs. */
export const inputBase = [
  "w-full min-h-11 rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-base text-zinc-900",
  "placeholder-zinc-400 transition dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500",
  focusRing,
].join(" ");

/** Solid call-to-action button. */
export const primaryButton = [
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white",
  "transition hover:bg-emerald-700 dark:hover:bg-emerald-500",
  focusRing,
].join(" ");

/** Outlined, neutral button. */
export const secondaryButton = [
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700",
  "transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800",
  focusRing,
].join(" ");

/** Destructive action button (still touch friendly at 44px). */
export const dangerButton = [
  "inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600",
  "transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40",
  focusRing,
].join(" ");

/** Square icon button used for prev/next month controls. */
export const iconButton = [
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600",
  "transition hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800",
  focusRing,
].join(" ");

/** Surface used for cards and panels. */
export const cardSurface = [
  "rounded-2xl border border-zinc-200 bg-white shadow-sm",
  "dark:border-zinc-800 dark:bg-zinc-900",
].join(" ");

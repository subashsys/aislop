/**
 * Shared page-level class strings.
 *
 * Every class is written out as a complete literal (never assembled from
 * fragments) so Tailwind's scanner can pick them up from this file.
 */

/** Consistent, visible keyboard focus ring (accent color). */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** Horizontal page padding + centering; pair with a max-w-* and pageVertical. */
export const pageShell = "mx-auto w-full px-4 sm:px-6 lg:px-8";

/** Standard vertical rhythm for page content. */
export const pageVertical = "py-8 sm:py-10";

/** Standard page heading. */
export const pageTitle = "text-2xl font-semibold text-ink";

/** Standard muted paragraph under a page heading. */
export const pageLead = "mt-1 text-sm text-ink-muted";

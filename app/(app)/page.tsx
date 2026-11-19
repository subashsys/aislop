import Image from "next/image";
import Link from "next/link";
import { focusRing } from "@/lib/ui";

const actionClasses = [
  "group flex min-h-28 items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm",
  "transition hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700",
  "sm:min-h-32 sm:p-6",
  focusRing,
].join(" ");

const iconClasses =
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300";

const chevronClasses =
  "ml-auto h-5 w-5 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-600 dark:text-zinc-500";

/**
 * Home screen: banner plus the two main actions.
 * Kept as a server component — all interactivity lives in `Link`.
 */
export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Image
        src="/banner.svg"
        alt="Gradient banner showing a calendar illustration"
        width={1600}
        height={400}
        priority
        className="h-44 w-full rounded-2xl object-cover shadow-sm sm:h-56 lg:h-72"
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
        <Link href="/calendar" className={actionClasses}>
          <span aria-hidden="true" className={iconClasses}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Calendar
            </span>
            <span className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              Browse and manage daily events
            </span>
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={chevronClasses}
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>

        <Link href="/add-person" className={actionClasses}>
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 transition group-hover:bg-sky-200 dark:bg-sky-950 dark:text-sky-300"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </svg>
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Add Person
            </span>
            <span className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              Record a new preaching visit
            </span>
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={chevronClasses}
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

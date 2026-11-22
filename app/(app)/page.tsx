import Image from "next/image";
import Link from "next/link";
import { focusRing, pageShell, pageVertical } from "@/lib/ui";

const actionCard = [
  "flex flex-col rounded-md border border-line bg-surface p-4 transition-colors duration-150",
  "hover:border-accent hover:bg-subtle",
  focusRing,
  "sm:p-6",
].join(" ");

const iconClasses = "h-6 w-6 text-accent";

/**
 * Home screen: flat banner plus the two main actions.
 * Kept as a server component — all interactivity lives in `Link`.
 */
export default function HomePage() {
  return (
    <div
      className={`${pageShell} ${pageVertical} max-w-screen-xl bg-page`}
    >
      <Image
        src="/banner.svg"
        alt="Calendar and memo illustration"
        width={1600}
        height={400}
        priority
        className="h-40 w-full rounded-md border border-line object-cover sm:h-56 lg:h-72"
      />

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Link href="/calendar" className={actionCard}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={iconClasses}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span className="mt-3 text-sm font-semibold text-ink sm:mt-4 sm:text-lg">
            Calendar
          </span>
          <span className="mt-1 truncate text-xs text-ink-muted sm:text-sm">
            Browse and manage daily events
          </span>
        </Link>

        <Link href="/add-person" className={actionCard}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={iconClasses}
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4-4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M19 8v6M22 11h-6" />
          </svg>
          <span className="mt-3 text-sm font-semibold text-ink sm:mt-4 sm:text-lg">
            Add Person
          </span>
          <span className="mt-1 truncate text-xs text-ink-muted sm:text-sm">
            Record a new preaching visit
          </span>
        </Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/storage";
import { focusRing } from "@/lib/ui";

/**
 * Sticky top navigation for the protected part of the app.
 * Sign-out clears the demo auth flag and returns to the login screen.
 */
export default function Navbar() {
  const router = useRouter();

  const handleSignOut = (): void => {
    signOut();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-page">
      <div className="mx-auto flex h-16 w-full max-w-screen-xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={`flex items-center gap-2.5 rounded-md ${focusRing}`}
        >
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-base font-semibold text-white"
          >
            M
          </span>
          <span className="text-base font-semibold text-ink">MineMemoSlop</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sign out"
          title="Sign out"
          className={`flex h-10 w-10 items-center justify-center rounded-md text-ink-muted transition-colors duration-150 hover:bg-subtle hover:text-ink ${focusRing}`}
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
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/storage";

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Client-side guard for the protected route group.
 *
 * The auth flag only lives in localStorage, so the verdict cannot be known
 * during SSR/hydration. We render a neutral loading state that is identical
 * on the server and the client, then decide in a deferred effect — this both
 * avoids hydration mismatches and keeps protected markup from flashing for
 * signed-out visitors.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean>(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (isAuthenticated()) {
        setAllowed(true);
      } else {
        router.replace("/login");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  if (!allowed) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        role="status"
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}

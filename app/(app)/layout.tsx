import type { ReactNode } from "react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

/**
 * Layout for the protected route group: the navbar is shared by every
 * authenticated screen and AuthGuard keeps signed-out visitors out.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-page">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ExternalIcon, LogoutIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { countUnread } from "@/lib/messages";
import { getCurrentUser } from "@/lib/session";
import { logout } from "../login/actions";
import { AdminNav } from "./admin-nav";

// Every admin page depends on the session, so navigations here may wait on it.
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false },
};

/** Nav with live counts; renders the plain nav until the session is known. */
async function NavWithCounts() {
  const user = await getCurrentUser();
  if (!user) return <AdminNav />;
  return <AdminNav badges={{ "/admin/messages": await countUnread() }} />;
}

async function CurrentUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-medium">{user.name}</p>
      <p className="truncate text-xs text-ink-faint">{user.email}</p>
    </div>
  );
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="border-b border-rule bg-paper-raised md:sticky md:top-0 md:flex md:h-dvh md:w-64 md:shrink-0 md:flex-col md:border-r md:border-b-0">
        <div className="flex items-center justify-between gap-3 px-4 pt-4 md:px-5 md:pt-6">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-medium italic">HY</span>
            <span className="font-mono text-xs tracking-wide text-ink-faint uppercase">admin</span>
          </Link>
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle className="rounded-lg p-1.5 text-ink-soft hover:bg-paper-sunk hover:text-ink" />
            <form action={logout}>
              <button type="submit" className="text-sm text-ink-soft hover:text-ink">
                Keluar
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="Admin" className="px-3 py-3 md:mt-6 md:flex-1 md:px-3">
          <Suspense fallback={<AdminNav />}>
            <NavWithCounts />
          </Suspense>
        </nav>

        <div className="hidden border-t border-rule p-4 md:block">
          <Suspense fallback={<div className="h-9" />}>
            <CurrentUser />
          </Suspense>
          <div className="mt-3 flex gap-2">
            <ThemeToggle className="btn-secondary shrink-0 px-2.5! py-1.5!" />
            <Link href="/" target="_blank" className="btn-secondary flex-1 px-3! py-1.5! text-sm">
              <ExternalIcon className="size-4" />
              Situs
            </Link>
            <form action={logout} className="flex-1">
              <button type="submit" className="btn-secondary w-full px-3! py-1.5! text-sm">
                <LogoutIcon className="size-4" />
                Keluar
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 md:py-10 lg:px-12">
        <Suspense fallback={<p className="text-sm text-ink-faint">Memuat…</p>}>{children}</Suspense>
      </main>
    </div>
  );
}

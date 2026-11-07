import type { Metadata } from "next";
import Link from "next/link";
import { listMessages } from "@/lib/messages";
import { requireUser } from "@/lib/session";

export const instant = false;

export const metadata: Metadata = { title: "Pesan masuk" };

const dateFormat = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });

export default async function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  await requireUser();
  const [items, params] = await Promise.all([listMessages(), searchParams]);
  const unread = items.filter((m) => !m.isRead).length;

  return (
    <div className="max-w-5xl">
      <p className="font-mono text-xs tracking-wide text-ink-faint uppercase">Pesan masuk</p>
      <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">Dari form kontak</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {items.length} pesan{unread > 0 && <> · {unread} belum dibaca</>}
      </p>

      {"deleted" in params && (
        <p role="status" className="mt-6 rounded-lg border border-ok/30 bg-ok/10 px-4 py-2.5 text-sm text-ok">
          Pesan dihapus.
        </p>
      )}

      {items.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-rule px-6 py-14 text-center text-ink-soft">
          Belum ada pesan. Pesan dari halaman Contact akan muncul di sini.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-rule overflow-hidden rounded-2xl border border-rule bg-paper-raised">
          {items.map((m) => (
            <li key={m.id}>
              <Link
                href={`/admin/messages/${m.id}`}
                // Opening marks it read; don't let prefetching count as opening.
                prefetch={false}
                className="flex items-start gap-4 px-4 py-4 transition-colors hover:bg-paper-sunk sm:px-5"
              >
                <span
                  aria-label={m.isRead ? undefined : "Belum dibaca"}
                  className={`mt-2 size-2 shrink-0 rounded-full ${m.isRead ? "bg-transparent" : "bg-accent"}`}
                />
                <div className="min-w-0 flex-1">
                  <p className={`flex items-baseline justify-between gap-3 ${m.isRead ? "" : "font-semibold"}`}>
                    <span className="truncate">{m.name}</span>
                    <span className="shrink-0 font-mono text-xs font-normal text-ink-faint">{dateFormat.format(m.createdAt)}</span>
                  </p>
                  <p className={`truncate text-sm ${m.isRead ? "text-ink-soft" : "text-ink"}`}>{m.subject ?? "(tanpa subjek)"}</p>
                  <p className="truncate text-sm text-ink-faint">{m.body}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

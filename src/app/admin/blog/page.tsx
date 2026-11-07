import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "@/components/icons";
import { formatDay } from "@/lib/format";
import { listAllPosts, readingMinutes } from "@/lib/posts";
import { requireUser } from "@/lib/session";

export const instant = false;

export const metadata: Metadata = { title: "Blog" };

const FLASH: Record<string, string> = {
  created: "Tulisan disimpan.",
  deleted: "Tulisan dihapus.",
};

export default async function BlogAdminPage({ searchParams }: PageProps<"/admin/blog">) {
  await requireUser();
  const [posts, params] = await Promise.all([listAllPosts(), searchParams]);
  const flash = Object.keys(FLASH).find((key) => key in params);
  const published = posts.filter((p) => p.isPublished).length;

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-wide text-ink-faint uppercase">Blog</p>
          <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">Semua tulisan</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {posts.length} tulisan · {published} terbit
            {posts.length - published > 0 && <> · {posts.length - published} draft</>}
          </p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary text-sm">
          <PlusIcon className="size-4" />
          Tulis baru
        </Link>
      </div>

      {flash && (
        <p role="status" className="mt-6 rounded-lg border border-ok/30 bg-ok/10 px-4 py-2.5 text-sm text-ok">
          {FLASH[flash]}
        </p>
      )}

      {posts.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-rule px-6 py-14 text-center text-ink-soft">
          Belum ada tulisan.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-rule overflow-hidden rounded-2xl border border-rule bg-paper-raised">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/blog/${p.id}`} className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-paper-sunk sm:px-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.title}</p>
                  <p className="mt-0.5 truncate font-mono text-xs text-ink-faint">
                    {p.category} · {formatDay(p.publishedOn)} · {readingMinutes(p.content)} min
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[11px] ${
                    p.isPublished ? "bg-ok/15 text-ok" : "bg-paper-sunk text-ink-faint"
                  }`}
                >
                  {p.isPublished ? "Terbit" : "Draft"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon, StarIcon } from "@/components/icons";
import { formatMonth } from "@/lib/format";
import { listAllProjects } from "@/lib/projects";
import { requireUser } from "@/lib/session";

export const instant = false;

export const metadata: Metadata = { title: "Projects" };

const FLASH: Record<string, string> = {
  created: "Project ditambahkan.",
  deleted: "Project dihapus.",
};

export default async function ProjectsAdminPage({ searchParams }: PageProps<"/admin/projects">) {
  await requireUser();
  const [projects, params] = await Promise.all([listAllProjects(), searchParams]);
  const flash = Object.keys(FLASH).find((key) => key in params);
  const published = projects.filter((p) => p.isPublished).length;

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-wide text-ink-faint uppercase">Projects</p>
          <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">Semua project</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {projects.length} project · {published} tayang
            {projects.length - published > 0 && <> · {projects.length - published} draft</>}
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary text-sm">
          <PlusIcon className="size-4" />
          Tambah project
        </Link>
      </div>

      {flash && (
        <p role="status" className="mt-6 rounded-lg border border-ok/30 bg-ok/10 px-4 py-2.5 text-sm text-ok">
          {FLASH[flash]}
        </p>
      )}

      {projects.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-rule px-6 py-14 text-center text-ink-soft">
          Belum ada project.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-rule overflow-hidden rounded-2xl border border-rule bg-paper-raised">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/projects/${p.id}`}
                className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-paper-sunk sm:px-5"
              >
                <span className="w-7 shrink-0 text-right font-mono text-xs text-ink-faint">{p.sortOrder}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate font-medium">
                    {p.isFeatured && <StarIcon className="size-3.5 shrink-0 text-accent" aria-label="Unggulan" />}
                    <span className="truncate">{p.title}</span>
                  </p>
                  <p className="mt-0.5 truncate font-mono text-xs text-ink-faint">
                    {p.category}
                    {p.completedOn && <> · {formatMonth(p.completedOn)}</>}
                    {!p.coverImage && <> · tanpa sampul</>}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[11px] ${
                    p.isPublished ? "bg-ok/15 text-ok" : "bg-paper-sunk text-ink-faint"
                  }`}
                >
                  {p.isPublished ? "Tayang" : "Draft"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

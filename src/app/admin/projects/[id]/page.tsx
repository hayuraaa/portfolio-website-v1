import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findProject } from "@/lib/projects";
import { requireUser } from "@/lib/session";
import { DeleteItem } from "../../delete-item";
import { deleteProject } from "../actions";
import { toFormData } from "../form-data";
import { ProjectForm } from "../project-form";

export const instant = false;

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  await requireUser();
  const { id } = await params;
  const project = await findProject(Number(id));
  if (!project) notFound();

  return (
    <div className="max-w-4xl pb-28">
      <Link href="/admin/projects" className="text-sm text-ink-soft hover:text-ink">
        ← Semua project
      </Link>
      <div className="mt-3 mb-8 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-serif text-4xl font-medium tracking-tight">{project.title}</h1>
        {project.isPublished && (
          <Link href={`/projects#${project.slug}`} target="_blank" className="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline">
            Lihat di situs ↗
          </Link>
        )}
      </div>
      {/* key: remount with fresh defaults if another project is opened */}
      <ProjectForm key={project.id} initial={toFormData(project)} />
      <DeleteItem
        id={project.id}
        title={project.title}
        noun="project"
        note="Project dan semua gambarnya dihapus dan tidak bisa dikembalikan."
        action={deleteProject}
      />
    </div>
  );
}

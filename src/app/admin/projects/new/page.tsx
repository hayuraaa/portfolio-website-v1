import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { toFormData } from "../form-data";
import { ProjectForm } from "../project-form";

export const instant = false;

export const metadata: Metadata = { title: "Project baru" };

export default async function NewProjectPage() {
  await requireUser();

  return (
    <div className="max-w-4xl pb-28">
      <Link href="/admin/projects" className="text-sm text-ink-soft hover:text-ink">
        ← Semua project
      </Link>
      <h1 className="mt-3 mb-8 font-serif text-4xl font-medium tracking-tight">Project baru</h1>
      <ProjectForm initial={toFormData(null)} />
    </div>
  );
}

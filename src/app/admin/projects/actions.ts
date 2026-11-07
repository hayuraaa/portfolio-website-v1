"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, max, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { PROJECT_CATEGORIES } from "@/lib/project-categories";
import { findProject, PROJECTS_TAG } from "@/lib/projects";
import { slugify } from "@/lib/slug";
import { requireUser } from "@/lib/session";
import { checkUpload, deleteUpload, hasFile, saveUpload, UPLOAD_KINDS } from "@/lib/uploads";

const MAX_GALLERY = 8;

const blankToNull = (v: string) => v.trim() || null;

const optionalUrl = z
  .string()
  .transform(blankToNull)
  .pipe(z.url({ protocol: /^https?$/, error: "Harus berupa URL lengkap, mis. https://…" }).nullable());

const ProjectSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi.").max(200, "Maksimal 200 karakter."),
  slug: z.string().trim().max(80, "Maksimal 80 karakter."),
  category: z.enum(PROJECT_CATEGORIES, { error: "Pilih salah satu kategori." }),
  summary: z.string().trim().min(1, "Ringkasan wajib diisi.").max(600, "Maksimal 600 karakter."),
  details: z.string().max(10000, "Maksimal 10.000 karakter.").transform(blankToNull),
  technologies: z
    .string()
    .transform((v) => [...new Set(v.split(/[,\n]/).map((t) => t.trim()).filter(Boolean))])
    .pipe(z.array(z.string().max(40)).max(20, "Maksimal 20 teknologi.")),
  demoUrl: optionalUrl,
  repoUrl: optionalUrl,
  publicationUrl: optionalUrl,
  completedOn: z
    .string()
    .transform(blankToNull)
    .pipe(z.string().regex(/^\d{4}-\d{2}$/, "Format bulan tidak valid.").nullable()),
  sortOrder: z.string().transform((v, ctx) => {
    if (!v.trim()) return null;
    const n = Number(v);
    if (Number.isInteger(n) && n >= 0 && n <= 9999) return n;
    ctx.addIssue({ code: "custom", message: "Harus bilangan bulat 0–9999." });
    return z.NEVER;
  }),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
});

export type ProjectField = keyof z.input<typeof ProjectSchema> | "coverImage" | "gallery";
export type ProjectState = { ok: boolean; message: string; errors?: Partial<Record<ProjectField, string>> } | undefined;

const TEXT_FIELDS = [
  "title",
  "slug",
  "category",
  "summary",
  "details",
  "technologies",
  "demoUrl",
  "repoUrl",
  "publicationUrl",
  "completedOn",
  "sortOrder",
] as const;

export async function saveProject(_prev: ProjectState, formData: FormData): Promise<ProjectState> {
  await requireUser();

  const id = Number(formData.get("id")) || null;
  const current = id ? await findProject(id) : null;
  if (id && !current) return { ok: false, message: "Project tidak ditemukan. Mungkin sudah dihapus." };

  const raw: Record<string, string | boolean> = Object.fromEntries(
    TEXT_FIELDS.map((key) => [key, String(formData.get(key) ?? "")]),
  );
  raw.isFeatured = formData.get("isFeatured") === "on";
  raw.isPublished = formData.get("isPublished") === "on";

  const parsed = ProjectSchema.safeParse(raw);
  const errors: Partial<Record<ProjectField, string>> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) errors[issue.path[0] as ProjectField] ??= issue.message;
  }

  // Images
  const cover = formData.get("coverImage");
  if (hasFile(cover)) {
    const problem = checkUpload(cover, UPLOAD_KINDS.projectImage);
    if (problem) errors.coverImage = problem;
  }
  const newGallery = formData.getAll("gallery").filter(hasFile);
  for (const file of newGallery) {
    const problem = checkUpload(file, UPLOAD_KINDS.projectImage);
    if (problem) errors.gallery = `${file.name}: ${problem}`;
  }
  const removeGallery = new Set(formData.getAll("removeGallery").map(String));
  const keptGallery = (current?.gallery ?? []).filter((g) => !removeGallery.has(g));
  if (keptGallery.length + newGallery.length > MAX_GALLERY) {
    errors.gallery = `Galeri maksimal ${MAX_GALLERY} gambar.`;
  }

  // Slug: from the title when left blank, and unique.
  let slug = "";
  if (parsed.success) {
    slug = slugify(parsed.data.slug || parsed.data.title);
    if (!slug) {
      errors.slug = "Slug tidak boleh kosong. Gunakan huruf atau angka.";
    } else {
      const [taken] = await db
        .select({ id: projects.id })
        .from(projects)
        .where(id ? and(eq(projects.slug, slug), ne(projects.id, id)) : eq(projects.slug, slug))
        .limit(1);
      if (taken) errors.slug = "Slug ini sudah dipakai project lain.";
    }
  }

  if (!parsed.success || Object.keys(errors).length > 0) {
    return { ok: false, message: "Ada isian yang perlu diperbaiki.", errors };
  }

  // Everything is valid; now touch the disk.
  const toDelete: (string | null)[] = [...(current?.gallery ?? []).filter((g) => removeGallery.has(g))];
  let coverImage = current?.coverImage ?? null;
  if (hasFile(cover)) {
    toDelete.push(coverImage);
    coverImage = await saveUpload(cover, UPLOAD_KINDS.projectImage);
  } else if (formData.get("removeCover") === "on") {
    toDelete.push(coverImage);
    coverImage = null;
  }
  const gallery = [...keptGallery];
  for (const file of newGallery) gallery.push(await saveUpload(file, UPLOAD_KINDS.projectImage));

  const { sortOrder, ...data } = parsed.data;
  const values = { ...data, slug, coverImage, gallery };

  if (current) {
    await db
      .update(projects)
      .set({ ...values, sortOrder: sortOrder ?? current.sortOrder })
      .where(eq(projects.id, current.id));
  } else {
    // New projects go to the end unless an order was given.
    const [{ last }] = await db.select({ last: max(projects.sortOrder) }).from(projects);
    await db.insert(projects).values({ ...values, sortOrder: sortOrder ?? (last ?? 0) + 1 });
  }

  await Promise.all(toDelete.map(deleteUpload));
  updateTag(PROJECTS_TAG);

  if (!current) redirect("/admin/projects?created=1");
  return { ok: true, message: "Project tersimpan." };
}

export async function deleteProject(formData: FormData) {
  await requireUser();
  const project = await findProject(Number(formData.get("id")));
  if (project) {
    await db.delete(projects).where(eq(projects.id, project.id));
    await Promise.all([project.coverImage, ...project.gallery].map(deleteUpload));
    updateTag(PROJECTS_TAG);
  }
  redirect("/admin/projects?deleted=1");
}

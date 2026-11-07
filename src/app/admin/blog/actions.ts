"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import { findPost, POSTS_TAG } from "@/lib/posts";
import { slugify } from "@/lib/slug";
import { requireUser } from "@/lib/session";
import { checkUpload, deleteUpload, hasFile, saveUpload, UPLOAD_KINDS } from "@/lib/uploads";

const PostSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi.").max(200, "Maksimal 200 karakter."),
  slug: z.string().trim().max(80, "Maksimal 80 karakter."),
  category: z.enum(BLOG_CATEGORIES, { error: "Pilih salah satu kategori." }),
  excerpt: z
    .string()
    .max(300, "Maksimal 300 karakter.")
    .transform((v) => v.trim() || null),
  content: z.string().trim().min(1, "Isi tulisan masih kosong.").max(100_000, "Tulisan terlalu panjang."),
  tags: z
    .string()
    .transform((v) => [...new Set(v.split(/[,\n]/).map((t) => t.trim().replace(/^#/, "")).filter(Boolean))])
    .pipe(z.array(z.string().max(30)).max(10, "Maksimal 10 tag.")),
  publishedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal tidak valid."),
  isPublished: z.boolean(),
});

export type PostField = keyof z.input<typeof PostSchema> | "coverImage";
export type PostState = { ok: boolean; message: string; errors?: Partial<Record<PostField, string>> } | undefined;

const TEXT_FIELDS = ["title", "slug", "category", "excerpt", "content", "tags", "publishedOn"] as const;

export async function savePost(_prev: PostState, formData: FormData): Promise<PostState> {
  await requireUser();

  const id = Number(formData.get("id")) || null;
  const current = id ? await findPost(id) : null;
  if (id && !current) return { ok: false, message: "Tulisan tidak ditemukan. Mungkin sudah dihapus." };

  const raw: Record<string, string | boolean> = Object.fromEntries(
    TEXT_FIELDS.map((key) => [key, String(formData.get(key) ?? "")]),
  );
  raw.isPublished = formData.get("isPublished") === "on";

  const parsed = PostSchema.safeParse(raw);
  const errors: Partial<Record<PostField, string>> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) errors[issue.path[0] as PostField] ??= issue.message;
  }

  const cover = formData.get("coverImage");
  if (hasFile(cover)) {
    const problem = checkUpload(cover, UPLOAD_KINDS.postImage);
    if (problem) errors.coverImage = problem;
  }

  // Slug: from the title when left blank, and unique.
  let slug = "";
  if (parsed.success) {
    slug = slugify(parsed.data.slug || parsed.data.title);
    if (!slug) {
      errors.slug = "Slug tidak boleh kosong. Gunakan huruf atau angka.";
    } else {
      const [taken] = await db
        .select({ id: posts.id })
        .from(posts)
        .where(id ? and(eq(posts.slug, slug), ne(posts.id, id)) : eq(posts.slug, slug))
        .limit(1);
      if (taken) errors.slug = "Slug ini sudah dipakai tulisan lain.";
    }
  }

  if (!parsed.success || Object.keys(errors).length > 0) {
    return { ok: false, message: "Ada isian yang perlu diperbaiki.", errors };
  }

  let coverImage = current?.coverImage ?? null;
  let toDelete: string | null = null;
  if (hasFile(cover)) {
    toDelete = coverImage;
    coverImage = await saveUpload(cover, UPLOAD_KINDS.postImage);
  } else if (formData.get("removeCover") === "on") {
    toDelete = coverImage;
    coverImage = null;
  }

  const values = { ...parsed.data, slug, coverImage };
  if (current) {
    await db.update(posts).set(values).where(eq(posts.id, current.id));
  } else {
    await db.insert(posts).values(values);
  }

  await deleteUpload(toDelete);
  updateTag(POSTS_TAG);

  if (!current) redirect("/admin/blog?created=1");
  return { ok: true, message: "Tulisan tersimpan." };
}

export async function deletePost(formData: FormData) {
  await requireUser();
  const post = await findPost(Number(formData.get("id")));
  if (post) {
    await db.delete(posts).where(eq(posts.id, post.id));
    await deleteUpload(post.coverImage);
    updateTag(POSTS_TAG);
  }
  redirect("/admin/blog?deleted=1");
}

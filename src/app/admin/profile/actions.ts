"use server";

import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { findActiveProfile, PROFILE_TAG } from "@/lib/profile";
import { requireUser } from "@/lib/session";
import { checkUpload, deleteUpload, hasFile, saveUpload, UPLOAD_KINDS } from "@/lib/uploads";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Maksimal ${max} karakter.`)
    .transform((v) => v || null);

const optionalUrl = z
  .string()
  .trim()
  .transform((v) => v || null)
  .pipe(z.url({ protocol: /^https?$/, error: "Harus berupa URL lengkap, mis. https://…" }).nullable());

const ProfileSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi.").max(255),
  title: z.string().trim().min(1, "Jabatan wajib diisi.").max(255),
  description: optionalText(5000),
  email: z
    .string()
    .trim()
    .transform((v) => v || null)
    .pipe(z.email("Email tidak valid.").nullable()),
  phone: optionalText(50),
  location: optionalText(255),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  instagramUrl: optionalUrl,
  twitterUrl: optionalUrl,
  websiteUrl: optionalUrl,
  isAvailable: z.boolean(),
});

export type ProfileFields = keyof z.input<typeof ProfileSchema>;
type Errors = Partial<Record<ProfileFields | "avatar" | "cvFile", string>>;

export type ProfileState =
  | {
      ok: boolean;
      message: string;
      errors?: Errors;
    }
  | undefined;

const TEXT_FIELDS = [
  "name",
  "title",
  "description",
  "email",
  "phone",
  "location",
  "githubUrl",
  "linkedinUrl",
  "instagramUrl",
  "twitterUrl",
  "websiteUrl",
] as const;

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  await requireUser();

  const raw: Record<string, string | boolean> = Object.fromEntries(
    TEXT_FIELDS.map((key) => [key, String(formData.get(key) ?? "")]),
  );
  raw.isAvailable = formData.get("isAvailable") === "on";

  const parsed = ProfileSchema.safeParse(raw);
  const errors: Errors = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ProfileFields;
      errors[key] ??= issue.message;
    }
  }

  const avatarFile = formData.get("avatar");
  const cvFile = formData.get("cvFile");
  if (hasFile(avatarFile)) {
    const problem = checkUpload(avatarFile, UPLOAD_KINDS.avatar);
    if (problem) errors.avatar = problem;
  }
  if (hasFile(cvFile)) {
    const problem = checkUpload(cvFile, UPLOAD_KINDS.cv);
    if (problem) errors.cvFile = problem;
  }

  if (!parsed.success || Object.keys(errors).length > 0) {
    return { ok: false, message: "Ada isian yang perlu diperbaiki.", errors };
  }

  const current = await findActiveProfile();
  let avatar = current?.avatar ?? null;
  let cv = current?.cvFile ?? null;
  const toDelete: (string | null)[] = [];

  if (hasFile(avatarFile)) {
    toDelete.push(avatar);
    avatar = await saveUpload(avatarFile, UPLOAD_KINDS.avatar);
  } else if (formData.get("removeAvatar") === "on") {
    toDelete.push(avatar);
    avatar = null;
  }

  if (hasFile(cvFile)) {
    toDelete.push(cv);
    cv = await saveUpload(cvFile, UPLOAD_KINDS.cv);
  } else if (formData.get("removeCv") === "on") {
    toDelete.push(cv);
    cv = null;
  }

  const values = { ...parsed.data, avatar, cvFile: cv };
  if (current) {
    await db.update(profiles).set(values).where(eq(profiles.id, current.id));
  } else {
    await db.insert(profiles).values({ ...values, isActive: true });
  }

  // Old files go only after the row points at the new ones.
  await Promise.all(toDelete.map(deleteUpload));

  updateTag(PROFILE_TAG);
  return { ok: true, message: "Profil tersimpan." };
}

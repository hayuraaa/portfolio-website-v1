"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { certificates } from "@/db/schema";
import { CERTIFICATE_KINDS } from "@/lib/certificate-kinds";
import { CERTIFICATES_TAG, findCertificate } from "@/lib/certificates";
import { requireUser } from "@/lib/session";
import { checkUpload, deleteUpload, hasFile, saveUpload, UPLOAD_KINDS } from "@/lib/uploads";

const blankToNull = (v: string) => v.trim() || null;
const month = z.string().regex(/^\d{4}-\d{2}$/, "Format bulan tidak valid.");

const CertificateSchema = z
  .object({
    title: z.string().trim().min(1, "Judul wajib diisi.").max(200, "Maksimal 200 karakter."),
    issuer: z.string().trim().min(1, "Penerbit wajib diisi.").max(120, "Maksimal 120 karakter."),
    kind: z.enum(CERTIFICATE_KINDS, { error: "Pilih salah satu jenis." }),
    issuedOn: month,
    expiresOn: z.string().transform(blankToNull).pipe(month.nullable()),
    credentialId: z.string().max(120, "Maksimal 120 karakter.").transform(blankToNull),
    credentialUrl: z
      .string()
      .transform(blankToNull)
      .pipe(z.url({ protocol: /^https?$/, error: "Harus berupa URL lengkap, mis. https://…" }).nullable()),
    skills: z
      .string()
      .transform((v) => [...new Set(v.split(/[,\n]/).map((t) => t.trim()).filter(Boolean))])
      .pipe(z.array(z.string().max(40)).max(12, "Maksimal 12 skill.")),
    isPublished: z.boolean(),
  })
  .refine((c) => !c.expiresOn || c.expiresOn >= c.issuedOn, {
    path: ["expiresOn"],
    message: "Tidak boleh sebelum tanggal terbit.",
  });

export type CertificateField = keyof z.input<typeof CertificateSchema> | "image";
export type CertificateState =
  | { ok: boolean; message: string; errors?: Partial<Record<CertificateField, string>> }
  | undefined;

const TEXT_FIELDS = ["title", "issuer", "kind", "issuedOn", "expiresOn", "credentialId", "credentialUrl", "skills"] as const;

export async function saveCertificate(_prev: CertificateState, formData: FormData): Promise<CertificateState> {
  await requireUser();

  const id = Number(formData.get("id")) || null;
  const current = id ? await findCertificate(id) : null;
  if (id && !current) return { ok: false, message: "Sertifikat tidak ditemukan. Mungkin sudah dihapus." };

  const raw: Record<string, string | boolean> = Object.fromEntries(
    TEXT_FIELDS.map((key) => [key, String(formData.get(key) ?? "")]),
  );
  raw.isPublished = formData.get("isPublished") === "on";

  const parsed = CertificateSchema.safeParse(raw);
  const errors: Partial<Record<CertificateField, string>> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) errors[issue.path[0] as CertificateField] ??= issue.message;
  }

  const image = formData.get("image");
  if (hasFile(image)) {
    const problem = checkUpload(image, UPLOAD_KINDS.certificateImage);
    if (problem) errors.image = problem;
  }

  if (!parsed.success || Object.keys(errors).length > 0) {
    return { ok: false, message: "Ada isian yang perlu diperbaiki.", errors };
  }

  let stored = current?.image ?? null;
  let toDelete: string | null = null;
  if (hasFile(image)) {
    toDelete = stored;
    stored = await saveUpload(image, UPLOAD_KINDS.certificateImage);
  } else if (formData.get("removeImage") === "on") {
    toDelete = stored;
    stored = null;
  }

  const values = { ...parsed.data, image: stored };
  if (current) {
    await db.update(certificates).set(values).where(eq(certificates.id, current.id));
  } else {
    await db.insert(certificates).values(values);
  }

  await deleteUpload(toDelete);
  updateTag(CERTIFICATES_TAG);

  if (!current) redirect("/admin/certificates?created=1");
  return { ok: true, message: "Sertifikat tersimpan." };
}

export async function deleteCertificate(formData: FormData) {
  await requireUser();
  const cert = await findCertificate(Number(formData.get("id")));
  if (cert) {
    await db.delete(certificates).where(eq(certificates.id, cert.id));
    await deleteUpload(cert.image);
    updateTag(CERTIFICATES_TAG);
  }
  redirect("/admin/certificates?deleted=1");
}

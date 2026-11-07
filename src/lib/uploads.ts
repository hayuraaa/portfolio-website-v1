import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOADS = path.resolve(process.cwd(), "storage/uploads");

type Kind = { dir: string; maxBytes: number; types: Record<string, string>; label: string };

export const UPLOAD_KINDS = {
  avatar: {
    dir: "avatars",
    maxBytes: 2 * 1024 * 1024,
    types: { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" },
    label: "JPG, PNG, atau WebP, maks 2 MB",
  },
  projectImage: {
    dir: "projects",
    maxBytes: 3 * 1024 * 1024,
    types: { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" },
    label: "JPG, PNG, atau WebP, maks 3 MB per gambar",
  },
  certificateImage: {
    dir: "certificates",
    maxBytes: 3 * 1024 * 1024,
    types: { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" },
    label: "JPG, PNG, atau WebP, maks 3 MB",
  },
  postImage: {
    dir: "blog",
    maxBytes: 3 * 1024 * 1024,
    types: { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" },
    label: "JPG, PNG, atau WebP, maks 3 MB",
  },
  cv: {
    dir: "cv",
    maxBytes: 5 * 1024 * 1024,
    types: { "application/pdf": ".pdf" },
    label: "PDF, maks 5 MB",
  },
} satisfies Record<string, Kind>;

/** A real file was chosen in the form (browsers send an empty File otherwise). */
export function hasFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

/** Returns an error message, or null if the file is acceptable. */
export function checkUpload(file: File, kind: Kind) {
  if (!(file.type in kind.types)) return `Format tidak didukung. Gunakan ${kind.label}.`;
  if (file.size > kind.maxBytes) return `File terlalu besar. ${kind.label}.`;
  return null;
}

/** Saves under storage/uploads/<dir>/ with a random name; returns the stored relative path. */
export async function saveUpload(file: File, kind: Kind) {
  const ext = kind.types[file.type as keyof typeof kind.types];
  const name = `${randomBytes(16).toString("hex")}${ext}`;
  await mkdir(path.join(UPLOADS, kind.dir), { recursive: true });
  await writeFile(path.join(UPLOADS, kind.dir, name), Buffer.from(await file.arrayBuffer()));
  return `${kind.dir}/${name}`;
}

export async function deleteUpload(relative: string | null) {
  if (!relative) return;
  const file = path.resolve(UPLOADS, relative);
  if (!file.startsWith(UPLOADS + path.sep)) return;
  await rm(file, { force: true });
}

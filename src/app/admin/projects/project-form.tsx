"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { PROJECT_CATEGORIES } from "@/lib/project-categories";
import { Field, FILE_INPUT, Section } from "../form-parts";
import { saveProject, type ProjectField } from "./actions";

export type ProjectFormData = {
  id: number | null;
  values: Record<Exclude<ProjectField, "coverImage" | "gallery" | "isFeatured" | "isPublished">, string>;
  isFeatured: boolean;
  isPublished: boolean;
  coverUrl: string | null;
  gallery: { path: string; url: string }[];
};

export function ProjectForm({ initial }: { initial: ProjectFormData }) {
  const [state, action, pending] = useActionState(saveProject, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state?.errors ?? {};
  const v = initial.values;

  // Local previews, dropped once a later save succeeds (the server's images take over).
  const [coverPreview, setCoverPreview] = useState<{ url: string; after: typeof state } | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<{ urls: string[]; after: typeof state } | null>(null);
  const previewLive = (p: { after: typeof state } | null) => !!p && (p.after === state || !state?.ok);

  useEffect(() => {
    if (!state?.ok) return;
    formRef.current
      ?.querySelectorAll<HTMLInputElement>('input[type="file"], input[name^="remove"]')
      .forEach((input) => {
        if (input.type === "file") input.value = "";
        else input.checked = false;
      });
  }, [state]);

  useEffect(() => () => void (coverPreview && URL.revokeObjectURL(coverPreview.url)), [coverPreview]);
  useEffect(() => () => galleryPreview?.urls.forEach((u) => URL.revokeObjectURL(u)), [galleryPreview]);

  const shownCover = previewLive(coverPreview) ? coverPreview!.url : initial.coverUrl;

  return (
    <form
      ref={formRef}
      // startTransition keeps typed values when validation fails (a plain form action resets inputs).
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
    >
      {initial.id && <input type="hidden" name="id" value={initial.id} />}

      <Section title="Isi" note="Ringkasan tampil di kartu. Detail tampil saat kartu dibuka.">
        <Field label="Judul" error={errors.title}>
          <input name="title" defaultValue={v.title} required className="field" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Kategori" error={errors.category}>
            <select name="category" defaultValue={v.category} required className="field">
              <option value="" disabled>
                Pilih kategori…
              </option>
              {PROJECT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Slug" hint="Untuk link /projects#slug. Kosongkan agar dibuat dari judul." error={errors.slug}>
            <input name="slug" defaultValue={v.slug} className="field font-mono text-sm" />
          </Field>
        </div>
        <Field label="Ringkasan" hint="1–2 kalimat." error={errors.summary}>
          <textarea name="summary" rows={3} defaultValue={v.summary} required className="field resize-y" />
        </Field>
        <Field label="Detail" hint="Opsional. Pisahkan paragraf dengan baris baru." error={errors.details}>
          <textarea name="details" rows={7} defaultValue={v.details} className="field resize-y" />
        </Field>
      </Section>

      <Section title="Teknologi & tautan">
        <Field label="Teknologi" hint="Pisahkan dengan koma, mis. Laravel, MySQL, Python" error={errors.technologies}>
          <input name="technologies" defaultValue={v.technologies} className="field" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Repository" error={errors.repoUrl}>
            <input name="repoUrl" type="url" defaultValue={v.repoUrl} placeholder="https://github.com/…" className="field" />
          </Field>
          <Field label="Demo" error={errors.demoUrl}>
            <input name="demoUrl" type="url" defaultValue={v.demoUrl} placeholder="https://…" className="field" />
          </Field>
          <Field label="Publikasi" hint="Link jurnal, artikel, atau DOI." error={errors.publicationUrl}>
            <input
              name="publicationUrl"
              type="url"
              defaultValue={v.publicationUrl}
              placeholder="https://doi.org/…"
              className="field"
            />
          </Field>
          <Field label="Selesai" hint="Bulan dan tahun." error={errors.completedOn}>
            <input name="completedOn" type="month" defaultValue={v.completedOn} className="field" />
          </Field>
        </div>
      </Section>

      <Section title="Gambar" note="JPG, PNG, atau WebP, maks 3 MB per gambar.">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="aspect-[16/9] w-full shrink-0 overflow-hidden rounded-xl border border-rule bg-paper-sunk sm:w-56">
            {shownCover ? (
              // eslint-disable-next-line @next/next/no-img-element -- local preview or /media file
              <img src={shownCover} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-xs text-ink-faint">Belum ada sampul</div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Field label="Gambar sampul" hint="Tampil di kartu, rasio 16:9 paling pas." error={errors.coverImage}>
              <input
                name="coverImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setCoverPreview(file ? { url: URL.createObjectURL(file), after: state } : null);
                }}
                className={FILE_INPUT}
              />
            </Field>
            {initial.coverUrl && (
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input name="removeCover" type="checkbox" className="size-4" /> Hapus sampul saat ini
              </label>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Field label="Galeri" hint="Tampil di detail project. Maksimal 8 gambar." error={errors.gallery}>
            <input
              name="gallery"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const files = [...(e.target.files ?? [])];
                setGalleryPreview(files.length ? { urls: files.map((f) => URL.createObjectURL(f)), after: state } : null);
              }}
              className={FILE_INPUT}
            />
          </Field>

          {(initial.gallery.length > 0 || previewLive(galleryPreview)) && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {initial.gallery.map((img) => (
                <li key={img.path} className="space-y-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element -- /media file */}
                  <img src={img.url} alt="" className="aspect-[16/10] w-full rounded-lg border border-rule object-cover" />
                  <label className="flex items-center gap-1.5 text-xs text-ink-soft">
                    <input name="removeGallery" value={img.path} type="checkbox" className="size-3.5" /> Hapus
                  </label>
                </li>
              ))}
              {previewLive(galleryPreview) &&
                galleryPreview!.urls.map((url) => (
                  <li key={url} className="space-y-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element -- local preview */}
                    <img src={url} alt="" className="aspect-[16/10] w-full rounded-lg border border-dashed border-ink-faint object-cover" />
                    <span className="text-xs text-ink-faint">Baru, belum disimpan</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </Section>

      <Section title="Tampilan">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-rule bg-paper-raised p-4">
            <input name="isPublished" type="checkbox" defaultChecked={initial.isPublished} className="mt-0.5 size-4" />
            <span>
              <span className="block text-sm font-medium">Tayangkan</span>
              <span className="block text-xs text-ink-faint">Kalau mati, project disimpan sebagai draft.</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-rule bg-paper-raised p-4">
            <input name="isFeatured" type="checkbox" defaultChecked={initial.isFeatured} className="mt-0.5 size-4" />
            <span>
              <span className="block text-sm font-medium">Tandai unggulan</span>
              <span className="block text-xs text-ink-faint">Dapat label “Featured” di kartu.</span>
            </span>
          </label>
        </div>
        <div className="max-w-40">
          <Field label="Urutan" hint="Angka kecil tampil duluan." error={errors.sortOrder}>
            <input name="sortOrder" type="number" min={0} defaultValue={v.sortOrder} className="field" />
          </Field>
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-rule bg-paper-raised/95 backdrop-blur-sm md:left-64">
        <div className="flex items-center justify-end gap-4 px-4 py-3 sm:px-8 lg:px-12">
          {state && (
            <p role="status" className={`mr-auto text-sm ${state.ok ? "text-ok" : "text-accent"}`}>
              {state.message}
            </p>
          )}
          <button type="submit" disabled={pending} className="btn-primary">
            {pending ? "Menyimpan…" : initial.id ? "Simpan perubahan" : "Tambah project"}
          </button>
        </div>
      </div>
    </form>
  );
}

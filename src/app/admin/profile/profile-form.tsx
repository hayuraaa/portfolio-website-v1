"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { Field, FILE_INPUT, Section } from "../form-parts";
import { updateProfile, type ProfileFields } from "./actions";

export type ProfileFormData = Record<Exclude<ProfileFields, "isAvailable">, string> & {
  isAvailable: boolean;
  avatarUrl: string | null;
  cvUrl: string | null;
};

export function ProfileForm({ initial }: { initial: ProfileFormData }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  // Remembers which save result the preview was picked after, so a later successful save
  // (upload or removal) hands the avatar back to the server's URL.
  const [preview, setPreview] = useState<{ url: string; after: typeof state } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state?.errors ?? {};

  // After a successful save the server sends fresh data; clear chosen files so they aren't re-sent.
  useEffect(() => {
    if (!state?.ok) return;
    formRef.current
      ?.querySelectorAll<HTMLInputElement>('input[type="file"], input[name^="remove"]')
      .forEach((input) => {
        if (input.type === "file") input.value = "";
        else input.checked = false;
      });
  }, [state]);

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview.url)), [preview]);

  const previewIsCurrent = preview && (preview.after === state || !state?.ok);
  const shownAvatar = previewIsCurrent ? preview.url : initial.avatarUrl;

  return (
    <form
      ref={formRef}
      // Submitting through startTransition keeps typed values when validation fails
      // (a plain form action would reset the inputs).
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
      className="pb-28"
    >
      <Section title="Identitas" note="Tampil di bagian atas halaman utama.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama" error={errors.name}>
            <input name="name" defaultValue={initial.name} required className="field" />
          </Field>
          <Field label="Jabatan" hint="Diketik ulang di bawah nama." error={errors.title}>
            <input name="title" defaultValue={initial.title} required className="field" />
          </Field>
          <Field label="Lokasi" error={errors.location}>
            <input name="location" defaultValue={initial.location} className="field" />
          </Field>
          <Field label="Email" error={errors.email}>
            <input name="email" type="email" defaultValue={initial.email} className="field" />
          </Field>
          <Field label="Telepon" error={errors.phone}>
            <input name="phone" type="tel" defaultValue={initial.phone} className="field" />
          </Field>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-rule bg-paper-raised p-4">
          <input
            name="isAvailable"
            type="checkbox"
            defaultChecked={initial.isAvailable}
            className="mt-0.5 size-4 accent-[var(--ok)]"
          />
          <span>
            <span className="block text-sm font-medium">Tampilkan badge “Available for hire”</span>
            <span className="block text-xs text-ink-faint">Matikan kalau sedang tidak menerima pekerjaan.</span>
          </span>
        </label>
      </Section>

      <Section title="Tentang" note="Tampil di kartu halaman utama.">
        <Field label="Deskripsi" error={errors.description}>
          <textarea name="description" rows={5} defaultValue={initial.description} className="field resize-y" />
        </Field>
      </Section>

      <Section title="Berkas">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="size-24 shrink-0 overflow-hidden rounded-full border border-rule bg-paper-sunk">
            {shownAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element -- local preview or /media file
              <img src={shownAvatar} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-xs text-ink-faint">Belum ada</div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Field label="Foto profil" hint="JPG, PNG, atau WebP, maks 2 MB. Sebaiknya persegi." error={errors.avatar}>
              <input
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setPreview(file ? { url: URL.createObjectURL(file), after: state } : null);
                }}
                className={FILE_INPUT}
              />
            </Field>
            {initial.avatarUrl && (
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input name="removeAvatar" type="checkbox" className="size-4" /> Hapus foto saat ini
              </label>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Field label="CV" hint="PDF, maks 5 MB." error={errors.cvFile}>
            <input
              name="cvFile"
              type="file"
              accept="application/pdf"
              className={FILE_INPUT}
            />
          </Field>
          {initial.cvUrl ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-soft">
              <a href={initial.cvUrl} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-ink">
                Lihat CV saat ini
              </a>
              <label className="flex items-center gap-2">
                <input name="removeCv" type="checkbox" className="size-4" /> Hapus CV
              </label>
            </div>
          ) : (
            <p className="text-sm text-ink-faint">Belum ada CV. Tombol Download CV di situs akan nonaktif.</p>
          )}
        </div>
      </Section>

      <Section title="Tautan" note="Kosongkan yang tidak dipakai.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="GitHub" error={errors.githubUrl}>
            <input name="githubUrl" type="url" defaultValue={initial.githubUrl} placeholder="https://github.com/…" className="field" />
          </Field>
          <Field label="LinkedIn" error={errors.linkedinUrl}>
            <input name="linkedinUrl" type="url" defaultValue={initial.linkedinUrl} placeholder="https://linkedin.com/in/…" className="field" />
          </Field>
          <Field label="Instagram" error={errors.instagramUrl}>
            <input name="instagramUrl" type="url" defaultValue={initial.instagramUrl} placeholder="https://instagram.com/…" className="field" />
          </Field>
          <Field label="X / Twitter" error={errors.twitterUrl}>
            <input name="twitterUrl" type="url" defaultValue={initial.twitterUrl} placeholder="https://x.com/…" className="field" />
          </Field>
          <Field label="Website" error={errors.websiteUrl}>
            <input name="websiteUrl" type="url" defaultValue={initial.websiteUrl} placeholder="https://…" className="field" />
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
            {pending ? "Menyimpan…" : "Simpan perubahan"}
          </button>
        </div>
      </div>
    </form>
  );
}

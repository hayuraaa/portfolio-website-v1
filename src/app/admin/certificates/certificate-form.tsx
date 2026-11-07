"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { CERTIFICATE_KINDS } from "@/lib/certificate-kinds";
import { Field, FILE_INPUT, Section } from "../form-parts";
import { saveCertificate, type CertificateField } from "./actions";

export type CertificateFormData = {
  id: number | null;
  values: Record<Exclude<CertificateField, "image" | "isPublished">, string>;
  isPublished: boolean;
  imageUrl: string | null;
};

export function CertificateForm({ initial }: { initial: CertificateFormData }) {
  const [state, action, pending] = useActionState(saveCertificate, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state?.errors ?? {};
  const v = initial.values;

  // Local preview, dropped once a later save succeeds (the server's image takes over).
  const [preview, setPreview] = useState<{ url: string; after: typeof state } | null>(null);
  const shownImage = preview && (preview.after === state || !state?.ok) ? preview.url : initial.imageUrl;

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

      <Section title="Sertifikat">
        <Field label="Judul" error={errors.title}>
          <input name="title" defaultValue={v.title} required className="field" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Penerbit" hint="Mis. Dicoding Indonesia, Google, AWS." error={errors.issuer}>
            <input name="issuer" defaultValue={v.issuer} required className="field" />
          </Field>
          <Field label="Jenis" hint="Course: kelas. Certification: ujian resmi. Award: lomba/penghargaan." error={errors.kind}>
            <select name="kind" defaultValue={v.kind} required className="field">
              <option value="" disabled>
                Pilih jenis…
              </option>
              {CERTIFICATE_KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Terbit" error={errors.issuedOn}>
            <input name="issuedOn" type="month" defaultValue={v.issuedOn} required className="field" />
          </Field>
          <Field label="Berlaku sampai" hint="Kosongkan kalau tidak kedaluwarsa." error={errors.expiresOn}>
            <input name="expiresOn" type="month" defaultValue={v.expiresOn} className="field" />
          </Field>
        </div>
        <Field label="Skill" hint="Pisahkan dengan koma, mis. Python, TensorFlow" error={errors.skills}>
          <input name="skills" defaultValue={v.skills} className="field" />
        </Field>
      </Section>

      <Section title="Verifikasi" note="Opsional. Tampil sebagai tombol Verify di kartu.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Link verifikasi" error={errors.credentialUrl}>
            <input name="credentialUrl" type="url" defaultValue={v.credentialUrl} placeholder="https://…" className="field" />
          </Field>
          <Field label="ID kredensial" error={errors.credentialId}>
            <input name="credentialId" defaultValue={v.credentialId} className="field font-mono text-sm" />
          </Field>
        </div>
      </Section>

      <Section title="Gambar" note="Foto atau scan sertifikat. JPG, PNG, atau WebP, maks 3 MB.">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="aspect-[1.414] w-full shrink-0 overflow-hidden rounded-xl border border-rule bg-paper-sunk sm:w-56">
            {shownImage ? (
              // eslint-disable-next-line @next/next/no-img-element -- local preview or /media file
              <img src={shownImage} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-xs text-ink-faint">Belum ada gambar</div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Field label="Gambar sertifikat" error={errors.image}>
              <input
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setPreview(file ? { url: URL.createObjectURL(file), after: state } : null);
                }}
                className={FILE_INPUT}
              />
            </Field>
            {initial.imageUrl && (
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input name="removeImage" type="checkbox" className="size-4" /> Hapus gambar saat ini
              </label>
            )}
          </div>
        </div>
      </Section>

      <Section title="Tampilan">
        <label className="flex max-w-md cursor-pointer items-start gap-3 rounded-xl border border-rule bg-paper-raised p-4">
          <input name="isPublished" type="checkbox" defaultChecked={initial.isPublished} className="mt-0.5 size-4" />
          <span>
            <span className="block text-sm font-medium">Tayangkan</span>
            <span className="block text-xs text-ink-faint">Kalau mati, disimpan sebagai draft. Urutan otomatis dari tanggal terbit terbaru.</span>
          </span>
        </label>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-rule bg-paper-raised/95 backdrop-blur-sm md:left-64">
        <div className="flex items-center justify-end gap-4 px-4 py-3 sm:px-8 lg:px-12">
          {state && (
            <p role="status" className={`mr-auto text-sm ${state.ok ? "text-ok" : "text-accent"}`}>
              {state.message}
            </p>
          )}
          <button type="submit" disabled={pending} className="btn-primary">
            {pending ? "Menyimpan…" : initial.id ? "Simpan perubahan" : "Tambah sertifikat"}
          </button>
        </div>
      </div>
    </form>
  );
}

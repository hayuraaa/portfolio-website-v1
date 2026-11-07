"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/markdown";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import { Field, FILE_INPUT, Section } from "../form-parts";
import { savePost, type PostField } from "./actions";

export type PostFormData = {
  id: number | null;
  values: Record<Exclude<PostField, "coverImage" | "isPublished">, string>;
  isPublished: boolean;
  coverUrl: string | null;
};

export function PostForm({ initial }: { initial: PostFormData }) {
  const [state, action, pending] = useActionState(savePost, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state?.errors ?? {};
  const v = initial.values;

  const [content, setContent] = useState(v.content);
  const [tab, setTab] = useState<"write" | "preview">("write");

  // Local cover preview, dropped once a later save succeeds (the server's image takes over).
  const [preview, setPreview] = useState<{ url: string; after: typeof state } | null>(null);
  const shownCover = preview && (preview.after === state || !state?.ok) ? preview.url : initial.coverUrl;

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

  const tabClass = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm transition-colors ${active ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"}`;

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

      <Section title="Tulisan">
        <Field label="Judul" error={errors.title}>
          <input name="title" defaultValue={v.title} required className="field font-serif text-xl" />
        </Field>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Isi</span>
            <div role="tablist" className="flex gap-1 rounded-xl border border-rule bg-paper-raised p-1">
              <button type="button" role="tab" aria-selected={tab === "write"} onClick={() => setTab("write")} className={tabClass(tab === "write")}>
                Tulis
              </button>
              <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")} className={tabClass(tab === "preview")}>
                Pratinjau
              </button>
            </div>
          </div>
          {/* The textarea stays mounted (just hidden) so its value is always submitted. */}
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className={`field resize-y font-mono text-sm leading-relaxed ${tab === "write" ? "" : "hidden"}`}
            placeholder={"Tulis dengan Markdown.\n\n## Subjudul\n\nParagraf biasa. **Tebal**, *miring*, [link](https://…)\n\n- daftar\n- poin\n\n```\nkode\n```"}
          />
          {tab === "preview" && (
            <div className="min-h-[24rem] rounded-xl border border-rule bg-paper px-6 py-5">
              {content.trim() ? <Markdown>{content}</Markdown> : <p className="text-sm text-ink-faint">Belum ada isi.</p>}
            </div>
          )}
          {errors.content ? (
            <p className="mt-1.5 text-xs text-accent">{errors.content}</p>
          ) : (
            <p className="mt-1.5 text-xs text-ink-faint">
              Markdown: <code>## judul</code>, <code>**tebal**</code>, <code>[teks](url)</code>, <code>- daftar</code>. Baris kosong
              memisahkan paragraf.
            </p>
          )}
        </div>

        <Field label="Ringkasan" hint="Opsional. Kosongkan agar diambil dari awal tulisan." error={errors.excerpt}>
          <textarea name="excerpt" rows={2} defaultValue={v.excerpt} className="field resize-y" />
        </Field>
      </Section>

      <Section title="Detail">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Kategori" error={errors.category}>
            <select name="category" defaultValue={v.category} required className="field">
              <option value="" disabled>
                Pilih kategori…
              </option>
              {BLOG_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tanggal" hint="Tanggal yang tampil di tulisan." error={errors.publishedOn}>
            <input name="publishedOn" type="date" defaultValue={v.publishedOn} required className="field" />
          </Field>
          <Field label="Tag" hint="Pisahkan dengan koma, mis. laravel, catatan" error={errors.tags}>
            <input name="tags" defaultValue={v.tags} className="field" />
          </Field>
          <Field label="Slug" hint="Alamat /blog/slug. Kosongkan agar dibuat dari judul." error={errors.slug}>
            <input name="slug" defaultValue={v.slug} className="field font-mono text-sm" />
          </Field>
        </div>
      </Section>

      <Section title="Gambar sampul" note="Opsional. JPG, PNG, atau WebP, maks 3 MB.">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="aspect-[16/9] w-full shrink-0 overflow-hidden rounded-xl border border-rule bg-paper-sunk sm:w-56">
            {shownCover ? (
              // eslint-disable-next-line @next/next/no-img-element -- local preview or /media file
              <img src={shownCover} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-xs text-ink-faint">Tanpa sampul</div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Field label="File gambar" error={errors.coverImage}>
              <input
                name="coverImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setPreview(file ? { url: URL.createObjectURL(file), after: state } : null);
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
      </Section>

      <Section title="Tampilan">
        <label className="flex max-w-md cursor-pointer items-start gap-3 rounded-xl border border-rule bg-paper-raised p-4">
          <input name="isPublished" type="checkbox" defaultChecked={initial.isPublished} className="mt-0.5 size-4" />
          <span>
            <span className="block text-sm font-medium">Terbitkan</span>
            <span className="block text-xs text-ink-faint">Kalau mati, tulisan disimpan sebagai draft dan tidak tampil di blog.</span>
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
            {pending ? "Menyimpan…" : initial.id ? "Simpan perubahan" : "Simpan tulisan"}
          </button>
        </div>
      </div>
    </form>
  );
}

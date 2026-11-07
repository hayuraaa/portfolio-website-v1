"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink disabled:opacity-60"
    >
      {pending ? "Menghapus…" : "Ya, hapus permanen"}
    </button>
  );
}

/** Two-step delete: no browser confirm() dialog. */
export function DeleteItem({
  id,
  title,
  noun,
  note,
  action,
}: {
  id: number;
  title: string;
  /** e.g. "project", "sertifikat" */
  noun: string;
  note: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const [asking, setAsking] = useState(false);

  return (
    <section className="mt-4 rounded-2xl border border-rule p-5">
      <h2 className="font-medium">Hapus {noun}</h2>
      {!asking ? (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-faint">{note}</p>
          <button
            type="button"
            onClick={() => setAsking(true)}
            className="rounded-lg border border-accent/40 px-4 py-2 text-sm text-accent hover:bg-accent/10"
          >
            Hapus…
          </button>
        </div>
      ) : (
        <form action={action} className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <input type="hidden" name="id" value={id} />
          <p className="text-sm">
            Hapus <strong className="font-medium">{title}</strong>?
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setAsking(false)} className="btn-secondary px-4! py-2! text-sm">
              Batal
            </button>
            <ConfirmButton />
          </div>
        </form>
      )}
    </section>
  );
}

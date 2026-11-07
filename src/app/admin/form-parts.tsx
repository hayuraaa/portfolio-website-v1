import type { ReactNode } from "react";

export const FILE_INPUT =
  "text-sm file:mr-3 file:rounded-lg file:border file:border-rule file:bg-paper-raised file:px-3 file:py-1.5 file:text-ink";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error ? (
        <span className="text-xs text-accent">{error}</span>
      ) : (
        hint && <span className="text-xs text-ink-faint">{hint}</span>
      )}
    </label>
  );
}

export function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="grid gap-x-10 gap-y-5 border-t border-rule py-8 lg:grid-cols-[13rem_1fr]">
      <div>
        <h2 className="font-medium">{title}</h2>
        {note && <p className="mt-1 text-sm text-ink-faint">{note}</p>}
      </div>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

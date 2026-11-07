"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { sendMessage } from "./actions";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error && <span className="text-xs text-accent">{error}</span>}
    </label>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, undefined);
  const [startedAt, setStartedAt] = useState(0);
  const errors = state && !state.ok ? (state.errors ?? {}) : {};

  // When the form became usable; the server rejects instant submissions.
  useEffect(() => {
    const timer = setTimeout(() => setStartedAt(Date.now()), 0);
    return () => clearTimeout(timer);
  }, []);

  if (state?.ok) {
    return (
      <div role="status" className="flex min-h-80 flex-col items-center justify-center text-center">
        <p className="font-serif text-3xl font-medium">Thanks, message received.</p>
        <p className="mt-3 max-w-sm text-ink-soft">I&apos;ll read it and reply to the email you gave.</p>
      </div>
    );
  }

  return (
    <form
      // startTransition keeps typed values when validation fails (a plain form action resets inputs).
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
      className="flex flex-col gap-5"
      noValidate
    >
      <input type="hidden" name="startedAt" value={startedAt} />
      {/* Honeypot: hidden from people and screen readers; bots tend to fill every field. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name}>
          <input name="name" autoComplete="name" required maxLength={100} className="field" />
        </Field>
        <Field label="Email" error={errors.email}>
          <input name="email" type="email" autoComplete="email" required maxLength={200} className="field" />
        </Field>
      </div>
      <Field label="Subject (optional)" error={errors.subject}>
        <input name="subject" maxLength={150} className="field" />
      </Field>
      <Field label="Message" error={errors.body}>
        <textarea name="body" rows={6} required maxLength={5000} className="field resize-y" />
      </Field>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="btn-primary px-6! py-3!">
          {pending ? "Sending…" : "Send message"}
          {!pending && <ArrowRightIcon className="size-4" />}
        </button>
        {state && !state.ok && (
          <p role="alert" className="text-sm text-accent">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

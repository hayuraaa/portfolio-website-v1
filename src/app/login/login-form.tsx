"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state?.email}
          className="field"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field"
        />
      </label>

      {state?.error && (
        <p role="alert" className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary mt-1">
        {pending ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}

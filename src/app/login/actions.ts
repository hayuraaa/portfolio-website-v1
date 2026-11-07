"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, deleteSession } from "@/lib/session";

export type LoginState = { error?: string; email?: string } | undefined;

const LoginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1),
});

// Simple in-memory brake on password guessing: 5 misses per email per 15 minutes.
const MAX_FAILS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; since: number }>();

function isLocked(email: string) {
  const entry = failures.get(email);
  if (!entry) return false;
  if (Date.now() - entry.since > WINDOW_MS) {
    failures.delete(email);
    return false;
  }
  return entry.count >= MAX_FAILS;
}

function recordFailure(email: string) {
  const entry = failures.get(email);
  if (!entry || Date.now() - entry.since > WINDOW_MS) {
    failures.set(email, { count: 1, since: Date.now() });
  } else {
    entry.count++;
  }
}

// Hash compared against when the email doesn't exist, so timing doesn't reveal which emails are registered.
const dummyHash = hashPassword("not-a-real-password");

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const email = String(formData.get("email") ?? "");
  if (!parsed.success) {
    return { error: "Isi email dan password dengan benar.", email };
  }

  if (isLocked(parsed.data.email)) {
    return { error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit.", email };
  }

  const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
  const ok = await verifyPassword(parsed.data.password, user?.passwordHash ?? (await dummyHash));

  if (!user || !ok) {
    recordFailure(parsed.data.email);
    return { error: "Email atau password salah.", email };
  }

  failures.delete(parsed.data.email);
  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

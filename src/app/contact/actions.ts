"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { messages } from "@/db/schema";

export type ContactState =
  | { ok: true }
  | { ok: false; message: string; errors?: Partial<Record<"name" | "email" | "subject" | "body", string>> }
  | undefined;

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "That name is too long."),
  email: z.email("Please enter a valid email.").trim().max(200),
  subject: z
    .string()
    .trim()
    .max(150, "Keep the subject under 150 characters.")
    .transform((v) => v || null),
  body: z.string().trim().min(10, "A little more detail, please (10+ characters).").max(5000, "Keep it under 5,000 characters."),
});

// In-memory brake: 3 messages per IP per 10 minutes. Enough for one small server.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const recent = new Map<string, number[]>();

function allow(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    recent.set(ip, hits);
    return false;
  }
  hits.push(now);
  recent.set(ip, hits);
  return true;
}

/** Humans take a few seconds to fill the form; scripts don't. */
const MIN_FILL_MS = 3000;

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: a field people never see. Bots fill it; pretend all went well.
  if (String(formData.get("website") ?? "") !== "") return { ok: true };

  const startedAt = Number(formData.get("startedAt"));
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return { ok: false, message: "That was quick. Please wait a moment and send again." };
  }

  const parsed = ContactSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    body: String(formData.get("body") ?? ""),
  });
  if (!parsed.success) {
    const errors: NonNullable<Extract<ContactState, { ok: false }>["errors"]> = {};
    for (const issue of parsed.error.issues) errors[issue.path[0] as keyof typeof errors] ??= issue.message;
    return { ok: false, message: "Please check the highlighted fields.", errors };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!allow(ip)) {
    return { ok: false, message: "Too many messages from here. Please try again in a few minutes." };
  }

  await db.insert(messages).values(parsed.data);
  return { ok: true };
}

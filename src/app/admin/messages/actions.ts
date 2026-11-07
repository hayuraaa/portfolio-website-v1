"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { requireUser } from "@/lib/session";

async function setRead(id: number, isRead: boolean) {
  await requireUser();
  await db.update(messages).set({ isRead }).where(eq(messages.id, id));
  // Refresh the sidebar badge and the inbox list.
  revalidatePath("/admin", "layout");
}

export async function markRead(id: number) {
  await setRead(id, true);
}

export async function markUnread(formData: FormData) {
  await setRead(Number(formData.get("id")), false);
  redirect("/admin/messages");
}

export async function deleteMessage(formData: FormData) {
  await requireUser();
  await db.delete(messages).where(eq(messages.id, Number(formData.get("id"))));
  revalidatePath("/admin", "layout");
  redirect("/admin/messages?deleted=1");
}

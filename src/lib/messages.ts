import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { messages, type Message } from "@/db/schema";

// Admin-only reads; never cached.

export async function listMessages(): Promise<Message[]> {
  return db.select().from(messages).orderBy(desc(messages.createdAt), desc(messages.id));
}

export async function findMessage(id: number): Promise<Message | null> {
  const [row] = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
  return row ?? null;
}

export async function countUnread() {
  const [row] = await db.select({ n: count() }).from(messages).where(eq(messages.isRead, false));
  return row?.n ?? 0;
}

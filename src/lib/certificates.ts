import { cacheLife, cacheTag } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { certificates, type Certificate } from "@/db/schema";

export const CERTIFICATES_TAG = "certificates";

const newestFirst = [desc(certificates.issuedOn), desc(certificates.id)];

/** Published certificates for the public site. Invalidate with updateTag(CERTIFICATES_TAG). */
export async function getPublishedCertificates(): Promise<Certificate[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CERTIFICATES_TAG);
  return db.select().from(certificates).where(eq(certificates.isPublished, true)).orderBy(...newestFirst);
}

/** Uncached reads, for the admin panel. */
export async function listAllCertificates(): Promise<Certificate[]> {
  return db.select().from(certificates).orderBy(...newestFirst);
}

export async function findCertificate(id: number): Promise<Certificate | null> {
  const [row] = await db.select().from(certificates).where(eq(certificates.id, id)).limit(1);
  return row ?? null;
}

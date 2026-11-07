import { cacheLife, cacheTag } from "next/cache";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { certificates, projects } from "@/db/schema";
import { CERTIFICATES_TAG } from "./certificates";
import { PROJECTS_TAG } from "./projects";

/** Public counts for the contact page; refreshed whenever projects or certificates change. */
export async function getPublicCounts() {
  "use cache";
  cacheLife("hours");
  cacheTag(PROJECTS_TAG, CERTIFICATES_TAG);
  const [[p], [c]] = await Promise.all([
    db.select({ n: count() }).from(projects).where(eq(projects.isPublished, true)),
    db.select({ n: count() }).from(certificates).where(eq(certificates.isPublished, true)),
  ]);
  return { projects: p?.n ?? 0, certificates: c?.n ?? 0 };
}

import { cacheLife, cacheTag } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects, type Project } from "@/db/schema";

export const PROJECTS_TAG = "projects";

const listingOrder = [asc(projects.sortOrder), desc(projects.completedOn), desc(projects.id)];

/** Published projects for the public site. Invalidate with updateTag(PROJECTS_TAG). */
export async function getPublishedProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(PROJECTS_TAG);
  return db.select().from(projects).where(eq(projects.isPublished, true)).orderBy(...listingOrder);
}

/** Uncached reads, for the admin panel. */
export async function listAllProjects(): Promise<Project[]> {
  return db.select().from(projects).orderBy(...listingOrder);
}

export async function findProject(id: number): Promise<Project | null> {
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return project ?? null;
}

import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles, type Profile } from "@/db/schema";

export const PROFILE_TAG = "profile";

/** Uncached read, for the admin panel. */
export async function findActiveProfile(): Promise<Profile | null> {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.isActive, true))
    .limit(1);
  return profile ?? null;
}

/** The profile shown on the public site. Invalidate with updateTag(PROFILE_TAG) after admin edits. */
export async function getActiveProfile(): Promise<Profile | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(PROFILE_TAG);
  return findActiveProfile();
}

export function mediaUrl(file: string | null) {
  return file ? `/media/${file}` : null;
}

import { cacheLife, cacheTag } from "next/cache";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts, type Post } from "@/db/schema";

export const POSTS_TAG = "posts";

const newestFirst = [desc(posts.publishedOn), desc(posts.id)];

/** Published posts for the public site. Invalidate with updateTag(POSTS_TAG). */
export async function getPublishedPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(POSTS_TAG);
  return db.select().from(posts).where(eq(posts.isPublished, true)).orderBy(...newestFirst);
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(POSTS_TAG);
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.isPublished, true)))
    .limit(1);
  return post ?? null;
}

/** Uncached reads, for the admin panel. */
export async function listAllPosts(): Promise<Post[]> {
  return db.select().from(posts).orderBy(...newestFirst);
}

export async function findPost(id: number): Promise<Post | null> {
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return post ?? null;
}

/** Markdown reduced to plain text, good enough for excerpts and word counts. */
export function plainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*(?:[-*+]|\d+\.|>)\s+/gm, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function readingMinutes(markdown: string) {
  const words = plainText(markdown).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** The stored excerpt, or the opening of the post cut at a word boundary. */
export function excerptOf(post: Pick<Post, "excerpt" | "content">, max = 180) {
  if (post.excerpt) return post.excerpt;
  const text = plainText(post.content);
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(" ", max)).replace(/[,.;:!?-]+$/, "")}…`;
}

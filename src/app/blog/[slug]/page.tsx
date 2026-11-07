import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { CSSProperties } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { Markdown } from "@/components/markdown";
import { SiteNav } from "@/components/site-nav";
import { formatDay } from "@/lib/format";
import { excerptOf, getPublishedPost, getPublishedPosts, readingMinutes } from "@/lib/posts";
import { mediaUrl } from "@/lib/profile";

// Wait for the post before responding, so a missing slug is a real 404 rather than a streamed one.
// The data comes from cache, so this stays fast.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Not found" };

  const cover = mediaUrl(post.coverImage);
  return {
    title: post.title,
    description: excerptOf(post, 160),
    openGraph: {
      type: "article",
      title: post.title,
      description: excerptOf(post, 160),
      publishedTime: post.publishedOn,
      tags: post.tags,
      ...(cover ? { images: [cover] } : {}),
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  await connection();
  const { slug } = await params;
  const [post, all] = await Promise.all([getPublishedPost(slug), getPublishedPosts()]);
  if (!post) notFound();

  // `all` is newest first: the previous index is the newer post.
  const index = all.findIndex((p) => p.id === post.id);
  const newer = index > 0 ? all[index - 1] : null;
  const older = index >= 0 && index < all.length - 1 ? all[index + 1] : null;
  const cover = mediaUrl(post.coverImage);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div aria-hidden className="paper-grid pointer-events-none absolute inset-0 h-[50vh]" />

      <SiteNav />

      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-5 pt-14 pb-24 sm:pt-20">
        <article>
          <header className="rise">
            <Link href="/blog" className="text-sm text-ink-soft hover:text-ink">
              ← All posts
            </Link>
            <p className="mt-8 font-mono text-xs text-ink-faint">
              {post.category} · <time dateTime={post.publishedOn}>{formatDay(post.publishedOn)}</time> ·{" "}
              {readingMinutes(post.content)} min read
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight font-medium tracking-tight text-balance sm:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && <p className="mt-5 text-xl leading-relaxed text-ink-soft">{post.excerpt}</p>}
          </header>

          {cover && (
            // eslint-disable-next-line @next/next/no-img-element -- served from /media
            <img src={cover} alt="" className="rise mt-10 w-full rounded-2xl border border-rule" style={{ "--d": "100ms" } as CSSProperties} />
          )}

          <div className="rise mt-10" style={{ "--d": "150ms" } as CSSProperties}>
            <Markdown>{post.content}</Markdown>
          </div>

          {post.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2 border-t border-rule pt-6">
              {post.tags.map((t) => (
                <li key={t} className="rounded-md bg-paper-sunk px-2.5 py-1 font-mono text-xs text-ink-soft">
                  #{t}
                </li>
              ))}
            </ul>
          )}
        </article>

        {(newer || older) && (
          <nav aria-label="More posts" className="mt-12 grid gap-4 sm:grid-cols-2">
            {older ? (
              <Link href={`/blog/${older.slug}`} className="group rounded-2xl border border-rule bg-paper-raised p-5 hover:border-ink-soft">
                <p className="font-mono text-xs text-ink-faint">← Older</p>
                <p className="mt-2 font-serif text-lg leading-snug group-hover:text-accent">{older.title}</p>
              </Link>
            ) : (
              <span />
            )}
            {newer && (
              <Link
                href={`/blog/${newer.slug}`}
                className="group rounded-2xl border border-rule bg-paper-raised p-5 text-right hover:border-ink-soft"
              >
                <p className="inline-flex items-center gap-1 font-mono text-xs text-ink-faint">
                  Newer <ArrowRightIcon className="size-3" />
                </p>
                <p className="mt-2 font-serif text-lg leading-snug group-hover:text-accent">{newer.title}</p>
              </Link>
            )}
          </nav>
        )}
      </main>
    </div>
  );
}

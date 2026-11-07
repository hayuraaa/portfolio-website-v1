import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { SiteNav } from "@/components/site-nav";
import { formatDay } from "@/lib/format";
import { excerptOf, getPublishedPosts, readingMinutes } from "@/lib/posts";
import { mediaUrl } from "@/lib/profile";
import { PostList, type PostView } from "./post-list";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building software, machine learning, and the days in between.",
};

export default function BlogPage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div aria-hidden className="paper-grid pointer-events-none absolute inset-0 h-[60vh]" />

      <SiteNav />

      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-5 pt-14 pb-24 sm:pt-20">
        <header className="rise mb-10 text-center">
          <p className="font-mono text-xs tracking-wide text-ink-faint uppercase">Blog</p>
          <h1 className="mt-3 font-serif text-5xl font-medium tracking-tight sm:text-6xl">Notes &amp; essays</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            On building software, machine learning, and the days in between.
          </p>
        </header>

        {/* Read per request (served from cache), so builds never need the database. */}
        <Suspense>
          <Posts />
        </Suspense>
      </main>
    </div>
  );
}

async function Posts() {
  await connection();
  const posts = await getPublishedPosts();

  if (posts.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-rule px-6 py-16 text-center text-ink-soft">
        Nothing published yet. Check back soon.
      </p>
    );
  }

  const view: PostView[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    excerpt: excerptOf(p),
    date: formatDay(p.publishedOn) ?? p.publishedOn,
    readMinutes: readingMinutes(p.content),
    coverUrl: mediaUrl(p.coverImage),
    tags: p.tags,
  }));

  return <PostList posts={view} />;
}

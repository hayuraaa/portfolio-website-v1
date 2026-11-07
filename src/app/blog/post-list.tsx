"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import { FilterTabs } from "@/components/filter-tabs";
import { Pager, scrollToTop } from "@/components/pager";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";

export type PostView = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  coverUrl: string | null;
  tags: string[];
};

const ALL = "All";
const PAGE_SIZE = 8;
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function PostList({ posts }: { posts: PostView[] }) {
  const [category, setCategory] = useState(ALL);
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLOListElement>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [[ALL, posts.length] as const, ...BLOG_CATEGORIES.filter((c) => counts.has(c)).map((c) => [c, counts.get(c)!] as const)];
  }, [posts]);

  const filtered = category === ALL ? posts : posts.filter((p) => p.category === category);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <>
      {categories.length > 2 && (
        <FilterTabs
          label="Filter by category"
          options={categories}
          value={category}
          onChange={(c) => {
            setCategory(c);
            setPage(1);
          }}
          className="rise mb-10"
          style={delay(150)}
        />
      )}

      {/* key: replay the entrance animation when the page or filter changes */}
      <ol key={`${category}-${current}`} ref={listRef} className="scroll-mt-8 divide-y divide-rule border-y border-rule">
        {shown.map((post, i) => (
          <li key={post.slug} className="rise" style={delay(200 + Math.min(i, 7) * 50)}>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid gap-x-8 gap-y-3 py-8 sm:grid-cols-[7.5rem_1fr] md:grid-cols-[7.5rem_1fr_11rem]"
            >
              <p className="font-mono text-xs leading-6 text-ink-faint">
                <time>{post.date}</time>
              </p>

              <div className="min-w-0">
                <h2 className="font-serif text-2xl leading-snug font-medium transition-colors group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-2 leading-relaxed text-ink-soft">{post.excerpt}</p>
                <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-ink-faint">
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{post.readMinutes} min read</span>
                  {post.tags.slice(0, 3).map((t) => (
                    <span key={t}>#{t}</span>
                  ))}
                </p>
              </div>

              {post.coverUrl && (
                <div className="hidden aspect-[4/3] overflow-hidden rounded-xl border border-rule md:block">
                  {/* eslint-disable-next-line @next/next/no-img-element -- served from /media */}
                  <img
                    src={post.coverUrl}
                    alt=""
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}
            </Link>
          </li>
        ))}
      </ol>

      <Pager
        page={current}
        pageCount={pageCount}
        onChange={(n) => {
          setPage(n);
          scrollToTop(listRef.current);
        }}
      />
    </>
  );
}

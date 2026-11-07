import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findPost } from "@/lib/posts";
import { requireUser } from "@/lib/session";
import { DeleteItem } from "../../delete-item";
import { deletePost } from "../actions";
import { toFormData } from "../form-data";
import { PostForm } from "../post-form";

export const instant = false;

export const metadata: Metadata = { title: "Edit tulisan" };

export default async function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  await requireUser();
  const { id } = await params;
  const post = await findPost(Number(id));
  if (!post) notFound();

  return (
    <div className="max-w-4xl pb-28">
      <Link href="/admin/blog" className="text-sm text-ink-soft hover:text-ink">
        ← Semua tulisan
      </Link>
      <div className="mt-3 mb-8 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-serif text-4xl font-medium tracking-tight">{post.title}</h1>
        {post.isPublished && (
          <Link href={`/blog/${post.slug}`} target="_blank" className="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline">
            Lihat di situs ↗
          </Link>
        )}
      </div>
      {/* key: remount with fresh defaults if another post is opened */}
      <PostForm key={post.id} initial={toFormData(post, post.publishedOn)} />
      <DeleteItem
        id={post.id}
        title={post.title}
        noun="tulisan"
        note="Tulisan dan gambar sampulnya dihapus dan tidak bisa dikembalikan."
        action={deletePost}
      />
    </div>
  );
}

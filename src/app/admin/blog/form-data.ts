import type { Post } from "@/db/schema";
import { mediaUrl } from "@/lib/profile";
import type { PostFormData } from "./post-form";

export function toFormData(p: Post | null, today: string): PostFormData {
  return {
    id: p?.id ?? null,
    values: {
      title: p?.title ?? "",
      slug: p?.slug ?? "",
      category: p?.category ?? "",
      excerpt: p?.excerpt ?? "",
      content: p?.content ?? "",
      tags: p?.tags.join(", ") ?? "",
      publishedOn: p?.publishedOn ?? today,
    },
    isPublished: p?.isPublished ?? false,
    coverUrl: mediaUrl(p?.coverImage ?? null),
  };
}

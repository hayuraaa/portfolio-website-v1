import type { Project } from "@/db/schema";
import { mediaUrl } from "@/lib/profile";
import type { ProjectFormData } from "./project-form";

export function toFormData(p: Project | null): ProjectFormData {
  return {
    id: p?.id ?? null,
    values: {
      title: p?.title ?? "",
      slug: p?.slug ?? "",
      category: p?.category ?? "",
      summary: p?.summary ?? "",
      details: p?.details ?? "",
      technologies: p?.technologies.join(", ") ?? "",
      demoUrl: p?.demoUrl ?? "",
      repoUrl: p?.repoUrl ?? "",
      publicationUrl: p?.publicationUrl ?? "",
      completedOn: p?.completedOn ?? "",
      sortOrder: p ? String(p.sortOrder) : "",
    },
    isFeatured: p?.isFeatured ?? false,
    isPublished: p?.isPublished ?? true,
    coverUrl: mediaUrl(p?.coverImage ?? null),
    gallery: (p?.gallery ?? []).map((path) => ({ path, url: mediaUrl(path)! })),
  };
}

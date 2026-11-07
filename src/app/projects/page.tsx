import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { SiteNav } from "@/components/site-nav";
import { GithubIcon } from "@/components/icons";
import { getActiveProfile, mediaUrl } from "@/lib/profile";
import { formatMonth } from "@/lib/format";
import { getPublishedProjects } from "@/lib/projects";
import { ProjectBrowser, type ProjectView } from "./project-browser";

export const metadata: Metadata = {
  title: "Projects",
  description: "Web applications and machine learning projects by Haris Yunanda.",
};

export default function ProjectsPage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div aria-hidden className="paper-grid pointer-events-none absolute inset-0 h-[60vh]" />

      <SiteNav />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-5 pt-14 pb-24 sm:pt-20">
        <header className="rise mb-10 text-center">
          <p className="font-mono text-xs tracking-wide text-ink-faint uppercase">Projects</p>
          <h1 className="mt-3 font-serif text-5xl font-medium tracking-tight sm:text-6xl">Things I&apos;ve built</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            Web applications and machine learning work, with code and live demos where they exist.
          </p>
        </header>

        {/* Read per request (served from cache), so builds never need the database. */}
        <Suspense>
          <ProjectList />
        </Suspense>
      </main>
    </div>
  );
}

async function ProjectList() {
  await connection();
  const [projects, profile] = await Promise.all([getPublishedProjects(), getActiveProfile()]);

  if (projects.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-rule px-6 py-16 text-center text-ink-soft">
        Nothing here yet. Check back soon.
      </p>
    );
  }

  const view: ProjectView[] = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    summary: p.summary,
    details: p.details,
    technologies: p.technologies,
    coverUrl: mediaUrl(p.coverImage),
    galleryUrls: p.gallery.map((g) => mediaUrl(g)!),
    demoUrl: p.demoUrl,
    repoUrl: p.repoUrl,
    publicationUrl: p.publicationUrl,
    completed: formatMonth(p.completedOn),
    isFeatured: p.isFeatured,
  }));

  return (
    <>
      <ProjectBrowser projects={view} />

      {profile?.githubUrl && (
        <section className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-rule bg-paper-raised px-6 py-10 text-center">
          <h2 className="font-serif text-3xl font-medium">More on GitHub</h2>
          <p className="max-w-md text-ink-soft">Smaller experiments, coursework and contributions live there.</p>
          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-2">
            <GithubIcon className="size-[18px]" />
            Visit GitHub
          </a>
        </section>
      )}
    </>
  );
}

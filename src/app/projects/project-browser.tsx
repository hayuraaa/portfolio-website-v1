"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowRightIcon, BookIcon, CloseIcon, ExternalIcon, GithubIcon, StarIcon } from "@/components/icons";
import { FilterTabs } from "@/components/filter-tabs";
import { Pager, scrollToTop } from "@/components/pager";
import { PROJECT_CATEGORIES } from "@/lib/project-categories";

export type ProjectView = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  details: string | null;
  technologies: string[];
  coverUrl: string | null;
  galleryUrls: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  publicationUrl: string | null;
  completed: string | null;
  isFeatured: boolean;
};

const ALL = "All";
const PAGE_SIZE = 6;
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function Cover({ project, index }: { project: ProjectView; index: number }) {
  if (project.coverUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- served from /media
      <img
        src={project.coverUrl}
        alt=""
        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
    );
  }
  // No image yet: an index plate instead of a broken/stock picture.
  return (
    <div className="paper-grid-static flex size-full items-end bg-paper-sunk p-5">
      <span className="font-serif text-7xl leading-none text-ink/15 italic">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

function LinkButtons({ project, size = "sm" }: { project: ProjectView; size?: "sm" | "md" }) {
  const cls =
    size === "sm"
      ? "inline-flex items-center gap-1.5 rounded-lg border border-rule px-3 py-1.5 text-sm transition-colors hover:border-ink"
      : "btn-secondary text-sm";
  return (
    <>
      {project.repoUrl && (
        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={cls}>
          <GithubIcon className="size-4" />
          Code
        </a>
      )}
      {project.demoUrl && (
        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={cls}>
          <ExternalIcon className="size-4" />
          Demo
        </a>
      )}
      {project.publicationUrl && (
        <a href={project.publicationUrl} target="_blank" rel="noopener noreferrer" className={cls}>
          <BookIcon className="size-4" />
          Paper
        </a>
      )}
    </>
  );
}

export function ProjectBrowser({ projects }: { projects: ProjectView[] }) {
  const [category, setCategory] = useState(ALL);
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLUListElement>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    // Fixed order first; anything unexpected after. Empty categories get no tab.
    const order = [...PROJECT_CATEGORIES, ...[...counts.keys()].filter((c) => !PROJECT_CATEGORIES.includes(c as never))];
    return [[ALL, projects.length] as const, ...order.filter((c) => counts.has(c)).map((c) => [c, counts.get(c)!] as const)];
  }, [projects]);

  const filtered = category === ALL ? projects : projects.filter((p) => p.category === category);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const open = projects.find((p) => p.slug === openSlug) ?? null;

  // Deep link: /projects#some-slug opens that project.
  useEffect(() => {
    const fromHash = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      setOpenSlug(projects.some((p) => p.slug === slug) ? slug : null);
    };
    const timer = setTimeout(fromHash, 0);
    window.addEventListener("hashchange", fromHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", fromHash);
    };
  }, [projects]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const show = (slug: string) => {
    history.replaceState(null, "", `#${slug}`);
    setOpenSlug(slug);
  };
  const hide = () => {
    history.replaceState(null, "", window.location.pathname);
    setOpenSlug(null);
  };

  return (
    <>
      {categories.length > 2 && (
        <FilterTabs
          label="Filter by category"
          options={categories}
          value={category}
          onChange={(name) => {
            setCategory(name);
            setPage(1);
          }}
          className="rise mb-10"
          style={delay(150)}
        />
      )}

      {/* key: replay the entrance animation when the page or filter changes */}
      <ul key={`${category}-${current}`} ref={listRef} className="grid scroll-mt-8 gap-6 lg:grid-cols-2">
        {shown.map((project, i) => {
          const index = projects.indexOf(project);
          return (
            <li
              key={project.slug}
              className="rise group flex flex-col overflow-hidden rounded-2xl border border-rule bg-paper-raised transition-shadow hover:shadow-[0_18px_40px_-28px_rgb(0_0_0/0.5)]"
              style={delay(200 + Math.min(i, 6) * 60)}
            >
              <button
                type="button"
                onClick={() => show(project.slug)}
                className="relative aspect-[16/9] overflow-hidden border-b border-rule text-left"
                aria-label={`Open ${project.title}`}
              >
                <Cover project={project} index={index} />
                {project.isFeatured && (
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 font-mono text-[11px] text-accent-ink">
                    <StarIcon className="size-3" />
                    Featured
                  </span>
                )}
              </button>

              <div className="flex flex-1 flex-col p-6">
                <p className="font-mono text-xs text-ink-faint">
                  {project.category}
                  {project.completed && <> · {project.completed}</>}
                </p>
                <h2 className="mt-2 font-serif text-2xl leading-tight font-medium">
                  <button type="button" onClick={() => show(project.slug)} className="text-left hover:text-accent">
                    {project.title}
                  </button>
                </h2>
                <p className="mt-3 line-clamp-3 leading-relaxed text-ink-soft">{project.summary}</p>

                {project.technologies.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <li key={tech} className="rounded-md bg-paper-sunk px-2 py-0.5 font-mono text-xs text-ink-soft">
                        {tech}
                      </li>
                    ))}
                    {project.technologies.length > 5 && (
                      <li className="px-1 py-0.5 font-mono text-xs text-ink-faint">+{project.technologies.length - 5}</li>
                    )}
                  </ul>
                )}

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                  <LinkButtons project={project} />
                  <button
                    type="button"
                    onClick={() => show(project.slug)}
                    className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium hover:text-accent"
                  >
                    Details
                    <ArrowRightIcon className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <Pager
        page={current}
        pageCount={pageCount}
        onChange={(n) => {
          setPage(n);
          scrollToTop(listRef.current);
        }}
      />

      <dialog
        ref={dialogRef}
        onClose={() => openSlug && hide()}
        onClick={(e) => e.target === e.currentTarget && hide()}
        aria-labelledby="project-dialog-title"
        className="m-auto max-h-[90dvh] w-[min(52rem,calc(100%-2rem))] overflow-y-auto rounded-2xl border border-rule bg-paper p-0 text-ink backdrop:bg-black/50 backdrop:backdrop-blur-[2px]"
      >
        {open && (
          <article>
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-rule bg-paper/95 px-6 py-5 backdrop-blur-sm sm:px-8">
              <div>
                <p className="font-mono text-xs text-ink-faint">
                  {open.category}
                  {open.completed && <> · {open.completed}</>}
                </p>
                <h2 id="project-dialog-title" className="mt-1 font-serif text-2xl leading-tight font-medium sm:text-3xl">
                  {open.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={hide}
                aria-label="Close"
                className="shrink-0 rounded-lg border border-rule p-2 text-ink-soft hover:border-ink hover:text-ink"
              >
                <CloseIcon className="size-5" />
              </button>
            </header>

            <div className="space-y-8 px-6 py-6 sm:px-8 sm:py-8">
              {open.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element -- served from /media
                <img src={open.coverUrl} alt="" className="w-full rounded-xl border border-rule" />
              )}

              <p className="text-lg leading-relaxed">{open.summary}</p>

              {open.details && (
                <div className="space-y-4 leading-relaxed text-ink-soft">
                  {open.details.split("\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}

              {open.galleryUrls.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {open.galleryUrls.map((url) => (
                    <a key={url} href={url} target="_blank" rel="noopener" className="block overflow-hidden rounded-xl border border-rule">
                      {/* eslint-disable-next-line @next/next/no-img-element -- served from /media */}
                      <img src={url} alt="" className="aspect-[16/10] w-full object-cover" />
                    </a>
                  ))}
                </div>
              )}

              {open.technologies.length > 0 && (
                <div>
                  <h3 className="font-mono text-xs tracking-wide text-ink-faint uppercase">Built with</h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {open.technologies.map((tech) => (
                      <li key={tech} className="rounded-md bg-paper-sunk px-2.5 py-1 font-mono text-sm text-ink-soft">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(open.repoUrl || open.demoUrl || open.publicationUrl) && (
                <div className="flex flex-wrap gap-2 border-t border-rule pt-6">
                  <LinkButtons project={open} size="md" />
                </div>
              )}
            </div>
          </article>
        )}
      </dialog>
    </>
  );
}

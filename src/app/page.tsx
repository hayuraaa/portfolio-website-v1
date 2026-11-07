import Link from "next/link";
import { connection } from "next/server";
import { Suspense, type CSSProperties } from "react";
import { SiteNav } from "@/components/site-nav";
import { TypedTitle } from "@/components/typed-title";
import { ArrowRightIcon, DownloadIcon } from "@/components/icons";
import { getActiveProfile, mediaUrl } from "@/lib/profile";

const FALLBACK = {
  name: "Haris Yunanda",
  title: "Full Stack Developer",
  description: "",
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div aria-hidden className="paper-grid pointer-events-none absolute inset-0" />

      <SiteNav />

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 pt-12 pb-24 sm:pt-16">
        {/* The profile is read per request (served from cache), so builds never need the database. */}
        <Suspense>
          <Hero />
        </Suspense>
      </main>
    </div>
  );
}

async function Hero() {
  await connection();
  const profile = await getActiveProfile();
  const name = profile?.name ?? FALLBACK.name;
  const title = profile?.title ?? FALLBACK.title;
  const description = profile?.description || FALLBACK.description;
  const avatar = mediaUrl(profile?.avatar ?? null);
  const cv = mediaUrl(profile?.cvFile ?? null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
      {/* Portrait */}
      <div className="rise relative mb-10" style={delay(0)}>
        <div className="relative size-44 rounded-full border border-rule bg-paper-raised p-2 sm:size-52">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element -- served from /media, sizes unknown
            <img
              src={avatar}
              alt={name}
              className="size-full rounded-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center rounded-full bg-paper-sunk font-serif text-6xl text-ink-soft italic sm:text-7xl">
              {initials(name)}
            </div>
          )}
        </div>

        <span className="absolute -top-1 -right-3 flex size-16 -rotate-12 items-center justify-center rounded-full bg-accent font-serif text-lg text-accent-ink italic shadow-[0_6px_16px_-8px_var(--accent)]">
          Hello!
        </span>

        {profile?.isAvailable !== false && (
          <span className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-rule bg-paper-raised px-3.5 py-1 font-mono text-xs whitespace-nowrap text-ink-soft">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-60 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-ok" />
            </span>
            Available for hire
          </span>
        )}
      </div>

      {/* Name + role */}
      <h1
        className="rise font-serif text-5xl leading-none font-medium tracking-tight sm:text-7xl"
        style={delay(120)}
      >
        {name}
      </h1>
      <div className="rise mt-5" style={delay(220)}>
        <TypedTitle text={title} />
      </div>

      {/* Intro */}
      {description && (
        <p
          className="rise mt-10 rounded-2xl border border-rule bg-paper-raised/80 px-6 py-6 text-[17px] leading-relaxed text-ink-soft sm:px-9 sm:py-7 sm:text-lg"
          style={delay(320)}
        >
          {description}
        </p>
      )}

      {/* Actions */}
      <div
        className="rise mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
        style={delay(420)}
      >
        <Link
          href="/projects"
          className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-ink px-6 py-3.5 font-medium text-paper transition-colors hover:bg-accent hover:text-accent-ink"
        >
          View projects
          <ArrowRightIcon className="size-[18px] transition-transform group-hover:translate-x-0.5" />
        </Link>
        {cv ? (
          <a
            href={cv}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-ink/25 px-6 py-3.5 font-medium transition-colors hover:border-ink hover:bg-paper-raised"
          >
            <DownloadIcon className="size-[18px]" />
            Download CV
          </a>
        ) : (
          <span
            aria-disabled
            title="CV belum diunggah"
            className="inline-flex cursor-not-allowed items-center justify-center gap-2.5 rounded-xl border border-dashed border-rule px-6 py-3.5 font-medium text-ink-faint"
          >
            <DownloadIcon className="size-[18px]" />
            Download CV
          </span>
        )}
      </div>
    </div>
  );
}

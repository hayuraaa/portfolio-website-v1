import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense, type ComponentType, type CSSProperties, type SVGProps } from "react";
import { SiteNav } from "@/components/site-nav";
import { GithubIcon, GlobeIcon, InstagramIcon, LinkedinIcon, MailIcon, XIcon } from "@/components/icons";
import { getActiveProfile } from "@/lib/profile";
import { getPublicCounts } from "@/lib/stats";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Haris Yunanda about projects, roles, or collaboration.",
};

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

type Channel = {
  name: string;
  handle: string;
  href: string;
  note: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  primary?: boolean;
};

/** "https://github.com/hayuraaa" -> "@hayuraaa"; falls back to the host. */
function handleFrom(url: string, at = true) {
  try {
    const { hostname, pathname } = new URL(url);
    const last = pathname.split("/").filter(Boolean).at(-1);
    return last ? `${at ? "@" : ""}${last}` : hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ContactPage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div aria-hidden className="paper-grid pointer-events-none absolute inset-0 h-[60vh]" />

      <SiteNav />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-5 pt-14 pb-24 sm:pt-20">
        <header className="rise mb-12 text-center">
          <p className="font-mono text-xs tracking-wide text-ink-faint uppercase">Contact</p>
          <h1 className="mt-3 font-serif text-5xl font-medium tracking-tight sm:text-6xl">Let&apos;s work together</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            Open to new roles, freelance projects, and conversations with people building interesting things.
          </p>
        </header>

        {/* Read per request (served from cache), so builds never need the database. */}
        <Suspense>
          <ContactDetails />
        </Suspense>

        <section className="rise mt-12 grid gap-10 rounded-2xl border border-rule bg-paper-raised p-6 sm:p-10 lg:grid-cols-[1fr_1.6fr]" style={delay(300)}>
          <div>
            <h2 className="font-serif text-3xl font-medium">Send a message</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              A project, a role, or just a question. Tell me a bit about it and I&apos;ll reply by email.
            </p>
          </div>
          <ContactForm />
        </section>
      </main>
    </div>
  );
}

async function ContactDetails() {
  await connection();
  const [profile, counts] = await Promise.all([getActiveProfile(), getPublicCounts()]);

  const facts = [
    profile?.location && { label: "Based in", value: profile.location },
    { label: "Status", value: profile?.isAvailable === false ? "Not taking work" : "Available for work" },
    { label: "Projects", value: String(counts.projects) },
    { label: "Certificates", value: String(counts.certificates) },
  ].filter(Boolean) as { label: string; value: string }[];

  const channels: Channel[] = [
    profile?.email && {
      name: "Email",
      handle: profile.email,
      href: `mailto:${profile.email}`,
      note: "The quickest way to reach me.",
      Icon: MailIcon,
      primary: true,
    },
    profile?.linkedinUrl && {
      name: "LinkedIn",
      handle: handleFrom(profile.linkedinUrl, false),
      href: profile.linkedinUrl,
      note: "Work history and recommendations.",
      Icon: LinkedinIcon,
    },
    profile?.githubUrl && {
      name: "GitHub",
      handle: handleFrom(profile.githubUrl),
      href: profile.githubUrl,
      note: "Code, experiments, and contributions.",
      Icon: GithubIcon,
    },
    profile?.instagramUrl && {
      name: "Instagram",
      handle: handleFrom(profile.instagramUrl),
      href: profile.instagramUrl,
      note: "The less formal side.",
      Icon: InstagramIcon,
    },
    profile?.twitterUrl && { name: "X", handle: handleFrom(profile.twitterUrl), href: profile.twitterUrl, note: "Short thoughts.", Icon: XIcon },
    profile?.websiteUrl && { name: "Website", handle: handleFrom(profile.websiteUrl, false), href: profile.websiteUrl, note: "Elsewhere on the web.", Icon: GlobeIcon },
  ].filter(Boolean) as Channel[];

  return (
    <>
      <dl className="rise grid grid-cols-2 gap-3 md:grid-cols-4" style={delay(100)}>
        {facts.map((f) => (
          <div key={f.label} className="rounded-2xl border border-rule bg-paper-raised px-5 py-4">
            <dt className="font-mono text-[11px] tracking-wide text-ink-faint uppercase">{f.label}</dt>
            <dd className="mt-1 font-serif text-xl">{f.value}</dd>
          </div>
        ))}
      </dl>

      {channels.length > 0 && (
        <ul className="rise mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" style={delay(200)}>
          {channels.map(({ name, handle, href, note, Icon, primary }) => (
            <li key={name}>
              <a
                href={href}
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full flex-col rounded-2xl border border-rule bg-paper-raised p-5 transition-colors hover:border-ink"
              >
                <span className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-paper-sunk text-ink-soft transition-colors group-hover:bg-ink group-hover:text-paper">
                    <Icon className="size-5" />
                  </span>
                  {primary && <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] text-accent-ink">Primary</span>}
                </span>
                <span className="mt-4 font-medium">{name}</span>
                <span className="truncate font-mono text-xs text-ink-soft">{handle}</span>
                <span className="mt-2 text-sm text-ink-faint">{note}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

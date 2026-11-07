import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { findActiveProfile, mediaUrl } from "@/lib/profile";
import { listAllCertificates } from "@/lib/certificates";
import { countUnread } from "@/lib/messages";
import { listAllPosts } from "@/lib/posts";
import { listAllProjects } from "@/lib/projects";
import { requireUser } from "@/lib/session";

export const instant = false;

export const metadata: Metadata = { title: "Dashboard" };

const dateFormat = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" });

export default async function DashboardPage() {
  const user = await requireUser();
  const [profile, projects, certs, posts, unread] = await Promise.all([
    findActiveProfile(),
    listAllProjects(),
    listAllCertificates(),
    listAllPosts(),
    countUnread(),
  ]);
  const published = projects.filter((p) => p.isPublished).length;
  const withoutCover = projects.filter((p) => p.isPublished && !p.coverImage).length;

  const missing = [
    !profile && "Profil belum dibuat",
    profile && !profile.avatar && "Foto profil belum diunggah",
    profile && !profile.cvFile && "CV belum diunggah",
    profile && !profile.description && "Deskripsi masih kosong",
    withoutCover > 0 && `${withoutCover} project tayang belum punya gambar sampul`,
  ].filter(Boolean) as string[];

  const avatar = mediaUrl(profile?.avatar ?? null);

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs tracking-wide text-ink-faint uppercase">Dashboard</p>
      <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">
        Halo, {user.name.split(" ")[0]}.
      </h1>

      {unread > 0 && (
        <Link
          href="/admin/messages"
          className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-ink bg-ink px-5 py-4 text-paper transition-colors hover:bg-accent hover:text-accent-ink"
        >
          <span>
            <span className="font-medium">{unread} pesan baru</span> dari form kontak
          </span>
          <ArrowRightIcon className="size-4" />
        </Link>
      )}

      {missing.length > 0 && (
        <section className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-5">
          <h2 className="text-sm font-medium">Perlu dilengkapi</h2>
          <ul className="mt-2 space-y-1 text-sm text-ink-soft">
            {missing.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 rounded-2xl border border-rule bg-paper-raised p-6">
        <div className="flex items-start gap-5">
          <div className="size-16 shrink-0 overflow-hidden rounded-full border border-rule bg-paper-sunk">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element -- served from /media
              <img src={avatar} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center font-serif text-xl text-ink-faint italic">
                ?
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-2xl font-medium">{profile?.name ?? "Belum ada profil"}</h2>
            {profile && (
              <>
                <p className="mt-0.5 text-sm text-ink-soft">{profile.title}</p>
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-ink-faint">
                  <span className="flex items-center gap-1.5">
                    <span className={`size-2 rounded-full ${profile.isAvailable ? "bg-ok" : "bg-ink-faint"}`} />
                    {profile.isAvailable ? "Available for hire" : "Tidak menerima kerja"}
                  </span>
                  <span>Diubah {dateFormat.format(profile.updatedAt)}</span>
                </p>
              </>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 border-t border-rule pt-5">
          <Link href="/admin/profile" className="btn-primary text-sm">
            Edit profil
            <ArrowRightIcon className="size-4" />
          </Link>
          <Link href="/" target="_blank" className="btn-secondary text-sm">
            Lihat halaman utama
          </Link>
        </div>
      </section>

      <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rule bg-paper-raised p-6">
        <div>
          <h2 className="font-serif text-2xl font-medium">Projects</h2>
          <p className="mt-1 font-mono text-xs text-ink-faint">
            {projects.length} total · {published} tayang · {projects.length - published} draft
          </p>
        </div>
        <Link href="/admin/projects" className="btn-secondary text-sm">
          Kelola project
          <ArrowRightIcon className="size-4" />
        </Link>
      </section>

      <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rule bg-paper-raised p-6">
        <div>
          <h2 className="font-serif text-2xl font-medium">Certificates</h2>
          <p className="mt-1 font-mono text-xs text-ink-faint">
            {certs.length} total · {certs.filter((c) => c.isPublished).length} tayang
          </p>
        </div>
        <Link href="/admin/certificates" className="btn-secondary text-sm">
          Kelola sertifikat
          <ArrowRightIcon className="size-4" />
        </Link>
      </section>

      <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rule bg-paper-raised p-6">
        <div>
          <h2 className="font-serif text-2xl font-medium">Blog</h2>
          <p className="mt-1 font-mono text-xs text-ink-faint">
            {posts.length} tulisan · {posts.filter((p) => p.isPublished).length} terbit
          </p>
        </div>
        <Link href="/admin/blog" className="btn-secondary text-sm">
          Kelola blog
          <ArrowRightIcon className="size-4" />
        </Link>
      </section>
    </div>
  );
}

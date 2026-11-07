import type { Metadata } from "next";
import { findActiveProfile, mediaUrl } from "@/lib/profile";
import { requireUser } from "@/lib/session";
import { ProfileForm } from "./profile-form";

export const instant = false;

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilePage() {
  await requireUser();
  const p = await findActiveProfile();

  return (
    <div className="max-w-4xl">
      <p className="font-mono text-xs tracking-wide text-ink-faint uppercase">Profil</p>
      <h1 className="mt-2 mb-8 font-serif text-4xl font-medium tracking-tight">Data diri</h1>

      <ProfileForm
        initial={{
          name: p?.name ?? "",
          title: p?.title ?? "",
          description: p?.description ?? "",
          email: p?.email ?? "",
          phone: p?.phone ?? "",
          location: p?.location ?? "",
          githubUrl: p?.githubUrl ?? "",
          linkedinUrl: p?.linkedinUrl ?? "",
          instagramUrl: p?.instagramUrl ?? "",
          twitterUrl: p?.twitterUrl ?? "",
          websiteUrl: p?.websiteUrl ?? "",
          isAvailable: p?.isAvailable ?? true,
          avatarUrl: mediaUrl(p?.avatar ?? null),
          cvUrl: mediaUrl(p?.cvFile ?? null),
        }}
      />
    </div>
  );
}

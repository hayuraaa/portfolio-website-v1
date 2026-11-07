import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { SiteNav } from "@/components/site-nav";
import { getPublishedCertificates } from "@/lib/certificates";
import { mediaUrl } from "@/lib/profile";
import { formatMonth } from "@/lib/format";
import { CertificateBrowser, type CertificateView } from "./certificate-browser";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Certifications, courses and awards earned by Haris Yunanda.",
};

export default function CertificatesPage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div aria-hidden className="paper-grid pointer-events-none absolute inset-0 h-[60vh]" />

      <SiteNav />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-5 pt-14 pb-24 sm:pt-20">
        <header className="rise mb-10 text-center">
          <p className="font-mono text-xs tracking-wide text-ink-faint uppercase">Certificates</p>
          <h1 className="mt-3 font-serif text-5xl font-medium tracking-tight sm:text-6xl">Proof of learning</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            Certifications, courses and awards, with links to verify them where the issuer offers one.
          </p>
        </header>

        {/* Read per request (served from cache), so builds never need the database. */}
        <Suspense>
          <CertificateList />
        </Suspense>
      </main>
    </div>
  );
}

async function CertificateList() {
  await connection();
  const certificates = await getPublishedCertificates();

  if (certificates.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-rule px-6 py-16 text-center text-ink-soft">
        Nothing here yet. Check back soon.
      </p>
    );
  }

  const thisMonth = new Date().toISOString().slice(0, 7);

  const view: CertificateView[] = certificates.map((c) => {
    const expired = !!c.expiresOn && c.expiresOn < thisMonth;
    return {
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      kind: c.kind,
      issued: formatMonth(c.issuedOn) ?? c.issuedOn,
      validity: c.expiresOn
        ? { label: `${expired ? "Expired" : "Valid until"} ${formatMonth(c.expiresOn)}`, expired }
        : null,
      credentialId: c.credentialId,
      credentialUrl: c.credentialUrl,
      imageUrl: mediaUrl(c.image),
      skills: c.skills,
    };
  });

  return <CertificateBrowser certificates={view} />;
}

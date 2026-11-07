import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { CertificateForm } from "../certificate-form";
import { toFormData } from "../form-data";

export const instant = false;

export const metadata: Metadata = { title: "Sertifikat baru" };

export default async function NewCertificatePage() {
  await requireUser();

  return (
    <div className="max-w-4xl pb-28">
      <Link href="/admin/certificates" className="text-sm text-ink-soft hover:text-ink">
        ← Semua sertifikat
      </Link>
      <h1 className="mt-3 mb-8 font-serif text-4xl font-medium tracking-tight">Sertifikat baru</h1>
      <CertificateForm initial={toFormData(null)} />
    </div>
  );
}

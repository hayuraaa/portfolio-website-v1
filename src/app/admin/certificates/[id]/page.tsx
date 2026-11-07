import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findCertificate } from "@/lib/certificates";
import { requireUser } from "@/lib/session";
import { DeleteItem } from "../../delete-item";
import { deleteCertificate } from "../actions";
import { CertificateForm } from "../certificate-form";
import { toFormData } from "../form-data";

export const instant = false;

export const metadata: Metadata = { title: "Edit sertifikat" };

export default async function EditCertificatePage({ params }: PageProps<"/admin/certificates/[id]">) {
  await requireUser();
  const { id } = await params;
  const cert = await findCertificate(Number(id));
  if (!cert) notFound();

  return (
    <div className="max-w-4xl pb-28">
      <Link href="/admin/certificates" className="text-sm text-ink-soft hover:text-ink">
        ← Semua sertifikat
      </Link>
      <h1 className="mt-3 mb-8 font-serif text-4xl font-medium tracking-tight">{cert.title}</h1>
      {/* key: remount with fresh defaults if another certificate is opened */}
      <CertificateForm key={cert.id} initial={toFormData(cert)} />
      <DeleteItem
        id={cert.id}
        title={cert.title}
        noun="sertifikat"
        note="Sertifikat dan gambarnya dihapus dan tidak bisa dikembalikan."
        action={deleteCertificate}
      />
    </div>
  );
}

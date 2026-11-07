import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "@/components/icons";
import { listAllCertificates } from "@/lib/certificates";
import { formatMonth } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const instant = false;

export const metadata: Metadata = { title: "Certificates" };

const FLASH: Record<string, string> = {
  created: "Sertifikat ditambahkan.",
  deleted: "Sertifikat dihapus.",
};

export default async function CertificatesAdminPage({ searchParams }: PageProps<"/admin/certificates">) {
  await requireUser();
  const [certs, params] = await Promise.all([listAllCertificates(), searchParams]);
  const flash = Object.keys(FLASH).find((key) => key in params);
  const published = certs.filter((c) => c.isPublished).length;

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-wide text-ink-faint uppercase">Certificates</p>
          <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">Semua sertifikat</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {certs.length} sertifikat · {published} tayang
            {certs.length - published > 0 && <> · {certs.length - published} draft</>}
          </p>
        </div>
        <Link href="/admin/certificates/new" className="btn-primary text-sm">
          <PlusIcon className="size-4" />
          Tambah sertifikat
        </Link>
      </div>

      {flash && (
        <p role="status" className="mt-6 rounded-lg border border-ok/30 bg-ok/10 px-4 py-2.5 text-sm text-ok">
          {FLASH[flash]}
        </p>
      )}

      {certs.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-rule px-6 py-14 text-center text-ink-soft">
          Belum ada sertifikat.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-rule overflow-hidden rounded-2xl border border-rule bg-paper-raised">
          {certs.map((c) => (
            <li key={c.id}>
              <Link
                href={`/admin/certificates/${c.id}`}
                className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-paper-sunk sm:px-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{c.title}</p>
                  <p className="mt-0.5 truncate font-mono text-xs text-ink-faint">
                    {c.kind} · {c.issuer} · {formatMonth(c.issuedOn)}
                    {!c.image && <> · tanpa gambar</>}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[11px] ${
                    c.isPublished ? "bg-ok/15 text-ok" : "bg-paper-sunk text-ink-faint"
                  }`}
                >
                  {c.isPublished ? "Tayang" : "Draft"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

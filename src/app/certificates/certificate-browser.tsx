"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { FilterTabs } from "@/components/filter-tabs";
import { CloseIcon, ExternalIcon } from "@/components/icons";
import { Pager, scrollToTop } from "@/components/pager";
import { CERTIFICATE_KINDS } from "@/lib/certificate-kinds";

export type CertificateView = {
  id: number;
  title: string;
  issuer: string;
  kind: string;
  issued: string;
  /** e.g. "Valid until Mar 2028" or "Expired Jan 2024" */
  validity: { label: string; expired: boolean } | null;
  credentialId: string | null;
  credentialUrl: string | null;
  imageUrl: string | null;
  skills: string[];
};

const ALL = "All";
const PAGE_SIZE = 9;
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function initials(text: string) {
  return text
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function CertificateBrowser({ certificates }: { certificates: CertificateView[] }) {
  const [kind, setKind] = useState(ALL);
  const [page, setPage] = useState(1);
  const [zoomed, setZoomed] = useState<CertificateView | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const kinds = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of certificates) counts.set(c.kind, (counts.get(c.kind) ?? 0) + 1);
    const order = [...CERTIFICATE_KINDS, ...[...counts.keys()].filter((k) => !CERTIFICATE_KINDS.includes(k as never))];
    return [[ALL, certificates.length] as const, ...order.filter((k) => counts.has(k)).map((k) => [k, counts.get(k)!] as const)];
  }, [certificates]);

  const filtered = kind === ALL ? certificates : certificates.filter((c) => c.kind === kind);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (zoomed && !dialog.open) dialog.showModal();
    if (!zoomed && dialog.open) dialog.close();
  }, [zoomed]);

  return (
    <>
      {kinds.length > 2 && (
        <FilterTabs
          label="Filter by type"
          options={kinds}
          value={kind}
          onChange={(k) => {
            setKind(k);
            setPage(1);
          }}
          className="rise mb-10"
          style={delay(150)}
        />
      )}

      {/* key: replay the entrance animation when the page or filter changes */}
      <ul key={`${kind}-${current}`} ref={listRef} className="grid scroll-mt-8 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c, i) => (
          <li
            key={c.id}
            className="rise flex flex-col overflow-hidden rounded-2xl border border-rule bg-paper-raised"
            style={delay(200 + Math.min(i, 8) * 50)}
          >
            {c.imageUrl ? (
              <button
                type="button"
                onClick={() => setZoomed(c)}
                aria-label={`View certificate: ${c.title}`}
                className="aspect-[1.414] overflow-hidden border-b border-rule bg-paper-sunk"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- served from /media */}
                <img src={c.imageUrl} alt="" className="size-full object-cover transition-transform duration-500 hover:scale-[1.02]" />
              </button>
            ) : (
              <div aria-hidden className="paper-grid-static flex aspect-[1.414] items-center justify-center border-b border-rule bg-paper-sunk">
                <span className="font-serif text-6xl text-ink/20 italic">{initials(c.issuer)}</span>
              </div>
            )}

            <div className="flex flex-1 flex-col p-5">
              <p className="font-mono text-xs text-ink-faint">
                {c.kind} · {c.issued}
              </p>
              <h2 className="mt-2 font-serif text-xl leading-snug font-medium">{c.title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{c.issuer}</p>

              {c.skills.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {c.skills.map((s) => (
                    <li key={s} className="rounded-md bg-paper-sunk px-2 py-0.5 font-mono text-xs text-ink-soft">
                      {s}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-2 pt-5">
                <div className="min-w-0 font-mono text-[11px] leading-relaxed text-ink-faint">
                  {c.validity && <p className={c.validity.expired ? "line-through" : ""}>{c.validity.label}</p>}
                  {c.credentialId && <p className="truncate">ID {c.credentialId}</p>}
                </div>
                {c.credentialUrl && (
                  <a
                    href={c.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-rule px-3 py-1.5 text-sm transition-colors hover:border-ink"
                  >
                    Verify
                    <ExternalIcon className="size-3.5" />
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
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
        onClose={() => setZoomed(null)}
        onClick={(e) => e.target === e.currentTarget && setZoomed(null)}
        aria-label={zoomed?.title}
        className="m-auto max-h-[92dvh] w-[min(64rem,calc(100%-2rem))] overflow-hidden rounded-2xl border border-rule bg-paper p-0 text-ink backdrop:bg-black/60"
      >
        {zoomed?.imageUrl && (
          <figure className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element -- served from /media */}
            <img src={zoomed.imageUrl} alt={zoomed.title} className="max-h-[80dvh] w-full object-contain" />
            <figcaption className="flex items-center justify-between gap-4 border-t border-rule px-5 py-3 text-sm">
              <span>
                <span className="font-medium">{zoomed.title}</span>
                <span className="text-ink-faint"> · {zoomed.issuer}</span>
              </span>
              <button type="button" onClick={() => setZoomed(null)} aria-label="Close" className="rounded-lg p-1.5 text-ink-soft hover:text-ink">
                <CloseIcon className="size-5" />
              </button>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}

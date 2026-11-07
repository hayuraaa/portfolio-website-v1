"use client";

import { ArrowRightIcon } from "./icons";

/** Scrolls a list back into view after a page change, respecting reduced motion. */
export function scrollToTop(el: Element | null) {
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}

export function Pager({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (page: number) => void }) {
  const step =
    "inline-flex h-10 items-center gap-1.5 rounded-xl border border-rule bg-paper-raised px-4 text-sm transition-colors enabled:hover:border-ink disabled:opacity-40";
  if (pageCount <= 1) return null;
  return (
    <nav aria-label="Pages" className="mt-12 flex items-center justify-center gap-2">
      <button type="button" className={step} disabled={page === 1} onClick={() => onChange(page - 1)}>
        <ArrowRightIcon className="size-4 rotate-180" />
        <span className="hidden sm:inline">Previous</span>
      </button>
      <ol className="flex gap-1">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            <button
              type="button"
              aria-current={n === page ? "page" : undefined}
              onClick={() => onChange(n)}
              className={`size-10 rounded-xl font-mono text-sm transition-colors ${
                n === page ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper-sunk hover:text-ink"
              }`}
            >
              {n}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className={step} disabled={page === pageCount} onClick={() => onChange(page + 1)}>
        <span className="hidden sm:inline">Next</span>
        <ArrowRightIcon className="size-4" />
      </button>
    </nav>
  );
}

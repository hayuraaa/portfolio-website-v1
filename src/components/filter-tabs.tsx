"use client";

import type { CSSProperties } from "react";

/** Pill tabs with counts, e.g. "All 12 · Web Application 5". */
export function FilterTabs({
  label,
  options,
  value,
  onChange,
  className = "",
  style,
}: {
  label: string;
  options: readonly (readonly [string, number])[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div role="tablist" aria-label={label} className={`flex flex-wrap justify-center gap-2 ${className}`} style={style}>
      {options.map(([name, count]) => {
        const active = name === value;
        return (
          <button
            key={name}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(name)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              active
                ? "border-ink bg-ink text-paper"
                : "border-rule bg-paper-raised text-ink-soft hover:border-ink-soft hover:text-ink"
            }`}
          >
            {name}
            <span className={`ml-2 font-mono text-xs ${active ? "text-paper/60" : "text-ink-faint"}`}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}

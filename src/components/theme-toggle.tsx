"use client";

import { THEME_STORAGE_KEY } from "@/lib/theme";
import { MoonIcon, SunIcon } from "./icons";

function currentTheme() {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const toggle = () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode etc.: the switch still works for this page view.
    }
  };

  return (
    <button type="button" onClick={toggle} aria-label="Toggle light and dark mode" title="Terang / gelap" className={className}>
      {/* Which icon shows is decided in CSS, so server and client markup match. */}
      <MoonIcon className="show-if-light size-[18px]" />
      <SunIcon className="show-if-dark size-[18px]" />
    </button>
  );
}

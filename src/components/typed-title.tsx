"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 70;
const DELETE_MS = 35;
const HOLD_MS = 2600;
const START_MS = 900;

/** Types the title out, holds, erases, repeats. Shows it whole when motion is reduced. */
export function TypedTitle({ text }: { text: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setTimeout(() => setCount(text.length), 0);
      return () => clearTimeout(timer);
    }

    let n = 0;
    let deleting = false;

    const step = () => {
      if (!deleting && n === text.length) {
        deleting = true;
        timer = setTimeout(step, HOLD_MS);
        return;
      }
      if (deleting && n === 0) {
        deleting = false;
        timer = setTimeout(step, 500);
        return;
      }
      n += deleting ? -1 : 1;
      setCount(n);
      timer = setTimeout(step, deleting ? DELETE_MS : TYPE_MS);
    };

    timer = setTimeout(step, START_MS);
    return () => clearTimeout(timer);
  }, [text]);

  const shown = text.slice(0, count);

  return (
    <p className="flex min-h-8 items-center justify-center font-mono text-base text-ink-soft sm:text-lg">
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        <span className="text-accent">~/</span> {shown}
      </span>
      <span aria-hidden className="caret ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-px bg-accent" />
    </p>
  );
}

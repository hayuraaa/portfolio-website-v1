"use client";

import { useEffect } from "react";
import { markRead } from "../actions";

/** Marks the message read once it's actually opened (not when a link to it is prefetched). */
export function MarkRead({ id }: { id: number }) {
  useEffect(() => {
    void markRead(id);
  }, [id]);
  return null;
}

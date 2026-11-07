"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AwardIcon,
  BookIcon,
  FolderIcon,
  GridIcon,
  InboxIcon,
  UserIcon,
} from "@/components/icons";

// `ready: false` items are placeholders until their public pages exist.
const items = [
  { label: "Dashboard", href: "/admin", Icon: GridIcon, ready: true },
  { label: "Profil", href: "/admin/profile", Icon: UserIcon, ready: true },
  { label: "Projects", href: "/admin/projects", Icon: FolderIcon, ready: true },
  { label: "Certificates", href: "/admin/certificates", Icon: AwardIcon, ready: true },
  { label: "Blog", href: "/admin/blog", Icon: BookIcon, ready: true },
  { label: "Pesan masuk", href: "/admin/messages", Icon: InboxIcon, ready: true },
];

/** `badges` maps an href to a count shown next to it (e.g. unread messages). */
export function AdminNav({ badges = {} }: { badges?: Record<string, number> }) {
  const pathname = usePathname();

  return (
    <ul className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {items.map(({ label, href, Icon, ready }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        const base =
          "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors";

        if (!ready) {
          return (
            <li key={href}>
              <span className={`${base} cursor-default text-ink-faint`} title="Belum tersedia">
                <Icon className="size-[18px]" />
                {label}
                <span className="ml-auto hidden rounded border border-rule px-1.5 font-mono text-[10px] uppercase md:inline">
                  segera
                </span>
              </span>
            </li>
          );
        }

        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`${base} ${
                active ? "bg-ink font-medium text-paper" : "text-ink-soft hover:bg-paper-sunk hover:text-ink"
              }`}
            >
              <Icon className="size-[18px]" />
              {label}
              {!!badges[href] && (
                <span
                  className={`ml-auto rounded-full px-1.5 font-mono text-[11px] ${active ? "bg-paper text-ink" : "bg-accent text-accent-ink"}`}
                >
                  {badges[href]}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AwardIcon, BookIcon, FolderIcon, MailIcon, UserIcon } from "./icons";
import { ThemeToggle } from "./theme-toggle";

// `short` is used on mobile, where all labels share one row.
const items = [
  { label: "About", href: "/", Icon: UserIcon },
  { label: "Projects", href: "/projects", Icon: FolderIcon },
  { label: "Certificates", short: "Certs", href: "/certificates", Icon: AwardIcon },
  { label: "Blog", href: "/blog", Icon: BookIcon },
  { label: "Contact", href: "/contact", Icon: MailIcon },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="relative z-20 px-4 pt-6 sm:pt-8">
      <ul className="mx-auto grid max-w-md grid-cols-[repeat(5,minmax(0,1fr))_auto] gap-1 rounded-2xl border border-rule bg-paper-raised p-1.5 shadow-[0_1px_0_var(--rule),0_12px_30px_-18px_rgb(0_0_0/0.35)] md:flex md:max-w-fit md:gap-1">
        {items.map((item) => {
          const { label, href, Icon } = item;
          const short = "short" in item ? item.short : label;
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors md:flex-row md:gap-2 md:px-3 md:text-sm lg:px-4",
                  active
                    ? "bg-ink text-paper"
                    : "text-ink-soft hover:bg-paper-sunk hover:text-ink",
                ].join(" ")}
              >
                <Icon className="size-5 md:size-[18px]" />
                <span className="md:hidden">{short}</span>
                <span className="hidden md:inline">{label}</span>
              </Link>
            </li>
          );
        })}
        <li className="flex items-center border-l border-rule pl-1 md:ml-1 md:pl-1.5">
          <ThemeToggle className="flex h-full items-center justify-center rounded-xl px-2.5 text-ink-soft transition-colors hover:bg-paper-sunk hover:text-ink md:py-2" />
        </li>
      </ul>
    </nav>
  );
}

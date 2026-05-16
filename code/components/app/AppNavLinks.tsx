"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItem =
  "flex items-center gap-2 rounded-xl px-2.5 py-2.5 text-[13px] font-medium text-stone-600 transition-colors hover:bg-stone-100/90 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/6 dark:hover:text-white";

const navActive =
  "flex items-center gap-2 rounded-xl bg-teal-600/14 px-2.5 py-2.5 text-[13px] font-semibold text-teal-900 shadow-sm ring-1 ring-teal-600/15 dark:text-teal-100 dark:ring-teal-400/20";

type Props = {
  onNavigate?: () => void;
};

export function AppNavLinks({ onNavigate }: Props) {
  const pathname = usePathname() ?? "";
  const newActive = pathname === "/events/new";
  const eventsActive =
    pathname === "/events" ||
    (/^\/events\/[^/]+$/.test(pathname) && !newActive && !pathname.endsWith("/check-in"));

  return (
    <nav className="flex flex-col gap-0.5">
      <Link href="/events" className={eventsActive ? navActive : navItem} onClick={onNavigate}>
        <span className="text-teal-600/90 dark:text-teal-400/90" aria-hidden>
          ◆
        </span>
        Events
      </Link>
      <Link href="/events/new" className={newActive ? navActive : navItem} onClick={onNavigate}>
        <span className="text-teal-600/90 dark:text-teal-400/90" aria-hidden>
          ＋
        </span>
        New event
      </Link>
    </nav>
  );
}

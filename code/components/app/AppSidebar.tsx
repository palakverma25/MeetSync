"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItem =
  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100/90 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/6 dark:hover:text-white";

const navActive =
  "flex items-center gap-3 rounded-2xl bg-teal-600/14 px-3 py-2.5 text-sm font-semibold text-teal-900 shadow-sm ring-1 ring-teal-600/15 dark:text-teal-100 dark:ring-teal-400/20";

export function AppSidebar() {
  const pathname = usePathname() ?? "";
  const newActive = pathname === "/events/new";
  const eventsActive =
    pathname === "/events" ||
    (/^\/events\/[^/]+$/.test(pathname) && !newActive);

  return (
    <aside
      className={[
        "sticky top-3 z-30 flex h-[calc(100dvh-1.5rem)] w-56 shrink-0 flex-col overflow-hidden sm:top-4 sm:h-[calc(100dvh-2rem)] sm:w-60",
        "rounded-[1.75rem] sm:rounded-4xl",
        "border border-white/70 bg-white/70 shadow-[0_8px_40px_-8px_rgba(15,23,42,0.18),0_0_0_1px_rgba(255,255,255,0.5)_inset] backdrop-blur-2xl",
        "dark:border-white/10 dark:bg-stone-950/55 dark:shadow-[0_12px_48px_-8px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.06)]",
      ].join(" ")}
    >
      {/* soft top highlight for “overlay” depth */}
      <div
        className="pointer-events-none absolute inset-x-4 top-0 h-px rounded-full bg-linear-to-r from-transparent via-white/80 to-transparent opacity-90 dark:via-white/15"
        aria-hidden
      />
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center px-5 pb-2 pt-5">
          <Link href="/" className="text-lg font-bold tracking-tight text-stone-900 dark:text-white">
            Meet<span className="text-teal-600 dark:text-teal-400">Sync</span>
          </Link>
        </div>
        <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain px-3 pb-3 pt-1">
          <Link href="/events" className={eventsActive ? navActive : navItem}>
            <span className="text-teal-600/90 dark:text-teal-400/90" aria-hidden>
              ◆
            </span>
            Events
          </Link>
          <Link href="/events/new" className={newActive ? navActive : navItem}>
            <span className="text-teal-600/90 dark:text-teal-400/90" aria-hidden>
              ＋
            </span>
            New event
          </Link>
        </nav>
        <div className="shrink-0 px-3 pb-5 pt-2">
          <Link
            href="/"
            className="block rounded-2xl px-3 py-2.5 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-100/80 hover:text-stone-800 dark:text-stone-500 dark:hover:bg-white/6 dark:hover:text-stone-300"
          >
            ← Marketing site
          </Link>
        </div>
      </div>
    </aside>
  );
}

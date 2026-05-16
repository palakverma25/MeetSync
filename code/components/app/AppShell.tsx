"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppNavLinks } from "@/components/app/AppNavLinks";
import { MeetSyncWordmark } from "@/components/MeetSyncWordmark";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <div className="flex min-h-dvh w-full max-w-[100vw] flex-col overflow-x-hidden bg-stone-100 text-[15px] leading-snug dark:bg-stone-950 lg:h-dvh lg:max-h-dvh lg:flex-row lg:overflow-hidden">
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-stone-200/80 bg-white/90 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/90 lg:hidden">
        <MeetSyncWordmark size="sm" href="/events" />
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-xl text-stone-700 ring-1 ring-stone-200/80 transition hover:bg-stone-100 dark:text-stone-200 dark:ring-stone-700 dark:hover:bg-stone-800"
          aria-expanded={menuOpen}
          aria-controls="app-mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            id="app-mobile-nav"
            className="absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col border-r border-stone-200/80 bg-white shadow-xl dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex h-14 items-center border-b border-stone-100 px-4 dark:border-stone-800">
              <MeetSyncWordmark size="sm" href="/events" />
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3">
              <AppNavLinks onNavigate={() => setMenuOpen(false)} />
            </div>
            <div className="border-t border-stone-100 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] dark:border-stone-800">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-2.5 py-2.5 text-[12px] font-medium text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
              >
                ← Marketing site
              </Link>
            </div>
          </aside>
        </div>
      ) : null}

      <div className="hidden w-[calc(13rem+1.5rem)] shrink-0 lg:block lg:self-start lg:p-3">
        <aside
          className={[
            "sticky top-3 z-30 flex h-[calc(100dvh-1.5rem)] w-52 flex-col overflow-hidden",
            "rounded-3xl border border-white/70 bg-white/70 shadow-[0_8px_40px_-8px_rgba(15,23,42,0.18)] backdrop-blur-2xl",
            "dark:border-white/10 dark:bg-stone-950/55",
          ].join(" ")}
        >
          <div className="flex flex-1 flex-col">
            <div className="flex shrink-0 items-center px-4 pb-1.5 pt-4">
              <MeetSyncWordmark size="sm" href="/events" />
            </div>
            <div className="flex-1 px-2.5 pb-2 pt-0.5">
              <AppNavLinks />
            </div>
            <div className="shrink-0 px-2.5 pb-3">
              <Link
                href="/"
                className="block rounded-xl px-2 py-2 text-[11px] font-medium text-stone-500 transition-colors hover:bg-stone-100/80 hover:text-stone-800 dark:hover:bg-white/6 dark:hover:text-stone-300"
              >
                ← Marketing site
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col px-3 py-3 sm:px-4 sm:py-4 lg:overflow-y-auto lg:overscroll-contain lg:pr-3 lg:pb-3 lg:pt-3">
        {children}
      </main>
    </div>
  );
}

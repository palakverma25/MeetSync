"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MeetSyncWordmark } from "@/components/MeetSyncWordmark";
import {
  DASHBOARD_LOGIN_HREF,
  signInButtonHeader,
  signInButtonMobile,
} from "@/components/marketing/marketingLinks";

const link =
  "block rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white";

export function MarketingHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <MeetSyncWordmark size="sm" href="/" />

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/features" className="text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
            Features
          </Link>
          <Link href={DASHBOARD_LOGIN_HREF} className={signInButtonHeader}>
            Sign in
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-xl text-stone-700 ring-1 ring-stone-200/80 transition hover:bg-stone-100 lg:hidden dark:text-stone-200 dark:ring-stone-700 dark:hover:bg-stone-800"
          aria-expanded={open}
          aria-controls="marketing-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open ? (
        <nav
          id="marketing-mobile-nav"
          className="border-t border-stone-200/80 bg-white px-3 py-3 lg:hidden dark:border-stone-800 dark:bg-stone-950"
        >
          <Link href="/features" className={link} onClick={() => setOpen(false)}>
            Features
          </Link>
          <Link
            href={DASHBOARD_LOGIN_HREF}
            className={signInButtonMobile}
            onClick={() => setOpen(false)}
          >
            Sign in
          </Link>
        </nav>
      ) : null}
    </header>
  );
}

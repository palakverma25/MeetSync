import Link from "next/link";

const link =
  "text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-white";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/85 shadow-[0_1px_0_0_rgba(28,25,23,0.06)] backdrop-blur-md dark:bg-stone-950/85 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-stone-900 dark:text-white"
        >
          Meet<span className="text-teal-600 dark:text-teal-400">Sync</span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/features" className={link}>
            Features
          </Link>
          <Link
            href="/events"
            className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
          >
            Open app
          </Link>
        </nav>
      </div>
    </header>
  );
}

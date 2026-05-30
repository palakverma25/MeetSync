import Link from "next/link";
import { DASHBOARD_LOGIN_HREF } from "@/components/marketing/marketingLinks";

export function MarketingFooter() {
  return (
    <footer className="bg-stone-50 py-10 dark:bg-stone-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-6 sm:flex-row sm:px-8">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          MeetSync — internal ops for live events.
        </p>
        <div className="flex gap-6 text-sm">
          <Link href="/" className="text-stone-600 hover:text-teal-600 dark:text-stone-400 dark:hover:text-teal-400">
            Home
          </Link>
          <Link href={DASHBOARD_LOGIN_HREF} className="text-stone-600 hover:text-teal-600 dark:text-stone-400 dark:hover:text-teal-400">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}

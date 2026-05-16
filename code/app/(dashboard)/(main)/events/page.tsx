import Link from "next/link";
import { listEventsWithStats } from "@/lib/events";
import { formatEventDateTime } from "@/lib/formatDate";

export const metadata = {
  title: "Events — MeetSync",
};

export default async function EventsDashboardPage() {
  const events = await listEventsWithStats();

  return (
    <div className="flex-1">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-5 sm:py-7 md:px-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              Events
            </h1>
            <p className="max-w-lg text-pretty text-sm text-stone-600 dark:text-stone-400">
              Your running list of shows — open a card for roster and exports, or jump
              straight to check-in.
            </p>
          </div>
          <Link
            href="/events/new"
            className="inline-flex h-9 shrink-0 items-center justify-center self-start rounded-full bg-teal-600 px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-teal-500 sm:self-auto"
          >
            New event
          </Link>
        </header>

        {events.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-stone-200/60 dark:bg-stone-900 dark:ring-stone-700/50">
            <p className="text-base font-medium text-stone-800 dark:text-stone-200">
              No events yet
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              Create your first event, or seed demo data with{" "}
              <code className="rounded-md bg-stone-100 px-2 py-0.5 text-xs dark:bg-stone-800">
                npm run db:seed
              </code>{" "}
              from the project folder.
            </p>
            <Link
              href="/events/new"
              className="mt-6 inline-flex rounded-full bg-teal-600 px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-teal-500"
            >
              Create event
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => {
              const progress =
                e.capacity > 0 ? Math.min(100, (e.checkedInCount / e.capacity) * 100) : 0;
              return (
                <li key={e.id}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/50 transition hover:ring-teal-500/25 hover:shadow-md dark:bg-stone-900 dark:ring-stone-700/40 dark:hover:ring-teal-500/20">
                    <div className="space-y-3 p-4 sm:p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-0.5">
                          <h2 className="text-[15px] font-semibold leading-snug text-stone-900 dark:text-white">
                            <Link
                              href={`/events/${e.id}`}
                              className="transition hover:text-teal-700 dark:hover:text-teal-400"
                            >
                              {e.title}
                            </Link>
                          </h2>
                          <p className="text-[13px] text-stone-500 dark:text-stone-400">{e.venue}</p>
                        </div>
                        <time className="shrink-0 text-right text-[11px] leading-relaxed text-stone-400 dark:text-stone-500">
                          {formatEventDateTime(e.date)}
                        </time>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-medium text-stone-500">
                          <span>Check-in vs capacity</span>
                          <span className="tabular-nums text-stone-700 dark:text-stone-300">
                            {e.checkedInCount}/{e.capacity}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-teal-500 to-emerald-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          {e.attendeeCount} on roster · {e.confirmedCount} confirmed
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 bg-stone-50/80 px-4 py-3 dark:bg-stone-800/30">
                      <Link
                        href={`/events/${e.id}`}
                        className="flex-1 rounded-xl py-2 text-center text-[13px] font-semibold text-stone-800 transition hover:bg-white dark:text-stone-100 dark:hover:bg-stone-800"
                      >
                        Roster
                      </Link>
                      <Link
                        href={`/events/${e.id}/check-in`}
                        className="flex-1 rounded-xl bg-teal-600 py-2 text-center text-[13px] font-semibold text-white transition hover:bg-teal-500"
                      >
                        Check-in
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

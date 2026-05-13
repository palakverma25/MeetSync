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
      <div className="w-full space-y-10 px-5 py-10 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
              Events
            </h1>
            <p className="max-w-xl text-pretty text-stone-600 dark:text-stone-400">
              Your running list of shows — open a card for roster and exports, or jump
              straight to check-in.
            </p>
          </div>
          <Link
            href="/events/new"
            className="inline-flex h-11 shrink-0 items-center justify-center self-start rounded-full bg-teal-600 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 sm:self-auto"
          >
            New event
          </Link>
        </header>

        {events.length === 0 ? (
          <div className="rounded-3xl bg-white px-8 py-16 text-center shadow-sm ring-1 ring-stone-200/60 dark:bg-stone-900 dark:ring-stone-700/50">
            <p className="text-lg font-medium text-stone-800 dark:text-stone-200">
              No events yet
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              Create your first event, or seed demo data with{" "}
              <code className="rounded-md bg-stone-100 px-2 py-0.5 text-xs dark:bg-stone-800">
                npm run db:seed
              </code>{" "}
              from the project folder.
            </p>
            <Link
              href="/events/new"
              className="mt-8 inline-flex rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500"
            >
              Create event
            </Link>
          </div>
        ) : (
          <ul className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {events.map((e) => {
              const progress =
                e.capacity > 0 ? Math.min(100, (e.checkedInCount / e.capacity) * 100) : 0;
              return (
                <li key={e.id}>
                  <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/50 transition hover:ring-teal-500/25 hover:shadow-md dark:bg-stone-900 dark:ring-stone-700/40 dark:hover:ring-teal-500/20">
                    <div className="space-y-5 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-1">
                          <h2 className="text-lg font-semibold leading-snug text-stone-900 dark:text-white">
                            <Link
                              href={`/events/${e.id}`}
                              className="transition hover:text-teal-700 dark:hover:text-teal-400"
                            >
                              {e.title}
                            </Link>
                          </h2>
                          <p className="text-sm text-stone-500 dark:text-stone-400">{e.venue}</p>
                        </div>
                        <time className="shrink-0 text-right text-xs leading-relaxed text-stone-400 dark:text-stone-500">
                          {formatEventDateTime(e.date)}
                        </time>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-stone-500">
                          <span>Check-in vs capacity</span>
                          <span className="tabular-nums text-stone-700 dark:text-stone-300">
                            {e.checkedInCount}/{e.capacity}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-teal-500 to-emerald-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {e.attendeeCount} on roster · {e.confirmedCount} confirmed
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 bg-stone-50/80 px-6 py-4 dark:bg-stone-800/30">
                      <Link
                        href={`/events/${e.id}`}
                        className="flex-1 rounded-2xl py-2.5 text-center text-sm font-semibold text-stone-800 transition hover:bg-white dark:text-stone-100 dark:hover:bg-stone-800"
                      >
                        Roster
                      </Link>
                      <Link
                        href={`/events/${e.id}/check-in`}
                        className="flex-1 rounded-2xl bg-teal-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-teal-500"
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

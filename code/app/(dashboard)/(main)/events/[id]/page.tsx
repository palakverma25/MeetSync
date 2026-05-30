import Link from "next/link";
import { notFound } from "next/navigation";
import { AddAttendeeForm } from "@/components/AddAttendeeForm";
import { EventRoster } from "@/components/EventRoster";
import { EventSubtitle } from "@/components/EventSubtitle";
import { getPublicBaseUrl } from "@/lib/publicUrl";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: { attendees: { orderBy: { name: "asc" } } },
  });

  if (!event) notFound();

  const confirmed = event.attendees.filter((a) => a.rsvpStatus === "confirmed");
  const checkedIn = confirmed.filter((a) => a.checkedInAt);
  const noShows = confirmed.filter((a) => !a.checkedInAt);

  const rosterRows = event.attendees.map((a) => ({
    id: a.id,
    name: a.name,
    phone: a.phone,
    email: a.email,
    rsvpToken: a.rsvpToken,
    rsvpStatus: a.rsvpStatus,
    hasPlusOne: a.hasPlusOne,
    dietaryPreference: a.dietaryPreference,
    checkedInAt: a.checkedInAt?.toISOString() ?? null,
  }));

  const appBaseUrl = getPublicBaseUrl();

  const statCards = [
    { label: "Capacity", value: event.capacity },
    { label: "On roster", value: event.attendees.length },
    { label: "Confirmed", value: confirmed.length },
    { label: "Checked in", value: checkedIn.length },
  ];

  return (
    <div className="flex-1">
      <div className="mx-auto w-full max-w-6xl space-y-5 py-2 sm:space-y-6 sm:py-4">
        <header className="space-y-5">
          <nav className="text-[13px] text-stone-500 dark:text-stone-400">
            <Link href="/events" className="font-medium hover:text-teal-600 dark:hover:text-teal-400">
              Events
            </Link>
            <span className="mx-2 text-stone-300 dark:text-stone-600">/</span>
            <span className="text-stone-700 dark:text-stone-300">Roster</span>
          </nav>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white lg:text-[1.65rem]">
                {event.title}
              </h1>
              <EventSubtitle
                date={event.date}
                venue={event.venue}
                className="text-sm text-stone-600 dark:text-stone-400"
              />
            </div>
            <div className="flex shrink-0 flex-col gap-2 max-lg:w-full lg:flex-row lg:flex-wrap lg:justify-end">
              <Link
                href={`/events/${event.id}/check-in`}
                className="inline-flex h-10 w-full items-center justify-center rounded-full bg-teal-600 px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-teal-500 lg:h-9 lg:w-auto"
              >
                Open check-in mode
              </Link>
              <a
                href={`/api/events/${event.id}/export`}
                className="inline-flex h-10 w-full items-center justify-center rounded-full bg-white px-4 text-[13px] font-semibold text-stone-800 shadow-sm ring-1 ring-stone-200/80 transition hover:bg-stone-50 dark:bg-stone-900 dark:text-stone-100 dark:ring-stone-700 dark:hover:bg-stone-800 lg:h-9 lg:w-auto"
              >
                Export CSV
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-white px-3 py-3 shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-900 dark:ring-stone-700/50 sm:px-4"
              >
                <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">{s.label}</div>
                <div className="mt-0.5 text-xl font-bold tabular-nums tracking-tight text-stone-900 dark:text-white">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* Mobile: add guest first. Desktop (lg+): roster left, add-guest sidebar right */}
        <div className="flex w-full flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-6">
          <div className="order-2 min-w-0 space-y-6 lg:order-1 lg:col-start-1">
            <EventRoster eventId={event.id} rows={rosterRows} appBaseUrl={appBaseUrl} />

            <section className="space-y-3">
              <div>
                <h2 className="text-sm font-semibold text-stone-900 dark:text-white">No-shows</h2>
                <p className="mt-0.5 text-[13px] text-stone-500 dark:text-stone-400">
                  Confirmed RSVPs not checked in yet.
                </p>
              </div>
              {noShows.length === 0 ? (
                <p className="rounded-xl bg-white px-4 py-3 text-[13px] text-stone-600 shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-900 dark:text-stone-400 dark:ring-stone-700/50">
                  None — every confirmed guest is checked in.
                </p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {noShows.map((a) => (
                    <li
                      key={a.id}
                      className="rounded-full bg-amber-50 px-3 py-1 text-[12px] font-medium text-amber-950 dark:bg-amber-950/35 dark:text-amber-100"
                    >
                      {a.name}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className="order-1 w-full lg:order-2 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-6 lg:self-start">
            <AddAttendeeForm eventId={event.id} />
          </aside>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { AddAttendeeForm } from "@/components/AddAttendeeForm";
import { EventRoster } from "@/components/EventRoster";
import { formatEventDateTime } from "@/lib/formatDate";
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
      <div className="w-full space-y-10 px-5 py-10 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
        <header className="space-y-8">
          <nav className="text-sm text-stone-500 dark:text-stone-400">
            <Link href="/events" className="font-medium hover:text-teal-600 dark:hover:text-teal-400">
              Events
            </Link>
            <span className="mx-2 text-stone-300 dark:text-stone-600">/</span>
            <span className="text-stone-700 dark:text-stone-300">Roster</span>
          </nav>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
                {event.title}
              </h1>
              <p className="text-stone-600 dark:text-stone-400">
                {event.venue} · {formatEventDateTime(event.date)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/events/${event.id}/check-in`}
                className="inline-flex h-11 items-center justify-center rounded-full bg-teal-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
              >
                Open check-in mode
              </Link>
              <a
                href={`/api/events/${event.id}/export`}
                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-stone-200/80 transition hover:bg-stone-50 dark:bg-stone-900 dark:text-stone-100 dark:ring-stone-700 dark:hover:bg-stone-800"
              >
                Export CSV
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-900 dark:ring-stone-700/50 sm:px-5"
              >
                <div className="text-xs font-medium text-stone-500 dark:text-stone-400">{s.label}</div>
                <div className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-stone-900 dark:text-white">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </header>

        <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[minmax(0,1fr)_17.5rem] xl:items-start xl:gap-8">
          <div className="min-w-0 space-y-8">
            <EventRoster eventId={event.id} rows={rosterRows} appBaseUrl={appBaseUrl} />

            <section className="space-y-4">
              <div>
                <h2 className="text-base font-semibold text-stone-900 dark:text-white">No-shows</h2>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  Confirmed RSVPs not checked in yet.
                </p>
              </div>
              {noShows.length === 0 ? (
                <p className="rounded-2xl bg-white px-5 py-5 text-sm text-stone-600 shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-900 dark:text-stone-400 dark:ring-stone-700/50">
                  None — every confirmed guest is checked in.
                </p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {noShows.map((a) => (
                    <li
                      key={a.id}
                      className="rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-950 dark:bg-amber-950/35 dark:text-amber-100"
                    >
                      {a.name}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className="xl:sticky xl:top-8 xl:self-start">
            <AddAttendeeForm eventId={event.id} />
          </aside>
        </div>
      </div>
    </div>
  );
}

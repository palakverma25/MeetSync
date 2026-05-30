import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckInPanel } from "@/components/CheckInPanel";
import { EventSubtitle } from "@/components/EventSubtitle";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function CheckInPage({ params }: PageProps) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: { attendees: { orderBy: { name: "asc" } } },
  });

  if (!event) notFound();

  const confirmedCount = event.attendees.filter(
    (a) => a.rsvpStatus === "confirmed",
  ).length;
  const checkedInCount = event.attendees.filter((a) => a.checkedInAt).length;
  const progressPct =
    confirmedCount > 0 ? Math.min(100, (checkedInCount / confirmedCount) * 100) : 0;

  const statCards = [
    { label: "Checked in", value: checkedInCount },
    { label: "Confirmed", value: confirmedCount },
    { label: "On list", value: event.attendees.length },
    { label: "Complete", value: `${Math.round(progressPct)}%` },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-3 pb-10 pt-3 sm:space-y-6 sm:px-4 sm:pb-12 sm:pt-4 lg:px-6">
      <header className="space-y-5">
        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-400 transition hover:text-white"
        >
          <span aria-hidden className="text-base leading-none">
            ←
          </span>
          Back to roster
        </Link>

        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-400/90">
            Door check-in
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-white lg:text-[1.65rem]">
            {event.title}
          </h1>
          <EventSubtitle
            date={event.date}
            venue={event.venue}
            className="text-sm text-stone-400"
          />
          <p className="max-w-2xl text-sm text-stone-400">
            Search by name or phone, then tap <span className="font-medium text-stone-300">Check in</span>.
            Undo if you tapped the wrong person.
          </p>
        </div>

        <div className="hidden grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-stone-900/55 px-3 py-3 ring-1 ring-white/10 sm:px-4"
            >
              <div className="text-[11px] font-medium text-stone-500">{s.label}</div>
              <div className="mt-0.5 text-xl font-bold tabular-nums tracking-tight text-white">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div
          className="hidden h-2 overflow-hidden rounded-full bg-stone-800 ring-1 ring-white/5 lg:block"
          role="progressbar"
          aria-valuenow={Math.round(progressPct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-teal-500 to-emerald-400 transition-[width] duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      <CheckInPanel
        eventId={event.id}
        confirmedCount={confirmedCount}
        checkedInCount={checkedInCount}
        attendees={event.attendees.map((a) => ({
          id: a.id,
          name: a.name,
          phone: a.phone,
          rsvpStatus: a.rsvpStatus,
          checkedInAt: a.checkedInAt?.toISOString() ?? null,
        }))}
      />
    </div>
  );
}

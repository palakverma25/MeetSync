import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckInPanel } from "@/components/CheckInPanel";
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

  return (
    <div className="mx-auto max-w-lg px-4 pb-10 pt-4 sm:px-5 sm:pb-12 sm:pt-5">
      <header className="mb-6 space-y-3">
        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-400 transition hover:text-white"
        >
          <span aria-hidden className="text-base leading-none">
            ←
          </span>
          Back to roster
        </Link>
        <div>
          <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight text-white sm:text-[1.65rem]">
            {event.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-400">
            Search by name or phone, then tap <span className="font-medium text-stone-300">Check in</span>.
            Undo if you tapped the wrong person.
          </p>
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

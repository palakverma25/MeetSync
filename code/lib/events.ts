import { prisma } from "@/lib/prisma";

export type EventListItem = {
  id: string;
  title: string;
  venue: string;
  date: Date;
  capacity: number;
  attendeeCount: number;
  confirmedCount: number;
  checkedInCount: number;
};

export async function listEventsWithStats(): Promise<EventListItem[]> {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: { _count: { select: { attendees: true } } },
  });

  const checkedInGroups = await prisma.attendee.groupBy({
    by: ["eventId"],
    where: { checkedInAt: { not: null } },
    _count: { _all: true },
  });
  const confirmedGroups = await prisma.attendee.groupBy({
    by: ["eventId"],
    where: { rsvpStatus: "confirmed" },
    _count: { _all: true },
  });

  const checkedMap = Object.fromEntries(
    checkedInGroups.map((g) => [g.eventId, g._count._all]),
  );
  const confirmedMap = Object.fromEntries(
    confirmedGroups.map((g) => [g.eventId, g._count._all]),
  );

  return events.map((e) => ({
    id: e.id,
    title: e.title,
    venue: e.venue,
    date: e.date,
    capacity: e.capacity,
    attendeeCount: e._count.attendees,
    confirmedCount: confirmedMap[e.id] ?? 0,
    checkedInCount: checkedMap[e.id] ?? 0,
  }));
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

  const payload = events.map((e) => ({
    id: e.id,
    title: e.title,
    venue: e.venue,
    date: e.date.toISOString(),
    capacity: e.capacity,
    createdAt: e.createdAt.toISOString(),
    attendeeCount: e._count.attendees,
    confirmedCount: confirmedMap[e.id] ?? 0,
    checkedInCount: checkedMap[e.id] ?? 0,
  }));

  return NextResponse.json(payload);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const title = typeof b.title === "string" ? b.title.trim() : "";
  const venue = typeof b.venue === "string" ? b.venue.trim() : "";
  const capacity = typeof b.capacity === "number" ? b.capacity : Number(b.capacity);
  const dateRaw = typeof b.date === "string" ? b.date : "";

  if (!title || !venue || !dateRaw || !Number.isFinite(capacity) || capacity < 1) {
    return NextResponse.json(
      { error: "title, venue, date (ISO), and capacity are required" },
      { status: 400 },
    );
  }

  const date = new Date(dateRaw);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title,
      venue,
      date,
      capacity: Math.floor(capacity),
    },
  });

  return NextResponse.json(
    {
      id: event.id,
      title: event.title,
      venue: event.venue,
      date: event.date.toISOString(),
      capacity: event.capacity,
      createdAt: event.createdAt.toISOString(),
    },
    { status: 201 },
  );
}

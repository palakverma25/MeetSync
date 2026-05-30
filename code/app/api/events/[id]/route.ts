import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/apiAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const auth = await requireApiAuth(req);
  if (auth.response) return auth.response;

  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      attendees: { orderBy: { name: "asc" } },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const confirmedCount = event.attendees.filter(
    (a) => a.rsvpStatus === "confirmed",
  ).length;
  const checkedInCount = event.attendees.filter((a) => a.checkedInAt).length;

  return NextResponse.json({
    id: event.id,
    title: event.title,
    venue: event.venue,
    date: event.date.toISOString(),
    capacity: event.capacity,
    createdAt: event.createdAt.toISOString(),
    stats: {
      attendeeCount: event.attendees.length,
      confirmedCount,
      checkedInCount,
    },
    attendees: event.attendees.map((a) => ({
      id: a.id,
      name: a.name,
      phone: a.phone,
      email: a.email,
      dietaryPreference: a.dietaryPreference,
      hasPlusOne: a.hasPlusOne,
      rsvpStatus: a.rsvpStatus,
      checkedInAt: a.checkedInAt?.toISOString() ?? null,
    })),
  });
}

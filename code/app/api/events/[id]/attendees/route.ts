import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const { id: eventId } = await params;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const dietaryPreference =
    typeof b.dietaryPreference === "string" ? b.dietaryPreference.trim() : "";
  const hasPlusOne = Boolean(b.hasPlusOne);
  const rsvpStatus =
    typeof b.rsvpStatus === "string" && ["confirmed", "declined", "pending"].includes(b.rsvpStatus)
      ? b.rsvpStatus
      : "confirmed";

  if (!name || !phone) {
    return NextResponse.json(
      { error: "name and phone are required" },
      { status: 400 },
    );
  }

  const attendee = await prisma.attendee.create({
    data: {
      eventId,
      name,
      phone,
      dietaryPreference,
      hasPlusOne,
      rsvpStatus,
    },
  });

  return NextResponse.json(
    {
      id: attendee.id,
      name: attendee.name,
      phone: attendee.phone,
      dietaryPreference: attendee.dietaryPreference,
      hasPlusOne: attendee.hasPlusOne,
      rsvpStatus: attendee.rsvpStatus,
      checkedInAt: attendee.checkedInAt?.toISOString() ?? null,
    },
    { status: 201 },
  );
}

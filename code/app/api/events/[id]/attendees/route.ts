import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/apiAuth";
import { prisma } from "@/lib/prisma";
import { parseOptionalEmail, validatePhone } from "@/lib/rsvp";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const auth = await requireApiAuth(req);
  if (auth.response) return auth.response;

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
  const phoneRaw = typeof b.phone === "string" ? b.phone : "";
  const emailRaw = typeof b.email === "string" ? b.email : "";
  const dietaryPreference =
    typeof b.dietaryPreference === "string" ? b.dietaryPreference.trim() : "";
  const hasPlusOne = Boolean(b.hasPlusOne);
  const rsvpStatus =
    typeof b.rsvpStatus === "string" && ["confirmed", "declined", "pending"].includes(b.rsvpStatus)
      ? b.rsvpStatus
      : "confirmed";

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const phoneResult = validatePhone(phoneRaw);
  if (!phoneResult.ok) {
    return NextResponse.json({ error: phoneResult.error }, { status: 400 });
  }

  const emailResult = parseOptionalEmail(emailRaw);
  if (!emailResult.ok) {
    return NextResponse.json({ error: emailResult.error }, { status: 400 });
  }
  const email = emailResult.email;

  const attendee = await prisma.attendee.create({
    data: {
      eventId,
      name,
      phone: phoneResult.value,
      email,
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
      email: attendee.email,
      dietaryPreference: attendee.dietaryPreference,
      hasPlusOne: attendee.hasPlusOne,
      rsvpStatus: attendee.rsvpStatus,
      checkedInAt: attendee.checkedInAt?.toISOString() ?? null,
    },
    { status: 201 },
  );
}

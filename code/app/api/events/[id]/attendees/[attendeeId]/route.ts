import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/apiAuth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; attendeeId: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const auth = await requireApiAuth(req);
  if (auth.response) return auth.response;

  const { id: eventId, attendeeId } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = (body as { action?: string }).action;
  if (action !== "checkIn" && action !== "undoCheckIn") {
    return NextResponse.json(
      { error: "action must be checkIn or undoCheckIn" },
      { status: 400 },
    );
  }

  const attendee = await prisma.attendee.findFirst({
    where: { id: attendeeId, eventId },
  });

  if (!attendee) {
    return NextResponse.json({ error: "Attendee not found" }, { status: 404 });
  }

  if (attendee.rsvpStatus !== "confirmed" && action === "checkIn") {
    return NextResponse.json(
      { error: "Only confirmed guests can be checked in" },
      { status: 409 },
    );
  }

  const now = new Date();

  if (action === "checkIn") {
    const updated = await prisma.attendee.update({
      where: { id: attendeeId },
      data: {
        checkedInAt: attendee.checkedInAt ?? now,
      },
    });
    return NextResponse.json({
      id: updated.id,
      checkedInAt: updated.checkedInAt?.toISOString() ?? null,
      idempotent: Boolean(attendee.checkedInAt),
    });
  }

  const updated = await prisma.attendee.update({
    where: { id: attendeeId },
    data: { checkedInAt: null },
  });

  return NextResponse.json({
    id: updated.id,
    checkedInAt: null,
  });
}

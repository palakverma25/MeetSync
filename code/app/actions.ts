"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatEventDateTime } from "@/lib/formatDate";
import { sendRsvpInviteEmail } from "@/lib/sendRsvpInvite";
import { clampDietaryPreference, looksLikeEmail } from "@/lib/rsvp";

export type FormState = { ok: boolean; error: string | null; info?: string | null };

const ok: FormState = { ok: true, error: null, info: null };

export async function createEvent(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = String(formData.get("title") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim();
  const dateStr = String(formData.get("date") ?? "").trim();
  const capacityRaw = String(formData.get("capacity") ?? "").trim();
  const capacity = Number.parseInt(capacityRaw, 10);

  if (!title || !venue || !dateStr || !Number.isFinite(capacity) || capacity < 1) {
    return { ok: false, error: "Please fill all fields with valid values." };
  }

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: "Invalid date." };
  }

  const event = await prisma.event.create({
    data: { title, venue, date, capacity },
  });

  revalidatePath("/events");
  redirect(`/events/${event.id}`);
}

export async function addAttendee(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const eventId = String(formData.get("eventId") ?? "").trim();
  if (!eventId) {
    return { ok: false, error: "Missing event." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const emailRaw = String(formData.get("email") ?? "").trim();
  const email = emailRaw ? emailRaw : null;
  const dietaryPreference = clampDietaryPreference(
    String(formData.get("dietaryPreference") ?? ""),
  );
  const hasPlusOne = formData.get("hasPlusOne") === "on";
  const rsvpStatus = String(formData.get("rsvpStatus") ?? "confirmed");
  const sendInvite = formData.get("sendInvite") === "on";

  if (!name || !phone) {
    return { ok: false, error: "Name and phone are required." };
  }

  if (email && !looksLikeEmail(email)) {
    return { ok: false, error: "Please enter a valid email address, or leave it blank." };
  }

  if (sendInvite && !email) {
    return { ok: false, error: "Add an email address to send the RSVP invite." };
  }

  let status =
    rsvpStatus === "declined" || rsvpStatus === "pending"
      ? rsvpStatus
      : "confirmed";

  if (sendInvite) {
    status = "pending";
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { title: true, venue: true, date: true },
  });
  if (!event) {
    return { ok: false, error: "Event not found." };
  }

  const attendee = await prisma.attendee.create({
    data: {
      eventId,
      name,
      phone,
      email,
      dietaryPreference,
      hasPlusOne,
      rsvpStatus: status,
    },
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/events/${eventId}/check-in`);

  if (sendInvite && email) {
    const sendRes = await sendRsvpInviteEmail({
      to: email,
      guestName: name,
      eventTitle: event.title,
      eventVenue: event.venue,
      eventDateLabel: formatEventDateTime(event.date),
      rsvpToken: attendee.rsvpToken,
    });

    if (!sendRes.ok) {
      return {
        ok: true,
        error: null,
        info: `Guest added as pending. Email failed: ${sendRes.error}. Use “Copy RSVP link” on the roster to send the link manually.`,
      };
    }
    if (sendRes.skipped) {
      return {
        ok: true,
        error: null,
        info: `Guest added as pending. ${sendRes.reason}`,
      };
    }
    return {
      ok: true,
      error: null,
      info: "Guest added and RSVP email sent (pending until they respond).",
    };
  }

  return ok;
}

export async function toggleCheckIn(
  eventId: string,
  attendeeId: string,
  checkIn: boolean,
) {
  const attendee = await prisma.attendee.findFirst({
    where: { id: attendeeId, eventId },
  });

  if (!attendee) {
    return { ok: false as const, error: "Attendee not found." };
  }

  if (checkIn && attendee.rsvpStatus !== "confirmed") {
    return { ok: false as const, error: "Only confirmed guests can be checked in." };
  }

  if (checkIn) {
    await prisma.attendee.update({
      where: { id: attendeeId },
      data: { checkedInAt: attendee.checkedInAt ?? new Date() },
    });
  } else {
    await prisma.attendee.update({
      where: { id: attendeeId },
      data: { checkedInAt: null },
    });
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/events/${eventId}/check-in`);
  return { ok: true as const };
}

const RSVP_OPTIONS = ["confirmed", "pending", "declined"] as const;

export async function updateAttendeeRsvp(
  eventId: string,
  attendeeId: string,
  nextStatus: string,
) {
  const status = RSVP_OPTIONS.includes(nextStatus as (typeof RSVP_OPTIONS)[number])
    ? nextStatus
    : "confirmed";

  const attendee = await prisma.attendee.findFirst({
    where: { id: attendeeId, eventId },
  });

  if (!attendee) {
    return { ok: false as const, error: "Guest not found." };
  }

  const data: { rsvpStatus: string; checkedInAt?: Date | null } = {
    rsvpStatus: status,
  };

  if (status !== "confirmed" && attendee.checkedInAt) {
    data.checkedInAt = null;
  }

  await prisma.attendee.update({
    where: { id: attendeeId },
    data,
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/events/${eventId}/check-in`);
  revalidatePath("/events");
  return { ok: true as const };
}

export async function sendGuestRsvpInviteEmail(attendeeId: string): Promise<{
  ok: boolean;
  error?: string;
  info?: string;
}> {
  const attendee = await prisma.attendee.findUnique({
    where: { id: attendeeId },
    include: {
      event: { select: { id: true, title: true, venue: true, date: true } },
    },
  });

  if (!attendee) {
    return { ok: false, error: "Guest not found." };
  }

  if (!attendee.email) {
    return { ok: false, error: "This guest has no email on file. Add an email or use Copy RSVP link." };
  }

  const sendRes = await sendRsvpInviteEmail({
    to: attendee.email,
    guestName: attendee.name,
    eventTitle: attendee.event.title,
    eventVenue: attendee.event.venue,
    eventDateLabel: formatEventDateTime(attendee.event.date),
    rsvpToken: attendee.rsvpToken,
  });

  if (!sendRes.ok) {
    return { ok: false, error: sendRes.error };
  }

  if (sendRes.skipped) {
    return { ok: true, info: sendRes.reason };
  }

  revalidatePath(`/events/${attendee.eventId}`);
  return { ok: true, info: "Invite email sent." };
}

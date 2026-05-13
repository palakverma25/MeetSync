"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export type FormState = { ok: boolean; error: string | null };

const ok: FormState = { ok: true, error: null };

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
  const dietaryPreference = String(
    formData.get("dietaryPreference") ?? "",
  ).trim();
  const hasPlusOne = formData.get("hasPlusOne") === "on";
  const rsvpStatus = String(formData.get("rsvpStatus") ?? "confirmed");

  if (!name || !phone) {
    return { ok: false, error: "Name and phone are required." };
  }

  const status =
    rsvpStatus === "declined" || rsvpStatus === "pending"
      ? rsvpStatus
      : "confirmed";

  await prisma.attendee.create({
    data: {
      eventId,
      name,
      phone,
      dietaryPreference,
      hasPlusOne,
      rsvpStatus: status,
    },
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/events/${eventId}/check-in`);
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

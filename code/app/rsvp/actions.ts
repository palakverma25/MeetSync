"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { clampDietaryPreference } from "@/lib/rsvp";

const RSVP_OPTIONS = ["confirmed", "pending", "declined"] as const;

export type GuestRsvpState = { ok: boolean; error: string | null };

export async function submitGuestRsvp(
  _prev: GuestRsvpState,
  formData: FormData,
): Promise<GuestRsvpState> {
  const token = String(formData.get("token") ?? "").trim();
  if (!token) {
    return { ok: false, error: "Invalid invitation link." };
  }

  const attendee = await prisma.attendee.findUnique({
    where: { rsvpToken: token },
    include: { event: true },
  });

  if (!attendee) {
    return { ok: false, error: "This invitation link is invalid or has expired." };
  }

  const raw = String(formData.get("rsvpStatus") ?? "pending");
  const status = RSVP_OPTIONS.includes(raw as (typeof RSVP_OPTIONS)[number])
    ? raw
    : "pending";

  const dietaryPreference = clampDietaryPreference(
    String(formData.get("dietaryPreference") ?? ""),
  );
  const hasPlusOne = formData.get("hasPlusOne") === "on";

  const data: {
    rsvpStatus: string;
    dietaryPreference: string;
    hasPlusOne: boolean;
    checkedInAt?: Date | null;
  } = {
    rsvpStatus: status,
    dietaryPreference,
    hasPlusOne,
  };

  if (status !== "confirmed" && attendee.checkedInAt) {
    data.checkedInAt = null;
  }

  await prisma.attendee.update({
    where: { id: attendee.id },
    data,
  });

  revalidatePath(`/events/${attendee.eventId}`);
  revalidatePath(`/events/${attendee.eventId}/check-in`);
  revalidatePath("/events");
  revalidatePath(`/rsvp/${token}`);

  return { ok: true, error: null };
}

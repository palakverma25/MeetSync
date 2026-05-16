"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { clampDietaryPreference } from "@/lib/rsvp";

const RSVP_OPTIONS = ["confirmed", "pending", "declined"] as const;
type RsvpStatus = (typeof RSVP_OPTIONS)[number];

function parseRsvpStatus(raw: string): RsvpStatus {
  return RSVP_OPTIONS.includes(raw as RsvpStatus) ? (raw as RsvpStatus) : "pending";
}

export type GuestRsvpState = {
  ok: boolean;
  error: string | null;
  rsvpStatus?: RsvpStatus;
};

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

  const status = parseRsvpStatus(String(formData.get("rsvpStatus") ?? "pending"));

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

  return { ok: true, error: null, rsvpStatus: status };
}

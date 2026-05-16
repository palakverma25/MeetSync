import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuestRsvpForm } from "@/components/GuestRsvpForm";
import { MeetSyncWordmark } from "@/components/MeetSyncWordmark";
import { formatEventDateTime } from "@/lib/formatDate";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ token: string }> };

export const metadata: Metadata = {
  title: "RSVP",
  description: "Respond to your event invitation.",
  robots: { index: false, follow: false },
};

export default async function GuestRsvpPage({ params }: PageProps) {
  const { token: raw } = await params;
  const token = decodeURIComponent(raw).trim();
  if (!token) notFound();

  const attendee = await prisma.attendee.findUnique({
    where: { rsvpToken: token },
    include: { event: true },
  });

  if (!attendee) notFound();

  return (
    <div className="min-h-screen bg-stone-100 px-4 py-6 dark:bg-stone-950 sm:py-8">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-5 flex justify-center">
          <MeetSyncWordmark size="sm" />
        </div>
        <GuestRsvpForm
          token={token}
          guestName={attendee.name}
          eventTitle={attendee.event.title}
          eventVenue={attendee.event.venue}
          eventWhen={formatEventDateTime(attendee.event.date)}
          defaultRsvp={attendee.rsvpStatus}
          defaultDietary={attendee.dietaryPreference}
          defaultPlusOne={attendee.hasPlusOne}
        />
      </div>
    </div>
  );
}

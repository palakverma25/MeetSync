import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuestRsvpForm } from "@/components/GuestRsvpForm";
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
    <div className="min-h-screen bg-stone-100 px-4 py-12 dark:bg-stone-950">
      <div className="mx-auto max-w-lg">
        <p className="mb-6 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-stone-500 transition hover:text-teal-600 dark:text-stone-400 dark:hover:text-teal-400"
          >
            MeetSync
          </Link>
        </p>
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

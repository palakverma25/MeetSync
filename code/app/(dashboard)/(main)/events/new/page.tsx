import Link from "next/link";
import { CreateEventForm } from "@/components/CreateEventForm";

export const metadata = {
  title: "New event — MeetSync",
};

export default function NewEventPage() {
  return (
    <div className="flex-1">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-5 sm:py-7 md:px-6">
        <header className="space-y-3">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-500 transition hover:text-teal-600 dark:text-stone-400 dark:hover:text-teal-400"
          >
            <span aria-hidden className="text-sm leading-none">
              ←
            </span>
            All events
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-[1.75rem]">
              New event
            </h1>
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              Add when and where — next you&apos;ll open the roster to invite guests, run check-in, and
              export who showed up.
            </p>
          </div>
          <ol className="flex flex-wrap gap-2 text-[11px] font-medium text-stone-500 dark:text-stone-400">
            <li className="rounded-full bg-white px-2.5 py-1 ring-1 ring-stone-200/80 dark:bg-stone-900 dark:ring-stone-700/80">
              <span className="text-teal-600 dark:text-teal-400">1</span> Details
            </li>
            <li className="rounded-full bg-stone-100/80 px-2.5 py-1 dark:bg-stone-800/50">
              <span className="text-stone-400">2</span> Roster &amp; check-in
            </li>
          </ol>
        </header>

        <CreateEventForm />
      </div>
    </div>
  );
}

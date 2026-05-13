import Link from "next/link";
import { CreateEventForm } from "@/components/CreateEventForm";

export const metadata = {
  title: "New event — MeetSync",
};

export default function NewEventPage() {
  return (
    <div className="flex-1">
      <div className="w-full space-y-10 px-5 py-10 sm:px-6 md:px-8 lg:px-10 lg:py-12 xl:px-12 2xl:px-14">
        <header className="space-y-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition hover:text-teal-600 dark:text-stone-400 dark:hover:text-teal-400"
          >
            <span aria-hidden className="text-base leading-none">
              ←
            </span>
            All events
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
              New event
            </h1>
            <p className="max-w-3xl text-pretty text-base leading-relaxed text-stone-600 dark:text-stone-400">
              Add when and where — next you&apos;ll open the roster to invite guests, run check-in, and
              export who showed up.
            </p>
          </div>
          <ol className="flex flex-wrap gap-3 text-xs font-medium text-stone-500 dark:text-stone-400">
            <li className="rounded-full bg-white px-3 py-1.5 ring-1 ring-stone-200/80 dark:bg-stone-900 dark:ring-stone-700/80">
              <span className="text-teal-600 dark:text-teal-400">1</span> Details
            </li>
            <li className="rounded-full bg-stone-100/80 px-3 py-1.5 dark:bg-stone-800/50">
              <span className="text-stone-400">2</span> Roster &amp; check-in
            </li>
          </ol>
        </header>

        <CreateEventForm />
      </div>
    </div>
  );
}

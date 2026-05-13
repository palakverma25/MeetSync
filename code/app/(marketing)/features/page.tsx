import Link from "next/link";

export const metadata = {
  title: "Features — MeetSync",
  description: "Roster, check-in mode, exports, and how MeetSync fits your ops workflow.",
};

export default function FeaturesPage() {
  const blocks = [
    {
      title: "Events dashboard",
      desc: "Sortable overview of upcoming and past events. See capacity, total roster size, confirmed headcount, and check-in progress without opening a spreadsheet.",
      bullets: ["Create events in one form", "Jump straight to door mode", "Export when you need Excel"],
    },
    {
      title: "Event roster page",
      desc: "The operational home for a single show: attendee table, RSVP status, dietary notes, and +1 flags. Add last-minute names from the same screen volunteers already have open.",
      bullets: ["Confirmed-only check-in rules", "No-show list for follow-ups", "CSV of everyone who crossed the threshold"],
    },
    {
      title: "Dedicated check-in mode",
      desc: "A separate, minimal page tuned for phones and tablets at the door. Search by name or partial phone, one tap to check in, undo for mistakes, live counts after each action.",
      bullets: ["Large tap targets", "Idempotent check-in", "No sidebar clutter"],
    },
  ];

  return (
    <div className="bg-stone-50 dark:bg-stone-950">
      <div className="mx-auto max-w-3xl space-y-12 px-6 py-16 sm:px-8 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
          Product
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-900 dark:text-white">
          Everything has its own page
        </h1>
        <p className="mt-4 text-lg text-stone-600 dark:text-stone-400">
          We intentionally split marketing (this site) from the app so demos stay clear:
          pitch stakeholders here, run the night on the dashboard.
        </p>

        <div className="mt-14 space-y-10">
          {blocks.map((b, i) => (
            <article
              key={b.title}
              className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-900 dark:ring-stone-700/50"
            >
              <span className="text-xs font-bold uppercase text-stone-400 dark:text-stone-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-2 text-2xl font-semibold text-stone-900 dark:text-white">
                {b.title}
              </h2>
              <p className="mt-3 text-stone-600 dark:text-stone-400">{b.desc}</p>
              <ul className="mt-6 space-y-2">
                {b.bullets.map((x) => (
                  <li key={x} className="flex gap-2 text-sm text-stone-700 dark:text-stone-300">
                    <span className="text-teal-600 dark:text-teal-400">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-teal-600 p-8 text-center text-white shadow-sm dark:bg-teal-700">
          <p className="text-lg font-medium">Ready to try the app?</p>
          <Link
            href="/events"
            className="mt-4 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-teal-800 hover:bg-teal-50"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

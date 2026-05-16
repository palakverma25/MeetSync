import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <section className="hero-mesh relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">
            Internal ops · Check-in & attendance
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl sm:leading-tight dark:text-white">
            Calm check-ins.{" "}
            <span className="bg-linear-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent dark:from-teal-400 dark:to-emerald-300">
              Clear attendance.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-stone-600 dark:text-stone-300">
            Replace printed lists and messy spreadsheets with one focused workspace:
            roster, door mode, and exports your team can trust.
          </p>
          <div className="mt-10 flex flex-col items-stretch gap-3 px-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4 sm:px-0">
            <Link
              href="/events"
              className="inline-flex h-12 items-center justify-center rounded-full bg-teal-600 px-8 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-500"
            >
              Launch dashboard
            </Link>
            <Link
              href="/features"
              className="inline-flex h-12 items-center justify-center rounded-full border border-stone-300 bg-white/80 px-8 text-sm font-semibold text-stone-800 backdrop-blur transition hover:bg-white dark:border-stone-600 dark:bg-stone-900/80 dark:text-stone-100 dark:hover:bg-stone-800"
            >
              Explore features
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl gap-4 sm:grid-cols-3">
          {[
            { n: "30", l: "Events / year", d: "Right-sized for a small events crew." },
            { n: "Door", l: "Search & tap", d: "Name or phone lookup, idempotent check-in." },
            { n: "CSV", l: "After the show", d: "Who attended — ready for your next invite list." },
          ].map((item) => (
            <div
              key={item.l}
              className="rounded-2xl border border-stone-200/80 bg-white/70 p-6 text-left shadow-sm backdrop-blur dark:border-stone-700/80 dark:bg-stone-900/60"
            >
              <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">{item.n}</div>
              <div className="mt-1 font-semibold text-stone-900 dark:text-white">{item.l}</div>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white py-20 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-stone-900 dark:text-white">
            Built for the night-of, not the noise
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-stone-600 dark:text-stone-400">
            Three dedicated areas keep workflows obvious: plan on the dashboard, manage
            guests on the event page, run the door in full-screen check-in.
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Events hub",
                body: "Every show at a glance — capacity, RSVPs, and who is already in the room.",
                href: "/events",
              },
              {
                title: "Roster & no-shows",
                body: "Full table, add walk-ins, dietary flags, and a clear no-show list after doors.",
                href: "/features",
              },
              {
                title: "Check-in mode",
                body: "Large targets and instant search so volunteers never fight a spreadsheet on a phone.",
                href: "/features",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-2xl border border-stone-200 bg-stone-50 p-8 transition hover:border-teal-500/50 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 dark:hover:border-teal-500/40"
              >
                <h3 className="text-lg font-semibold text-stone-900 group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-400">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                  {card.body}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-teal-600 dark:text-teal-400">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

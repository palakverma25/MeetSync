"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toggleCheckIn } from "@/app/actions";

export type CheckInRow = {
  id: string;
  name: string;
  phone: string;
  rsvpStatus: string;
  checkedInAt: string | null;
};

type Props = {
  eventId: string;
  attendees: CheckInRow[];
  confirmedCount: number;
  checkedInCount: number;
};

function sortForDoor(rows: CheckInRow[]) {
  return [...rows].sort((a, b) => {
    const tier = (r: CheckInRow) => {
      if (r.rsvpStatus !== "confirmed") return 2;
      return r.checkedInAt ? 1 : 0;
    };
    const d = tier(a) - tier(b);
    if (d !== 0) return d;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

export function CheckInPanel({
  eventId,
  attendees,
  confirmedCount,
  checkedInCount,
}: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const base = !s
      ? attendees
      : attendees.filter(
          (a) =>
            a.name.toLowerCase().includes(s) ||
            a.phone.replace(/\s/g, "").toLowerCase().includes(s.replace(/\s/g, "")),
        );
    return sortForDoor(base);
  }, [attendees, q]);

  const progressPct =
    confirmedCount > 0 ? Math.min(100, (checkedInCount / confirmedCount) * 100) : 0;

  function onCheckIn(id: string, next: boolean) {
    setPendingId(id);
    startTransition(async () => {
      await toggleCheckIn(eventId, id, next);
      setPendingId(null);
      router.refresh();
    });
  }

  const showingLabel =
    q.trim().length > 0
      ? `${filtered.length} match${filtered.length === 1 ? "" : "es"}`
      : `${attendees.length} on list`;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <section
        className="rounded-3xl bg-stone-900/55 p-5 ring-1 ring-white/10 backdrop-blur-sm sm:p-6"
        aria-label="Check-in progress"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Progress
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-white">
              {checkedInCount}
              <span className="text-lg font-semibold text-stone-500"> / {confirmedCount}</span>
            </p>
            <p className="mt-1 text-xs text-stone-500">Confirmed guests through the door</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums text-teal-400">{Math.round(progressPct)}%</p>
            <p className="text-xs text-stone-500">complete</p>
          </div>
        </div>
        <div
          className="mt-5 h-2.5 overflow-hidden rounded-full bg-stone-800 ring-1 ring-white/5"
          role="progressbar"
          aria-valuenow={Math.round(progressPct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-teal-500 to-emerald-400 transition-[width] duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </section>

      {/* Search — sticky below global header */}
      <div className="sticky top-2 z-20 -mx-1 px-1 pt-1">
        <label className="block">
          <span className="sr-only">Search by name or phone</span>
          <div className="relative">
            <span
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
              aria-hidden
            >
              ⌕
            </span>
            <input
              type="search"
              inputMode="search"
              autoComplete="off"
              autoFocus
              placeholder="Search name or phone…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-2xl border-0 bg-stone-900/70 py-4 pl-11 pr-4 text-base text-white shadow-lg shadow-black/20 ring-1 ring-white/10 outline-none transition placeholder:text-stone-500 focus:ring-2 focus:ring-teal-500/50"
            />
          </div>
        </label>
        <p className="mt-2 px-1 text-center text-xs text-stone-500">{showingLabel}</p>
      </div>

      {/* Guest list */}
      <section aria-label="Guest list">
        <h2 className="sr-only">Guests</h2>
        <ul className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <li className="rounded-3xl bg-stone-900/40 px-5 py-14 text-center ring-1 ring-white/8">
              <p className="text-sm font-medium text-stone-300">No guests match that search</p>
              <p className="mt-2 text-xs text-stone-500">Try another spelling or phone fragment.</p>
            </li>
          ) : (
            filtered.map((a) => {
              const ineligible = a.rsvpStatus !== "confirmed";
              const checked = Boolean(a.checkedInAt);
              const busy = isPending && pendingId === a.id;

              return (
                <li key={a.id}>
                  <div
                    className={[
                      "flex min-h-17 flex-col gap-3 rounded-3xl px-4 py-4 transition sm:flex-row sm:items-center sm:gap-4 sm:py-3",
                      checked
                        ? "bg-teal-950/35 ring-1 ring-teal-500/25"
                        : "bg-stone-900/45 ring-1 ring-white/8",
                      "active:scale-[0.99]",
                    ].join(" ")}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-lg font-semibold leading-snug text-white">
                          {a.name}
                        </span>
                        {checked ? (
                          <span className="shrink-0 rounded-full bg-teal-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-200">
                            In
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate text-sm text-stone-400">{a.phone}</p>
                      {ineligible ? (
                        <p className="mt-2 text-xs font-medium text-amber-300/90">
                          Not on confirmed list ({a.rsvpStatus})
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 sm:justify-end">
                      {checked ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onCheckIn(a.id, false)}
                          className="min-h-12 w-full rounded-2xl bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:opacity-50 sm:min-h-11 sm:w-auto sm:min-w-22"
                        >
                          {busy ? "…" : "Undo"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={ineligible || busy}
                          onClick={() => onCheckIn(a.id, true)}
                          className="min-h-12 w-full rounded-2xl bg-teal-500 px-5 text-sm font-bold text-stone-950 shadow-md shadow-teal-900/30 transition hover:bg-teal-400 active:bg-teal-600 disabled:cursor-not-allowed disabled:bg-stone-800 disabled:text-stone-500 disabled:shadow-none sm:min-h-11 sm:w-auto sm:min-w-30"
                        >
                          {busy ? "…" : "Check in"}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </div>
  );
}

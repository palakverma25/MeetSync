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

function GuestActions({
  row,
  busy,
  onCheckIn,
}: {
  row: CheckInRow;
  busy: boolean;
  onCheckIn: (id: string, next: boolean) => void;
}) {
  const ineligible = row.rsvpStatus !== "confirmed";
  const checked = Boolean(row.checkedInAt);

  if (checked) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => onCheckIn(row.id, false)}
        className="min-h-11 w-full rounded-xl bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15 disabled:opacity-50 lg:min-h-9 lg:w-auto lg:min-w-[5.5rem] lg:rounded-lg"
      >
        {busy ? "…" : "Undo"}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={ineligible || busy}
      onClick={() => onCheckIn(row.id, true)}
      className="min-h-11 w-full rounded-xl bg-teal-500 px-4 text-sm font-bold text-stone-950 shadow-md shadow-teal-900/30 transition hover:bg-teal-400 active:bg-teal-600 disabled:cursor-not-allowed disabled:bg-stone-800 disabled:text-stone-500 disabled:shadow-none lg:min-h-9 lg:w-auto lg:min-w-[7rem] lg:rounded-lg"
    >
      {busy ? "…" : "Check in"}
    </button>
  );
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

  const searchInput = (
    <label className="block">
      <span className="sr-only">Search by name or phone</span>
      <input
        type="search"
        inputMode="search"
        autoComplete="off"
        autoFocus
        placeholder="Search name or phone…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full rounded-lg bg-stone-800/80 px-2.5 py-2 text-[13px] text-white ring-1 ring-white/10 outline-none transition placeholder:text-stone-500 focus:ring-2 focus:ring-teal-500/40 lg:bg-stone-800/50 lg:py-2.5 lg:text-[14px]"
      />
    </label>
  );

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      {/* Mobile: progress card + sticky search above cards */}
      <div className="flex flex-col gap-5 lg:hidden">
        <section
          className="rounded-2xl bg-stone-900/55 p-4 ring-1 ring-white/10 sm:rounded-3xl sm:p-5"
          aria-label="Check-in progress"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Progress</p>
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
            className="mt-4 h-2.5 overflow-hidden rounded-full bg-stone-800 ring-1 ring-white/5"
            role="progressbar"
            aria-valuenow={Math.round(progressPct)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-teal-500 to-emerald-400 transition-[width] duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </section>

        <div className="sticky top-2 z-20">
          {searchInput}
          <p className="mt-2 text-center text-xs text-stone-500">{showingLabel}</p>
        </div>
      </div>

      {/* Guest list card — desktop matches roster: title + search header, then table */}
      <section
        className="overflow-hidden rounded-xl bg-stone-900/40 ring-1 ring-white/8 lg:bg-stone-900/55"
        aria-label="Guest list"
      >
        <div className="border-b border-white/8 px-3 py-3 sm:px-4">
          <div className="flex flex-col gap-2.5">
            <div>
              <h2 className="text-sm font-semibold text-white">Guest list</h2>
              <p className="mt-0.5 text-[12px] leading-snug text-stone-500">
                Tap check-in for confirmed guests. Undo mistakes instantly.
              </p>
            </div>
            <div className="hidden lg:block">{searchInput}</div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-stone-900/80 text-[11px] font-medium uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Guest</th>
                <th className="px-4 py-2.5 font-medium">Phone</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-sm text-stone-400">
                    No guests match that search.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => {
                  const ineligible = a.rsvpStatus !== "confirmed";
                  const checked = Boolean(a.checkedInAt);
                  const busy = isPending && pendingId === a.id;

                  return (
                    <tr
                      key={a.id}
                      className={checked ? "bg-teal-950/25" : "hover:bg-white/[0.03]"}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{a.name}</div>
                        {ineligible ? (
                          <p className="mt-0.5 text-xs text-amber-300/90">
                            Not confirmed ({a.rsvpStatus})
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-stone-400">{a.phone}</td>
                      <td className="px-4 py-3">
                        {checked ? (
                          <span className="inline-flex rounded-full bg-teal-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-200">
                            Checked in
                          </span>
                        ) : ineligible ? (
                          <span className="text-xs text-stone-500">—</span>
                        ) : (
                          <span className="text-xs text-stone-500">Waiting</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <GuestActions row={a} busy={busy} onCheckIn={onCheckIn} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <ul className="flex flex-col gap-0 divide-y divide-white/6 p-3 lg:hidden">
          {filtered.length === 0 ? (
            <li className="rounded-2xl px-2 py-12 text-center">
              <p className="text-sm font-medium text-stone-300">No guests match that search</p>
              <p className="mt-2 text-xs text-stone-500">Try another spelling or phone fragment.</p>
            </li>
          ) : (
            filtered.map((a) => {
              const ineligible = a.rsvpStatus !== "confirmed";
              const checked = Boolean(a.checkedInAt);
              const busy = isPending && pendingId === a.id;

              return (
                <li key={a.id} className="py-3 first:pt-0 last:pb-0">
                  <div
                    className={[
                      "flex flex-col gap-3 rounded-2xl px-3 py-3.5 transition active:scale-[0.99] sm:flex-row sm:items-center sm:gap-4",
                      checked
                        ? "bg-teal-950/35 ring-1 ring-teal-500/25"
                        : "bg-stone-900/45 ring-1 ring-white/8",
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
                      <GuestActions row={a} busy={busy} onCheckIn={onCheckIn} />
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>

        <div className="border-t border-white/8 px-3 py-2 text-[11px] text-stone-500 sm:px-4">
          {showingLabel}
        </div>
      </section>
    </div>
  );
}

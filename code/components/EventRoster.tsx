"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { updateAttendeeRsvp } from "@/app/actions";
import { RsvpInviteActions } from "@/components/RsvpInviteActions";

export type RosterRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  rsvpToken: string;
  rsvpStatus: string;
  hasPlusOne: boolean;
  dietaryPreference: string;
  checkedInAt: string | null;
};

const selectClass =
  "w-full min-w-[7.25rem] cursor-pointer rounded-lg bg-stone-50 py-1.5 pl-2.5 pr-7 text-xs font-semibold text-stone-800 shadow-sm ring-1 ring-stone-200/80 outline-none transition hover:bg-stone-100 focus:ring-2 focus:ring-teal-500/30 dark:bg-stone-800 dark:text-stone-100 dark:ring-stone-600/80 dark:hover:bg-stone-700";

export function EventRoster({
  eventId,
  rows,
  appBaseUrl,
}: {
  eventId: string;
  rows: RosterRow[];
  appBaseUrl: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.phone.replace(/\s/g, "").includes(s.replace(/\s/g, "")) ||
        (r.email?.toLowerCase().includes(s) ?? false),
    );
  }, [rows, q]);

  function onRsvpChange(attendeeId: string, value: string) {
    setPendingId(attendeeId);
    startTransition(async () => {
      const res = await updateAttendeeRsvp(eventId, attendeeId, value);
      setPendingId(null);
      if (res.ok) {
        setError(null);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-900 dark:ring-stone-700/50">
      <div className="border-b border-stone-100 px-4 py-4 dark:border-stone-800 sm:px-5">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-base font-semibold text-stone-900 dark:text-white">Roster</h2>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              Email guests an RSVP link or copy their personal link. Changes sync with the guest
              RSVP page.
            </p>
          </div>
          <label className="block">
            <span className="sr-only">Filter roster</span>
            <input
              type="search"
              placeholder="Search name, phone, or email…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 ring-1 ring-stone-200/70 outline-none transition placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-teal-500/25 dark:bg-stone-800/50 dark:text-white dark:ring-stone-600/60 dark:focus:bg-stone-900"
            />
          </label>
        </div>
      </div>

      {error ? (
        <p
          className="mx-4 mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/35 dark:text-red-200 sm:mx-5"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="bg-stone-50/90 text-xs font-medium text-stone-500 dark:bg-stone-800/50 dark:text-stone-400">
            <tr>
              <th className="px-4 py-3 font-medium sm:px-5">Guest</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell sm:px-5">Email</th>
              <th className="px-4 py-3 font-medium sm:px-5">RSVP</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell sm:px-5">+1</th>
              <th className="hidden px-4 py-3 font-medium xl:table-cell sm:px-5">Dietary</th>
              <th className="px-4 py-3 font-medium sm:px-5">In</th>
              <th className="px-4 py-3 font-medium sm:px-5">Invite</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-stone-500">
                  No guests match your search.
                </td>
              </tr>
            ) : (
              filtered.map((a) => {
                const busy = isPending && pendingId === a.id;
                return (
                  <tr
                    key={a.id}
                    className="align-top transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-800/30"
                  >
                    <td className="px-4 py-3 sm:px-5">
                      <div className="font-medium text-stone-900 dark:text-white">{a.name}</div>
                      <div className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{a.phone}</div>
                      {a.email ? (
                        <div className="mt-1 truncate text-xs text-stone-500 md:hidden dark:text-stone-400">
                          {a.email}
                        </div>
                      ) : null}
                    </td>
                    <td className="hidden max-w-[12rem] truncate px-4 py-3 text-stone-600 md:table-cell dark:text-stone-300 sm:px-5">
                      {a.email ?? "—"}
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <select
                        aria-label={`RSVP for ${a.name}`}
                        className={selectClass}
                        value={a.rsvpStatus}
                        disabled={busy}
                        onChange={(e) => onRsvpChange(a.id, e.target.value)}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>
                    <td className="hidden px-4 py-3 text-stone-600 lg:table-cell dark:text-stone-400 sm:px-5">
                      {a.hasPlusOne ? "Yes" : "—"}
                    </td>
                    <td className="hidden max-w-[10rem] truncate px-4 py-3 text-stone-500 xl:table-cell sm:px-5">
                      {a.dietaryPreference || "—"}
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      {a.checkedInAt ? (
                        <span className="inline-flex rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                          In
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <RsvpInviteActions
                        attendeeId={a.id}
                        email={a.email}
                        rsvpToken={a.rsvpToken}
                        appBaseUrl={appBaseUrl}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-stone-100 px-4 py-2.5 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400 sm:px-5">
        {filtered.length} of {rows.length} guest{rows.length === 1 ? "" : "s"}
        {q.trim() ? " shown" : " on roster"}
      </div>
    </section>
  );
}

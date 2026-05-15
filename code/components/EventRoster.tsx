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
  "min-w-[8.5rem] cursor-pointer rounded-xl bg-stone-50 py-2 pl-3 pr-8 text-xs font-semibold text-stone-800 shadow-sm ring-1 ring-stone-200/80 outline-none transition hover:bg-stone-100 focus:ring-2 focus:ring-teal-500/30 dark:bg-stone-800 dark:text-stone-100 dark:ring-stone-600/80 dark:hover:bg-stone-700";

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
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-stone-900 dark:text-white">Roster</h2>
          <p className="mt-1 max-w-lg text-sm text-stone-500 dark:text-stone-400">
            Guests with an email can receive a self-serve RSVP link; everyone has a unique link you
            can copy. Changing RSVP here or from the guest link updates the same roster.
          </p>
        </div>
        <input
          type="search"
          placeholder="Filter by name or phone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-2xl bg-white px-4 py-2.5 text-sm text-stone-900 shadow-sm ring-1 ring-stone-200/70 outline-none transition placeholder:text-stone-400 focus:ring-2 focus:ring-teal-500/25 dark:bg-stone-900 dark:text-white dark:ring-stone-700 sm:max-w-xs sm:ml-auto"
        />
      </div>

      {error ? (
        <p
          className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/35 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-900 dark:ring-stone-700/50">
        <div className="max-h-[min(520px,60vh)] overflow-auto overscroll-contain">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-stone-50/95 backdrop-blur-sm dark:bg-stone-900/95">
              <tr className="text-xs font-medium text-stone-500 dark:text-stone-400">
                <th className="px-6 py-3.5 font-medium">Name</th>
                <th className="px-6 py-3.5 font-medium">Phone</th>
                <th className="px-6 py-3.5 font-medium">Email</th>
                <th className="px-6 py-3.5 font-medium">RSVP</th>
                <th className="px-6 py-3.5 font-medium">+1</th>
                <th className="px-6 py-3.5 font-medium">Dietary</th>
                <th className="px-6 py-3.5 font-medium">In</th>
                <th className="px-6 py-3.5 font-medium">Invite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100/90 dark:divide-stone-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center text-sm text-stone-500">
                    No rows match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => {
                  const busy = isPending && pendingId === a.id;
                  return (
                    <tr
                      key={a.id}
                      className="transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-800/40"
                    >
                      <td className="px-6 py-3.5 font-medium text-stone-900 dark:text-white">{a.name}</td>
                      <td className="px-6 py-3.5 text-stone-600 dark:text-stone-300">{a.phone}</td>
                      <td className="max-w-[9rem] truncate px-6 py-3.5 text-stone-600 dark:text-stone-300">
                        {a.email ?? "—"}
                      </td>
                      <td className="px-6 py-3">
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
                      <td className="px-6 py-3.5 text-stone-600 dark:text-stone-400">
                        {a.hasPlusOne ? "Yes" : "—"}
                      </td>
                      <td className="max-w-40 truncate px-6 py-3.5 text-stone-500">
                        {a.dietaryPreference || "—"}
                      </td>
                      <td className="px-6 py-3.5">
                        {a.checkedInAt ? (
                          <span className="font-medium text-teal-600 dark:text-teal-400">Yes</span>
                        ) : (
                          <span className="text-stone-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
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
      </div>
    </section>
  );
}

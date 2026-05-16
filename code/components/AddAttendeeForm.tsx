"use client";

import { useActionState } from "react";
import { addAttendee, type FormState } from "@/app/actions";

const initial: FormState = { ok: true, error: null, info: null };

const field =
  "mt-1 w-full rounded-lg bg-stone-50 px-2.5 py-1.5 text-[13px] text-stone-900 shadow-sm ring-1 ring-stone-200/70 outline-none transition placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-teal-500/25 dark:bg-stone-800/50 dark:text-white dark:ring-stone-600/60 dark:focus:bg-stone-900";

const labelClass = "block text-[12px] font-medium text-stone-700 dark:text-stone-300";

export function AddAttendeeForm({ eventId }: { eventId: string }) {
  const [state, formAction] = useActionState(addAttendee, initial);

  return (
    <form
      action={formAction}
      className="flex max-h-[min(28rem,calc(100dvh-5rem))] flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-900 dark:ring-stone-700/50 lg:max-h-[calc(100dvh-5.5rem)]"
    >
      <input type="hidden" name="eventId" value={eventId} />
      <div className="shrink-0 border-b border-stone-100 px-3 py-2.5 dark:border-stone-800 sm:px-3.5">
        <h2 className="text-sm font-semibold text-stone-900 dark:text-white">Add guest</h2>
        <p className="mt-0.5 text-[11px] leading-snug text-stone-500 dark:text-stone-400">
          Walk-ins sync to roster and check-in immediately.
        </p>
      </div>
      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3 py-2.5 sm:px-3.5">
        <label className={labelClass}>
          Name
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className={labelClass}>
          Phone
          <input name="phone" required type="tel" autoComplete="tel" className={field} />
        </label>
        <label className={labelClass}>
          Email <span className="font-normal text-stone-500">(optional)</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="For RSVP link & email invite"
            className={field}
          />
        </label>
        <label className="flex cursor-pointer items-start gap-2 text-[12px] text-stone-700 dark:text-stone-300">
          <input
            name="sendInvite"
            type="checkbox"
            className="mt-0.5 size-3.5 rounded border-stone-300 text-teal-600 focus:ring-teal-500 dark:border-stone-600"
          />
          <span>
            <span className="font-medium">Email RSVP link now</span>
            <span className="mt-0.5 block text-[11px] font-normal text-stone-500 dark:text-stone-400">
              Needs email above. Pending until they respond.
            </span>
          </span>
        </label>

        <details className="group rounded-lg border border-stone-200/80 bg-stone-50/50 dark:border-stone-700/60 dark:bg-stone-800/30">
          <summary className="cursor-pointer list-none px-2.5 py-2 text-[11px] font-semibold text-stone-600 marker:content-none [&::-webkit-details-marker]:hidden dark:text-stone-400">
            <span className="select-none">More options</span>
            <span className="ml-1 font-normal text-stone-400 group-open:hidden">· dietary, +1, RSVP</span>
          </summary>
          <div className="space-y-2.5 border-t border-stone-200/60 px-2.5 pb-2.5 pt-2 dark:border-stone-700/50">
            <label className={labelClass}>
              Dietary notes
              <input name="dietaryPreference" maxLength={500} placeholder="Optional" className={field} />
            </label>
            <label className="flex items-center gap-2 text-[12px] text-stone-700 dark:text-stone-300">
              <input
                name="hasPlusOne"
                type="checkbox"
                className="size-3.5 rounded border-stone-300 text-teal-600 focus:ring-teal-500 dark:border-stone-600"
              />
              Guest brings a +1
            </label>
            <label className={labelClass}>
              RSVP status
              <select name="rsvpStatus" className={field} defaultValue="confirmed">
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="declined">Declined</option>
              </select>
              <p className="mt-1 text-[10px] leading-snug text-stone-500 dark:text-stone-400">
                “Email RSVP link now” stores as pending until they use the link.
              </p>
            </label>
          </div>
        </details>
      </div>
      <div className="shrink-0 space-y-2 border-t border-stone-100 px-3 py-2.5 dark:border-stone-800 sm:px-3.5">
        {state.error ? (
          <p
            className="rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] text-red-800 dark:bg-red-950/35 dark:text-red-200"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}
        {state.info ? (
          <p className="rounded-lg bg-teal-50 px-2.5 py-1.5 text-[11px] text-teal-900 dark:bg-teal-950/35 dark:text-teal-100">
            {state.info}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-full bg-stone-900 py-2 text-[13px] font-semibold text-white transition hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100"
        >
          Add to roster
        </button>
      </div>
    </form>
  );
}

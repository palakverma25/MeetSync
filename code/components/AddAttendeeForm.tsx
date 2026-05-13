"use client";

import { useActionState } from "react";
import { addAttendee, type FormState } from "@/app/actions";

const initial: FormState = { ok: true, error: null };

const field =
  "mt-2 w-full rounded-2xl bg-stone-50 px-4 py-2.5 text-sm text-stone-900 shadow-sm ring-1 ring-stone-200/70 outline-none transition placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-teal-500/25 dark:bg-stone-800/50 dark:text-white dark:ring-stone-600/60 dark:focus:bg-stone-900";

export function AddAttendeeForm({ eventId }: { eventId: string }) {
  const [state, formAction] = useActionState(addAttendee, initial);

  return (
    <form
      action={formAction}
      className="sticky top-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-900 dark:ring-stone-700/50 sm:p-7"
    >
      <input type="hidden" name="eventId" value={eventId} />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-white">Add guest</h2>
        <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          Walk-ins and last-minute RSVPs show up in the roster and check-in right away.
        </p>
      </div>
      <div className="space-y-5">
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Name
          <input name="name" required className={field} />
        </label>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Phone
          <input name="phone" required type="tel" className={field} />
        </label>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Dietary notes
          <input name="dietaryPreference" placeholder="Optional" className={field} />
        </label>
        <label className="flex items-center gap-3 text-sm text-stone-700 dark:text-stone-300">
          <input
            name="hasPlusOne"
            type="checkbox"
            className="size-4 rounded-md border-stone-300 text-teal-600 focus:ring-teal-500 dark:border-stone-600"
          />
          Guest brings a +1
        </label>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          RSVP status
          <select name="rsvpStatus" className={field} defaultValue="confirmed">
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>
        </label>
      </div>
      {state.error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/35 dark:text-red-200" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        className="w-full rounded-full bg-stone-900 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100"
      >
        Add to roster
      </button>
    </form>
  );
}

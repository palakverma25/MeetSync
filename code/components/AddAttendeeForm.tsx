"use client";

import { useActionState } from "react";
import { addAttendee, type FormState } from "@/app/actions";

const initial: FormState = { ok: true, error: null, info: null };

const field =
  "mt-1.5 w-full rounded-xl bg-stone-50 px-3 py-2 text-sm text-stone-900 shadow-sm ring-1 ring-stone-200/70 outline-none transition placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-teal-500/25 dark:bg-stone-800/50 dark:text-white dark:ring-stone-600/60 dark:focus:bg-stone-900";

export function AddAttendeeForm({ eventId }: { eventId: string }) {
  const [state, formAction] = useActionState(addAttendee, initial);

  return (
    <form
      action={formAction}
      className="flex max-h-[min(32rem,calc(100vh-6rem))] flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/50 dark:bg-stone-900 dark:ring-stone-700/50"
    >
      <input type="hidden" name="eventId" value={eventId} />
      <div className="shrink-0 space-y-1 border-b border-stone-100 px-4 py-4 dark:border-stone-800 sm:px-5">
        <h2 className="text-base font-semibold text-stone-900 dark:text-white">Add guest</h2>
        <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
          Walk-ins and last-minute RSVPs sync to roster and check-in.
        </p>
      </div>
      <div className="min-h-0 flex-1 space-y-3.5 overflow-y-auto px-4 py-4 sm:px-5">
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Name
          <input name="name" required className={field} />
        </label>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Phone
          <input name="phone" required type="tel" className={field} />
        </label>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Email (optional)
          <input name="email" type="email" autoComplete="email" placeholder="For RSVP invite link" className={field} />
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-stone-700 dark:text-stone-300">
          <input
            name="sendInvite"
            type="checkbox"
            className="mt-0.5 size-4 rounded-md border-stone-300 text-teal-600 focus:ring-teal-500 dark:border-stone-600"
          />
          <span>
            <span className="font-medium">Email self-RSVP link now</span>
            <span className="mt-0.5 block text-xs font-normal text-stone-500 dark:text-stone-400">
              Requires an email above. Sets RSVP to pending and sends the invite when email is
              configured; otherwise use Copy link on the roster.
            </span>
          </span>
        </label>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Dietary notes
          <input name="dietaryPreference" maxLength={500} placeholder="Optional" className={field} />
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
          <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
            If you check “Email self-RSVP link now,” the guest is stored as <strong className="font-medium">pending</strong>{" "}
            until they use the link.
          </p>
        </label>
      </div>
      <div className="shrink-0 space-y-3 border-t border-stone-100 px-4 py-4 dark:border-stone-800 sm:px-5">
        {state.error ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-800 dark:bg-red-950/35 dark:text-red-200" role="alert">
            {state.error}
          </p>
        ) : null}
        {state.info ? (
          <p className="rounded-xl bg-teal-50 px-3 py-2 text-xs text-teal-900 dark:bg-teal-950/35 dark:text-teal-100">
            {state.info}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-full bg-stone-900 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100"
        >
          Add to roster
        </button>
      </div>
    </form>
  );
}

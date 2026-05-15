"use client";

import { useActionState } from "react";
import { submitGuestRsvp, type GuestRsvpState } from "@/app/rsvp/actions";

const initial: GuestRsvpState = { ok: false, error: null };

const field =
  "mt-2 w-full rounded-2xl bg-stone-50 px-4 py-3 text-base text-stone-900 shadow-sm ring-1 ring-stone-200/70 outline-none transition placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-teal-500/30 dark:bg-stone-800/50 dark:text-white dark:ring-stone-600/60 dark:focus:bg-stone-900";

type Props = {
  token: string;
  guestName: string;
  eventTitle: string;
  eventVenue: string;
  eventWhen: string;
  defaultRsvp: string;
  defaultDietary: string;
  defaultPlusOne: boolean;
};

export function GuestRsvpForm({
  token,
  guestName,
  eventTitle,
  eventVenue,
  eventWhen,
  defaultRsvp,
  defaultDietary,
  defaultPlusOne,
}: Props) {
  const [state, formAction] = useActionState(submitGuestRsvp, initial);

  if (state.ok) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-stone-200/60 dark:bg-stone-900 dark:ring-stone-700/60 sm:p-10">
        <p className="text-lg font-semibold text-teal-700 dark:text-teal-400">Thank you</p>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          Your response has been saved. The organizer will see your updated RSVP on the roster.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-stone-200/60 dark:bg-stone-900 dark:ring-stone-700/60 sm:p-10"
    >
      <input type="hidden" name="token" value={token} />
      <div className="space-y-1 border-b border-stone-100 pb-6 dark:border-stone-800">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
          Invitation
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
          {eventTitle}
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          {eventVenue}
          <br />
          {eventWhen}
        </p>
        <p className="mt-4 text-sm text-stone-700 dark:text-stone-300">
          Hi <span className="font-semibold">{guestName}</span> — let us know if you can make it.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-stone-800 dark:text-stone-200">
            Your response
          </legend>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-stone-200/80 p-4 dark:border-stone-700/80">
            <input
              type="radio"
              name="rsvpStatus"
              value="confirmed"
              defaultChecked={defaultRsvp === "confirmed"}
              className="mt-1 text-teal-600 focus:ring-teal-500"
            />
            <span>
              <span className="font-medium text-stone-900 dark:text-white">I’ll be there</span>
              <span className="mt-0.5 block text-sm text-stone-500 dark:text-stone-400">
                Confirmed attendance
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-stone-200/80 p-4 dark:border-stone-700/80">
            <input
              type="radio"
              name="rsvpStatus"
              value="pending"
              defaultChecked={
                defaultRsvp === "pending" ||
                (defaultRsvp !== "confirmed" && defaultRsvp !== "declined")
              }
              className="mt-1 text-teal-600 focus:ring-teal-500"
            />
            <span>
              <span className="font-medium text-stone-900 dark:text-white">Not sure yet</span>
              <span className="mt-0.5 block text-sm text-stone-500 dark:text-stone-400">
                Tentative / need to follow up
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-stone-200/80 p-4 dark:border-stone-700/80">
            <input
              type="radio"
              name="rsvpStatus"
              value="declined"
              defaultChecked={defaultRsvp === "declined"}
              className="mt-1 text-teal-600 focus:ring-teal-500"
            />
            <span>
              <span className="font-medium text-stone-900 dark:text-white">I can’t make it</span>
              <span className="mt-0.5 block text-sm text-stone-500 dark:text-stone-400">
                Decline this invitation
              </span>
            </span>
          </label>
        </fieldset>

        <label className="block text-sm font-medium text-stone-800 dark:text-stone-200">
          Dietary notes
          <textarea
            maxLength={500}
            name="dietaryPreference"
            rows={2}
            defaultValue={defaultDietary}
            placeholder="Allergies, vegetarian, etc. (optional)"
            className={field}
          />
        </label>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-stone-800 dark:text-stone-200">
          <input
            name="hasPlusOne"
            type="checkbox"
            defaultChecked={defaultPlusOne}
            className="size-4 rounded-md border-stone-300 text-teal-600 focus:ring-teal-500 dark:border-stone-600"
          />
          I’m bringing a +1
        </label>
      </div>

      {state.error ? (
        <p
          className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        className="mt-8 w-full rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-teal-500 sm:max-w-xs"
      >
        Submit response
      </button>
    </form>
  );
}

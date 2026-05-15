"use client";

import { useActionState } from "react";
import { createEvent, type FormState } from "@/app/actions";

const initial: FormState = { ok: true, error: null, info: null };

const field =
  "mt-2 block w-full rounded-2xl bg-stone-50 px-4 py-3 text-base text-stone-900 shadow-sm ring-1 ring-stone-200/70 outline-none transition placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-teal-500/30 dark:bg-stone-800/40 dark:text-white dark:ring-stone-600/50 dark:focus:bg-stone-900";

const labelClass = "text-sm font-medium text-stone-800 dark:text-stone-200";

export function CreateEventForm() {
  const [state, formAction] = useActionState(createEvent, initial);

  return (
    <form
      action={formAction}
      className="space-y-10 rounded-3xl bg-white/90 p-6 shadow-lg shadow-stone-900/5 ring-1 ring-stone-200/40 backdrop-blur-sm dark:bg-stone-900/80 dark:shadow-black/20 dark:ring-stone-700/40 sm:p-8 sm:pb-10"
    >
      <div className="space-y-8">
        <fieldset className="min-w-0 space-y-5 border-0 p-0">
          <legend className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            What &amp; where
          </legend>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className={labelClass}>
              Event title
              <input
                name="title"
                required
                autoComplete="off"
                placeholder="e.g. Summer Garden Gala"
                className={field}
              />
            </label>
            <label className={labelClass}>
              Venue
              <input
                name="venue"
                required
                autoComplete="street-address"
                placeholder="e.g. Riverside Conservatory"
                className={field}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="min-w-0 space-y-5 border-0 p-0">
          <legend className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            When &amp; size
          </legend>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="event-datetime" className={labelClass}>
                Date &amp; time
              </label>
              <input
                id="event-datetime"
                name="date"
                type="datetime-local"
                required
                className={field}
              />
              <p className="mt-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                Uses this device&apos;s local timezone. You can fine-tune on the roster page later.
              </p>
            </div>
            <div>
              <label htmlFor="event-capacity" className={labelClass}>
                Capacity
              </label>
              <input
                id="event-capacity"
                name="capacity"
                type="number"
                min={1}
                inputMode="numeric"
                required
                placeholder="120"
                className={field}
              />
              <p className="mt-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                Max guests for this space — used for progress on the events dashboard.
              </p>
            </div>
          </div>
        </fieldset>
      </div>

      {state.error ? (
        <div
          className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="order-2 text-xs text-stone-500 dark:text-stone-400 sm:order-1 sm:max-w-xs">
          After you create the event, you&apos;ll go straight to the roster to add attendees.
        </p>
        <button
          type="submit"
          className="order-1 min-h-12 w-full rounded-full bg-teal-600 px-8 text-sm font-semibold text-white shadow-md shadow-teal-900/10 transition hover:bg-teal-500 active:scale-[0.99] sm:order-2 sm:min-h-11 sm:w-auto"
        >
          Create &amp; open roster
        </button>
      </div>
    </form>
  );
}

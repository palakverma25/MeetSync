"use client";

import { useActionState } from "react";
import { createEvent, type FormState } from "@/app/actions";

const initial: FormState = { ok: true, error: null, info: null };

const field =
  "mt-1.5 block w-full rounded-xl bg-stone-50 px-3 py-2 text-[13px] text-stone-900 shadow-sm ring-1 ring-stone-200/70 outline-none transition placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-teal-500/30 dark:bg-stone-800/40 dark:text-white dark:ring-stone-600/50 dark:focus:bg-stone-900";

const labelClass = "text-[12px] font-medium text-stone-800 dark:text-stone-200";

export function CreateEventForm() {
  const [state, formAction] = useActionState(createEvent, initial);

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl bg-white/90 p-5 shadow-md shadow-stone-900/5 ring-1 ring-stone-200/40 backdrop-blur-sm dark:bg-stone-900/80 dark:shadow-black/20 dark:ring-stone-700/40 sm:p-6"
    >
      <div className="space-y-6">
        <fieldset className="min-w-0 space-y-4 border-0 p-0">
          <legend className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            What &amp; where
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
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

        <fieldset className="min-w-0 space-y-4 border-0 p-0">
          <legend className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            When &amp; size
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
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
              <p className="mt-1.5 text-[11px] leading-snug text-stone-500 dark:text-stone-400">
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
              <p className="mt-1.5 text-[11px] leading-snug text-stone-500 dark:text-stone-400">
                Max guests for this space — used for progress on the events dashboard.
              </p>
            </div>
          </div>
        </fieldset>
      </div>

      {state.error ? (
        <div
          className="rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-800 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="order-2 text-[11px] text-stone-500 dark:text-stone-400 sm:order-1 sm:max-w-xs">
          After you create the event, you&apos;ll go straight to the roster to add attendees.
        </p>
        <button
          type="submit"
          className="order-1 min-h-10 w-full rounded-full bg-teal-600 px-6 text-[13px] font-semibold text-white shadow-md shadow-teal-900/10 transition hover:bg-teal-500 active:scale-[0.99] sm:order-2 sm:w-auto"
        >
          Create &amp; open roster
        </button>
      </div>
    </form>
  );
}

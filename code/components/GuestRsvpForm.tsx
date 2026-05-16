"use client";

import { useActionState } from "react";
import { submitGuestRsvp, type GuestRsvpState } from "@/app/rsvp/actions";

const initial: GuestRsvpState = { ok: false, error: null };

const field =
  "mt-1 w-full rounded-lg bg-stone-50 px-2.5 py-2 text-[13px] text-stone-900 ring-1 ring-stone-200/70 outline-none transition placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-teal-500/25 dark:bg-stone-800/50 dark:text-white dark:ring-stone-600/60 dark:focus:bg-stone-900";

const rsvpOptionClass =
  "flex cursor-pointer items-center gap-2.5 rounded-lg border border-stone-200/80 px-3 py-2.5 text-left transition has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50/90 has-[:checked]:ring-1 has-[:checked]:ring-teal-500/20 dark:border-stone-700/80 dark:has-[:checked]:border-teal-500/70 dark:has-[:checked]:bg-teal-950/40";

const cardClass =
  "rounded-xl bg-white shadow-sm ring-1 ring-stone-200/60 dark:bg-stone-900 dark:ring-stone-700/60";

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

const RSVP_OPTIONS = [
  { value: "confirmed", label: "I'll be there" },
  { value: "pending", label: "Not sure yet" },
  { value: "declined", label: "I can't make it" },
] as const;

function defaultChecked(value: string, current: string) {
  if (value === "pending") {
    return current === "pending" || (current !== "confirmed" && current !== "declined");
  }
  return current === value;
}

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
  const firstName = guestName.trim().split(/\s+/)[0] || guestName;

  if (state.ok) {
    return (
      <div className={`${cardClass} px-5 py-7 text-center sm:px-6`}>
        <div
          className="mx-auto flex size-10 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/50"
          aria-hidden
        >
          <svg
            className="size-5 text-teal-600 dark:text-teal-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-3 text-lg font-bold tracking-tight text-stone-900 dark:text-white">
          You&apos;re all set, {firstName}!
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600 dark:text-stone-400">
          We saved your RSVP for{" "}
          <span className="font-semibold text-stone-800 dark:text-stone-200">{eventTitle}</span>.
          See you there!
        </p>
        <p className="mt-3 text-[11px] text-stone-500">{eventVenue} · {eventWhen}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className={`${cardClass} overflow-hidden`}>
      <input type="hidden" name="token" value={token} />

      {/* Event */}
      <div className="border-b border-stone-100 px-4 py-4 dark:border-stone-800 sm:px-5">
        <h1 className="text-lg font-bold tracking-tight text-stone-900 dark:text-white">
          {eventTitle}
        </h1>
        <p className="mt-1 text-[13px] text-stone-500 dark:text-stone-400">
          {eventVenue} · {eventWhen}
        </p>
        <p className="mt-2.5 text-[13px] text-stone-700 dark:text-stone-300">
          Hi <span className="font-semibold text-stone-900 dark:text-white">{firstName}</span>, can
          you make it?
        </p>
      </div>

      {/* RSVP */}
      <div className="space-y-3 px-4 py-4 sm:px-5">
        <fieldset className="space-y-1.5">
          <legend className="sr-only">Your response</legend>
          {RSVP_OPTIONS.map((opt) => (
            <label key={opt.value} className={rsvpOptionClass}>
              <input
                type="radio"
                name="rsvpStatus"
                value={opt.value}
                defaultChecked={defaultChecked(opt.value, defaultRsvp)}
                className="size-3.5 shrink-0 border-stone-300 text-teal-600 focus:ring-teal-500/30 dark:border-stone-600"
              />
              <span className="text-[13px] font-medium text-stone-900 dark:text-white">
                {opt.label}
              </span>
            </label>
          ))}
        </fieldset>

        <details className="group rounded-lg border border-stone-200/70 bg-stone-50/50 dark:border-stone-700/50 dark:bg-stone-800/30">
          <summary className="cursor-pointer list-none px-3 py-2 text-[12px] font-medium text-stone-600 marker:content-none [&::-webkit-details-marker]:hidden dark:text-stone-400">
            Dietary notes or +1
            <span className="ml-1 font-normal text-stone-400 group-open:hidden">(optional)</span>
          </summary>
          <div className="space-y-2.5 border-t border-stone-200/60 px-3 pb-3 pt-2 dark:border-stone-700/50">
            <label className="block text-[12px] font-medium text-stone-700 dark:text-stone-300">
              Dietary notes
              <textarea
                maxLength={500}
                name="dietaryPreference"
                rows={2}
                defaultValue={defaultDietary}
                placeholder="Allergies, vegetarian…"
                className={field}
              />
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-[12px] text-stone-700 dark:text-stone-300">
              <input
                name="hasPlusOne"
                type="checkbox"
                defaultChecked={defaultPlusOne}
                className="size-3.5 rounded border-stone-300 text-teal-600 focus:ring-teal-500 dark:border-stone-600"
              />
              I&apos;m bringing a +1
            </label>
          </div>
        </details>
      </div>

      {state.error ? (
        <p
          className="mx-4 mb-3 rounded-lg bg-red-50 px-2.5 py-2 text-[12px] text-red-800 dark:bg-red-950/40 dark:text-red-200 sm:mx-5"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div className="border-t border-stone-100 bg-stone-50/50 px-4 py-3 dark:border-stone-800 dark:bg-stone-800/20 sm:px-5">
        <button
          type="submit"
          className="w-full rounded-full bg-teal-600 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-teal-500 active:scale-[0.99]"
        >
          Send RSVP
        </button>
      </div>
    </form>
  );
}

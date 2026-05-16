"use client";

import { useState, useTransition } from "react";
import { sendGuestRsvpInviteEmail } from "@/app/actions";

type Props = {
  attendeeId: string;
  email: string | null;
  rsvpToken: string;
  appBaseUrl: string;
};

export function RsvpInviteActions({ attendeeId, email, rsvpToken, appBaseUrl }: Props) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const url = `${appBaseUrl.replace(/\/$/, "")}/rsvp/${encodeURIComponent(rsvpToken)}`;

  function copy() {
    void navigator.clipboard.writeText(url).then(
      () => {
        setErr(null);
        setMsg("Link copied.");
        window.setTimeout(() => setMsg(null), 2500);
      },
      () => {
        setErr("Could not copy — select the link from the roster export or type the URL.");
      },
    );
  }

  function send() {
    setErr(null);
    setMsg(null);
    start(async () => {
      const r = await sendGuestRsvpInviteEmail(attendeeId);
      if (!r.ok) {
        setErr(r.error ?? "Send failed.");
        return;
      }
      setMsg(r.info ?? "Invite sent.");
      window.setTimeout(() => setMsg(null), 4000);
    });
  }

  return (
    <div className="flex min-w-[8rem] flex-col gap-1">
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={copy}
          className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-800 ring-1 ring-stone-200/90 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-100 dark:ring-stone-600 dark:hover:bg-stone-700"
        >
          Copy link
        </button>
        {email ? (
          <button
            type="button"
            disabled={pending}
            onClick={send}
            className="rounded-md bg-teal-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm transition hover:bg-teal-500 disabled:opacity-50"
          >
            {pending ? "…" : "Email invite"}
          </button>
        ) : null}
      </div>
      {msg ? <p className="text-[11px] text-teal-700 dark:text-teal-400">{msg}</p> : null}
      {err ? (
        <p className="text-[11px] text-red-700 dark:text-red-300" role="alert">
          {err}
        </p>
      ) : null}
    </div>
  );
}

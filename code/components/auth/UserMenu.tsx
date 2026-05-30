"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  name: string;
  email: string;
  role: string;
  compact?: boolean;
};

export function UserMenu({ name, email, role, compact }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function signOut() {
    setError(null);
    start(async () => {
      try {
        const res = await fetch("/api/auth/logout", { method: "POST" });
        if (!res.ok) {
          setError("Could not sign out.");
          return;
        }
        router.push("/login");
        router.refresh();
      } catch {
        setError("Could not sign out.");
      }
    });
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className={compact ? "space-y-2" : "space-y-3 border-t border-stone-100 p-3 dark:border-stone-800"}>
      <div className="flex items-center gap-2.5 px-1">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-600/15 text-[11px] font-bold text-teal-800 dark:text-teal-200"
          aria-hidden
        >
          {initials || "?"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-stone-900 dark:text-white">
            {name}
          </p>
          <p className="truncate text-[10px] text-stone-500 dark:text-stone-400">{email}</p>
          {!compact ? (
            <p className="text-[10px] capitalize text-stone-400">{role}</p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={signOut}
        className="w-full rounded-xl px-2.5 py-2 text-left text-[12px] font-medium text-stone-600 transition hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 disabled:opacity-50"
      >
        {pending ? "Signing out…" : "Sign out"}
      </button>
      {error ? (
        <p className="px-1 text-[10px] text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

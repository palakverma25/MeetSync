"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const field =
  "mt-1.5 block w-full rounded-xl bg-white px-3 py-2.5 text-[13px] text-stone-900 shadow-sm ring-1 ring-stone-200/70 outline-none transition placeholder:text-stone-400 focus:ring-2 focus:ring-teal-500/30 dark:bg-stone-900 dark:text-white dark:ring-stone-700/60";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string; ok?: boolean };

      if (!res.ok) {
        setError(data.error ?? "Sign in failed.");
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-stone-200/60 dark:bg-stone-900 dark:ring-stone-700/50 sm:p-7"
    >
      <h1 className="text-lg font-bold tracking-tight text-stone-900 dark:text-white">
        Sign in
      </h1>
      <p className="mt-1 text-[13px] text-stone-500 dark:text-stone-400">
        Use your ops team account.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block text-[12px] font-medium text-stone-800 dark:text-stone-200">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
        </label>
        <label className="block text-[12px] font-medium text-stone-800 dark:text-stone-200">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />
        </label>
      </div>

      {error ? (
        <p
          className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-800 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-full bg-teal-600 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-teal-500 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

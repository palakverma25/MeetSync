import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { MeetSyncWordmark } from "@/components/MeetSyncWordmark";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  const nextPath =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/events";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-stone-100 px-4 py-10 dark:bg-stone-950">
      <div className="mb-8">
        <MeetSyncWordmark size="md" />
      </div>
      <div className="w-full max-w-sm">
        <LoginForm nextPath={nextPath} />
      </div>
      <p className="mt-8 max-w-sm text-center text-[11px] text-stone-500 dark:text-stone-400">
        Staff sign-in for events, rosters, and check-in. Guest RSVP links stay public.
      </p>
    </div>
  );
}

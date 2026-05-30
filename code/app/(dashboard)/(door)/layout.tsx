import Link from "next/link";
import { UserMenu } from "@/components/auth/UserMenu";
import { requireAuth } from "@/lib/auth/requireAuth";

export default async function DoorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-stone-950 text-stone-100">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(45,212,191,0.14),transparent_55%),radial-gradient(ellipse_70%_45%_at_100%_30%,rgba(120,113,108,0.12),transparent_50%)]"
        aria-hidden
      />
      <header className="relative z-20 px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6">
        <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between gap-3 rounded-2xl bg-stone-900/60 px-4 ring-1 ring-white/10 backdrop-blur-xl sm:h-14 sm:rounded-3xl sm:px-5">
          <Link
            href="/events"
            className="text-sm font-semibold text-teal-400 transition hover:text-teal-300"
          >
            MeetSync
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden rounded-full bg-teal-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-200/95 sm:inline">
              Door
            </span>
            <div className="w-[min(12rem,42vw)]">
              <UserMenu
                compact
                name={session.name}
                email={session.email}
                role={session.role}
              />
            </div>
          </div>
        </div>
      </header>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

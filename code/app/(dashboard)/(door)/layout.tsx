import Link from "next/link";

export default function DoorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-stone-950 text-stone-100">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(45,212,191,0.14),transparent_55%),radial-gradient(ellipse_70%_45%_at_100%_30%,rgba(120,113,108,0.12),transparent_50%)]"
        aria-hidden
      />
      <header className="relative z-20 px-4 pt-4 sm:px-5 sm:pt-5">
        <div className="mx-auto flex h-12 max-w-lg items-center justify-between rounded-2xl bg-stone-900/60 px-4 ring-1 ring-white/10 backdrop-blur-xl sm:h-14 sm:rounded-3xl sm:px-5">
          <Link
            href="/"
            className="text-sm font-semibold text-teal-400 transition hover:text-teal-300"
          >
            MeetSync
          </Link>
          <span className="rounded-full bg-teal-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-200/95">
            Door
          </span>
        </div>
      </header>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

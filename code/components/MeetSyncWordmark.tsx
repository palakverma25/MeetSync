import Link from "next/link";

type Props = {
  /** `sm` for guest pages; `md` for marketing-style headers */
  size?: "sm" | "md";
  className?: string;
  href?: string;
};

const sizeClass = {
  sm: "text-lg font-bold tracking-tight",
  md: "text-xl font-bold tracking-tight sm:text-2xl",
};

export function MeetSyncWordmark({ size = "sm", className = "", href = "/" }: Props) {
  const inner = (
    <>
      Meet<span className="text-teal-600 dark:text-teal-400">Sync</span>
    </>
  );

  const classes = `${sizeClass[size]} text-stone-900 dark:text-white ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={`inline-block transition hover:opacity-90 ${classes}`}>
        {inner}
      </Link>
    );
  }

  return <span className={classes}>{inner}</span>;
}

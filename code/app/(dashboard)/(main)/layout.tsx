import { AppSidebar } from "@/components/app/AppSidebar";

export default function MainShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh bg-stone-100 text-[15px] leading-snug dark:bg-stone-950">
      <div className="shrink-0 p-2 sm:p-3">
        <AppSidebar />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col pr-2 pb-2 pt-2 sm:pr-3 sm:pb-3 sm:pt-3">
        {children}
      </div>
    </div>
  );
}

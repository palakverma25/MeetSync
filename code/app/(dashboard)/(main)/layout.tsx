import { AppSidebar } from "@/components/app/AppSidebar";

export default function MainShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh bg-stone-100 dark:bg-stone-950">
      <div className="shrink-0 p-3 sm:p-4">
        <AppSidebar />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col pr-3 pb-3 pt-3 sm:pr-4 sm:pb-4 sm:pt-4">
        {children}
      </div>
    </div>
  );
}

import { AppShell } from "@/components/app/AppShell";

export default function MainShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}

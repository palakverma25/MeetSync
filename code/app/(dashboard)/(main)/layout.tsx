import { AppShell } from "@/components/app/AppShell";
import { requireAuth } from "@/lib/auth/requireAuth";

export default async function MainShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <AppShell
      user={{
        name: session.name,
        email: session.email,
        role: session.role,
      }}
    >
      {children}
    </AppShell>
  );
}

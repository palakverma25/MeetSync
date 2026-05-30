import { redirect } from "next/navigation";
import { getSession, type SessionUser } from "@/lib/auth/session";

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireAuth();
  if (session.role !== "admin") {
    redirect("/events");
  }
  return session;
}

import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAccessToken, type SessionUser } from "@/lib/auth/jwt";

export type { SessionUser };

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

export async function getSessionFromCookieHeader(
  cookieHeader: string | null,
): Promise<SessionUser | null> {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${AUTH_COOKIE_NAME}=`));
  if (!match) return null;
  const token = decodeURIComponent(match.slice(AUTH_COOKIE_NAME.length + 1));
  if (!token) return null;
  return verifyAccessToken(token);
}

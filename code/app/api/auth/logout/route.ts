import { NextResponse } from "next/server";
import { clearAuthCookieOptions } from "@/lib/auth/config";
import { AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE_NAME, "", clearAuthCookieOptions());
  return res;
}

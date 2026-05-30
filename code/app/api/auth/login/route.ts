import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authCookieOptions } from "@/lib/auth/config";
import { AUTH_COOKIE_NAME, signAccessToken, type UserRole } from "@/lib/auth/jwt";
import { verifyPassword } from "@/lib/auth/password";

function parseRole(raw: string): UserRole {
  return raw === "admin" ? "admin" : "staff";
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = String((body as { email?: string }).email ?? "")
    .trim()
    .toLowerCase();
  const password = String((body as { password?: string }).password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const role = parseRole(user.role);
  const token = await signAccessToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role,
  });

  const res = NextResponse.json({
    ok: true,
    user: { email: user.email, name: user.name, role },
  });
  res.cookies.set(AUTH_COOKIE_NAME, token, authCookieOptions());
  return res;
}

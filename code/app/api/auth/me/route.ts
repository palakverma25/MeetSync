import { NextResponse } from "next/server";
import { getSessionFromCookieHeader } from "@/lib/auth/session";

export async function GET(req: Request) {
  const session = await getSessionFromCookieHeader(req.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      id: session.sub,
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
}

import { NextResponse } from "next/server";
import { getSessionFromCookieHeader } from "@/lib/auth/session";

export async function requireApiAuth(req: Request) {
  const session = await getSessionFromCookieHeader(req.headers.get("cookie"));
  if (!session) {
    return {
      session: null as null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, response: null as null };
}

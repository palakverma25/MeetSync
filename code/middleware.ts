import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, verifyAccessToken } from "@/lib/auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifyAccessToken(token) : null;

  if (pathname === "/login") {
    if (session) {
      const next = request.nextUrl.searchParams.get("next");
      const dest =
        next && next.startsWith("/") && !next.startsWith("//") ? next : "/events";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/events/:path*", "/api/events/:path*", "/login"],
};

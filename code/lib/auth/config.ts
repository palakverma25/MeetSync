export const AUTH_COOKIE_NAME = "meetsync_token";

/** Access token lifetime — 8 hours (one ops shift). */
export const AUTH_TOKEN_MAX_AGE_SEC = 8 * 60 * 60;

const WEAK_JWT_PATTERNS = [
  "dev-only-insecure",
  "replace-with-32",
  "your-random-secret",
  "changeme123",
];

function isWeakJwtSecret(secret: string) {
  return WEAK_JWT_PATTERNS.some((p) => secret.includes(p));
}

export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret && secret.length >= 32) {
    if (process.env.NODE_ENV === "production" && isWeakJwtSecret(secret)) {
      throw new Error(
        "JWT_SECRET must be a random secret in production (not a placeholder from .env.example).",
      );
    }
    return new TextEncoder().encode(secret);
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set (min 32 characters) in production.");
  }
  return new TextEncoder().encode("dev-only-insecure-jwt-secret-change-me!!");
}

export function authCookieOptions(maxAge = AUTH_TOKEN_MAX_AGE_SEC) {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function clearAuthCookieOptions() {
  return {
    ...authCookieOptions(0),
    maxAge: 0,
  };
}

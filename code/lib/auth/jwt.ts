import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import {
  AUTH_TOKEN_MAX_AGE_SEC,
  AUTH_COOKIE_NAME,
  getJwtSecret,
} from "@/lib/auth/config";

export { AUTH_COOKIE_NAME };

export type UserRole = "admin" | "staff";

export type AccessTokenClaims = {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
};

export type SessionUser = AccessTokenClaims;

function parseRole(raw: unknown): UserRole {
  return raw === "admin" ? "admin" : "staff";
}

function claimsFromPayload(payload: JWTPayload): SessionUser | null {
  const sub = payload.sub;
  const email = payload.email;
  const name = payload.name;
  if (typeof sub !== "string" || typeof email !== "string" || typeof name !== "string") {
    return null;
  }
  return {
    sub,
    email,
    name,
    role: parseRole(payload.role),
  };
}

export async function signAccessToken(claims: AccessTokenClaims): Promise<string> {
  return new SignJWT({
    email: claims.email,
    name: claims.name,
    role: claims.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("meetsync")
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(`${AUTH_TOKEN_MAX_AGE_SEC}s`)
    .sign(getJwtSecret());
}

export async function verifyAccessToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
      issuer: "meetsync",
    });
    return claimsFromPayload(payload);
  } catch {
    return null;
  }
}

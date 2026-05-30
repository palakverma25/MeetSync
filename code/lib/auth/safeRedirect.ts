const DEFAULT_AFTER_LOGIN = "/events";

/** Allow only same-origin relative paths (blocks open redirects). */
export function safeInternalPath(
  raw: string | null | undefined,
  fallback = DEFAULT_AFTER_LOGIN,
): string {
  if (!raw) return fallback;

  const next = raw.trim();
  if (!next.startsWith("/") || next.startsWith("//")) return fallback;
  if (next.includes("\\") || next.includes(":")) return fallback;
  if (next === "/login") return fallback;

  return next;
}

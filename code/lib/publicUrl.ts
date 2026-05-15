/**
 * Canonical base URL for RSVP links and emails (no trailing slash, always http(s)).
 * In production on a custom domain, set APP_BASE_URL explicitly — do not rely only on
 * VERCEL_URL if you use a branded hostname or deployment previews.
 */
export function getPublicBaseUrl(): string {
  const explicit = process.env.APP_BASE_URL?.trim();
  if (explicit) {
    const noTrail = explicit.replace(/\/$/, "");
    if (/^https?:\/\//i.test(noTrail)) return noTrail;
    if (/^localhost(:\d+)?$/i.test(noTrail) || /^127\.\d+\.\d+\.\d+(:\d+)?$/i.test(noTrail)) {
      return `http://${noTrail}`;
    }
    return `https://${noTrail}`;
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export const RSVP_DIETARY_MAX = 500;

export function clampDietaryPreference(raw: string): string {
  return raw.trim().slice(0, RSVP_DIETARY_MAX);
}

export function looksLikeEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

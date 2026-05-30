export const RSVP_DIETARY_MAX = 500;
export const EMAIL_MAX_LENGTH = 254;
export const PHONE_MIN_DIGITS = 10;
export const PHONE_MAX_DIGITS = 15;

export type FieldValidation =
  | { ok: true; value: string }
  | { ok: false; error: string };

export function clampDietaryPreference(raw: string): string {
  return raw.trim().slice(0, RSVP_DIETARY_MAX);
}

/** @deprecated Use validateEmail or parseOptionalEmail */
export function looksLikeEmail(s: string): boolean {
  const trimmed = s.trim();
  if (!trimmed) return false;
  return validateEmail(trimmed).ok;
}

function isValidEmailFormat(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at <= 0 || at === email.length - 1) return false;

  const local = email.slice(0, at);
  const domain = email.slice(at + 1);

  if (local.length > 64 || domain.length > 253) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) return false;
  if (!domain.includes(".")) return false;

  const localPattern = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i;
  const domainPattern =
    /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

  return localPattern.test(local) && domainPattern.test(domain);
}

export function validateEmail(raw: string): FieldValidation {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Email address is required." };
  }

  const normalized = trimmed.toLowerCase();
  if (normalized.length > EMAIL_MAX_LENGTH) {
    return { ok: false, error: "Email address is too long." };
  }

  if (!isValidEmailFormat(normalized)) {
    return {
      ok: false,
      error: "Please enter a valid email address (e.g. name@example.com).",
    };
  }

  return { ok: true, value: normalized };
}

export function parseOptionalEmail(
  raw: string,
): { ok: true; email: string | null } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: true, email: null };
  }

  const result = validateEmail(trimmed);
  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return { ok: true, email: result.value };
}

export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (!/^\+?[\d\s().-]+$/.test(trimmed)) return null;

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < PHONE_MIN_DIGITS || digits.length > PHONE_MAX_DIGITS) return null;

  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

export function validatePhone(raw: string): FieldValidation {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Phone number is required." };
  }

  const normalized = normalizePhone(trimmed);
  if (!normalized) {
    return {
      ok: false,
      error:
        "Please enter a valid phone number: 10–15 digits, optional + country code (e.g. +1 555 123 4567).",
    };
  }

  return { ok: true, value: normalized };
}

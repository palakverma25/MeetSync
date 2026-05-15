import { getPublicBaseUrl } from "@/lib/publicUrl";

export type SendRsvpInviteResult =
  | { ok: true; skipped?: false }
  | { ok: false; error: string }
  | { ok: true; skipped: true; reason: string };

type Args = {
  to: string;
  guestName: string;
  eventTitle: string;
  eventVenue: string;
  eventDateLabel: string;
  rsvpToken: string;
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Avoid SMTP header injection if event titles ever contain newlines. */
function oneLine(s: string, max: number) {
  return s.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

export async function sendRsvpInviteEmail(args: Args): Promise<SendRsvpInviteResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  const base = getPublicBaseUrl();
  const pathToken = encodeURIComponent(args.rsvpToken);
  const url = `${base}/rsvp/${pathToken}`;

  if (!apiKey || !from) {
    return {
      ok: true,
      skipped: true,
      reason:
        "Email is not configured (set RESEND_API_KEY and EMAIL_FROM). Use Copy RSVP link on the roster instead.",
    };
  }

  const subject = `RSVP: ${oneLine(args.eventTitle, 200)}`;
  const guestName = oneLine(args.guestName, 200);
  const eventTitle = oneLine(args.eventTitle, 300);
  const eventVenue = oneLine(args.eventVenue, 500);
  const eventDateLabel = oneLine(args.eventDateLabel, 200);
  const toEmail = oneLine(args.to, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
    return { ok: false, error: "Invalid recipient email address." };
  }

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #1c1917;">
  <p>Hi ${escapeHtml(guestName)},</p>
  <p>You’re invited to <strong>${escapeHtml(eventTitle)}</strong>.</p>
  <p>${escapeHtml(eventVenue)}<br>${escapeHtml(eventDateLabel)}</p>
  <p><a href="${escapeHtml(url)}" style="display:inline-block;margin-top:12px;padding:12px 20px;background:#0d9488;color:#fff;text-decoration:none;border-radius:9999px;font-weight:600;">Respond to invitation</a></p>
  <p style="font-size:13px;color:#78716c;">If the button doesn’t work, paste this link into your browser:<br>${escapeHtml(url)}</p>
  <p style="font-size:13px;color:#78716c;">— MeetSync</p>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [toEmail],
      subject,
      html,
    }),
  });

  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;

  if (!res.ok) {
    const msg =
      typeof json.message === "string"
        ? json.message
        : `Resend error (${res.status})`;
    return { ok: false, error: msg };
  }

  return { ok: true };
}

# MeetSync — Product design

How we framed the problem, what we shipped, and what we deliberately left out.

## Who this is for

A small events team runs on the order of **30 events a year** with about **30 people** in ops. Day to day they live in **WhatsApp** and **spreadsheets**: who’s invited, dietary notes, **+1s**, **paper lists at the door**, and later “**who actually came?**” so they can invite the right people next time.

**MeetSync is an internal tool** — not a public consumer app.

## How the app is laid out

- **Marketing:** `/` (home) and `/features` — explains the product, no dashboard chrome.
- **Dashboard:** `/events` (overview), `/events/new` (create an event), `/events/[id]` (roster: filter, no-shows, add guests).
- **Door mode:** `/events/[id]/check-in` — full-screen, dark, no sidebar, built for phones at the entrance.

## What we focused on

One job: **check people in fast** and leave a **clear attendance record** after the night — so printed lists and spreadsheet back-and-forth are not the bottleneck at the door.

Staff can:

- Scan **upcoming and recent events** with capacity, roster size, confirmed RSVPs, and how many are already checked in.
- Work the **roster**: add walk-ins or late RSVPs, and spot **no-shows** (confirmed but never checked in).
- Use **check-in mode**: big tap targets, search by name or phone, **one tap to check in**, safe if someone taps twice, with **undo** when needed.
- **Walk-ins at the door** are added from the **event roster** (not the check-in screen) so door staff search and tap without a second “add guest” flow on the same page.
- **Export who attended as CSV** for Excel and the next round of invites.
- **Email self-RSVP:** each guest on the roster gets a **secret link** (`/rsvp/[token]`). With **Resend** configured, the organizer can send that link by email; otherwise they **copy the link** from the roster. The guest submits **Attending / Not sure / Can’t make it** plus dietary and +1; the roster updates the same `rsvpStatus` as the dashboard dropdown.

## Why only this (for now)

We had about a **weekend-sized** window. The biggest win was **reliable check-in** and **trustworthy “who showed up”** — not another chat thread or column jungle. A **searchable, thumb-friendly list** beats spreadsheet detail for someone standing at the door.

**We did not build** (yet): payments, calendar sync, SMS, QR at the door, multi-tenant SaaS, or full role-based access control. **Public RSVP** here means a **tokenized link per guest** (no login), not a branded consumer RSVP site.

**Email RSVP today** uses **Resend** (or copy-link only): links include an unguessable token; treat links like passwords.

**WhatsApp RSVP** (organizer `wa.me` link or inbound replies → roster) is **not in the UI for now**; ops may still coordinate in WhatsApp manually. **Automatically turning inbound messages into roster rows** needs Meta’s **WhatsApp Business / Cloud API** — future work.

## Email invites

- Sent through **Resend** when `RESEND_API_KEY` and `EMAIL_FROM` are set; RSVP links use `APP_BASE_URL` (or `VERCEL_URL` on Vercel) so buttons work in production.
- Without Resend, organizers **copy the RSVP link** from the roster.

## Staff authentication

Ops sign in at **`/login`** with email + password. On success the server sets an **httpOnly JWT cookie** (`meetsync_token`, HS256, 8-hour lifetime).

| Layer | What it protects |
| ----- | ---------------- |
| **Middleware** | `/events/*`, `/api/events/*` — redirects to login or returns 401 |
| **Layouts** | Dashboard shells call `requireAuth()` |
| **Server actions** | Every mutation in `app/actions.ts` |
| **API handlers** | `requireApiAuth()` on each `/api/events/*` route |

**Still public:** `/`, `/features`, `/login`, `/rsvp/[token]` (guest token, not staff JWT).

**Bootstrap:** `npm run db:seed:admin` creates the admin user locally (use production `DATABASE_URL` once for prod). Set **`JWT_SECRET`** (32+ random chars) on Vercel — do **not** store `ADMIN_PASSWORD` in Vercel runtime env.

Passwords stored with **bcrypt** (12 rounds). No public self-registration — admin seed + future user management.

## When something was unclear, we picked…

| Question | What we did |
| -------- | ----------- |
| **Logins** | **JWT in httpOnly cookie** — staff sign in at `/login` (email + password, bcrypt). Dashboard and `/api/events/*` require auth; guest `/rsvp/[token]` stays public. Seed admin: `npm run db:seed:admin`. Set `JWT_SECRET` (32+ chars) in production. |
| **RSVP states** | **Confirmed**, **pending**, **declined**. Only **confirmed** guests can be checked in, so we don’t treat declines as attendees. |
| **Live counts** | Refresh from the server after each action — **no WebSockets**. Fine for one or two people at the door. |
| **Guest RSVP** | **Email:** token link → guest form → updates roster. |
| **+1** | One **yes/no flag** on the guest row (not a separate person row). Enough for catering notes for v1. |
| **Capacity** | **Informational only** — shown on events and the roster for planning; we do **not** block adding guests over capacity in v1. |
| **Duplicate event names** | **Allowed** — events are keyed by unique `id`, not title (annual “Summer Gala” is fine). UI shows **date · venue** under every title so ops can tell them apart. Creating an event with the **same name on the same calendar date** shows a **warning** and optional **Create anyway** (does not block different years or different dates). |
| **Two devices editing** | **PostgreSQL** with **last-write-wins** on the same row is acceptable for v1. Stronger concurrency or versioning would come with production hardening. |

## How we’d know it worked

- Find someone by **part of their name or phone** in a couple of seconds.
- Check-in feels like **one obvious tap**; double taps don’t create nonsense duplicate timestamps.
- After the event, ops can say **who attended** using **CSV** and the **no-show list** — without reconstructing it from paper.

## Ideas for later

- QR or short **guest codes** for self check-in.
- **SMS / email** nudges and thank-yous after the event.
- **Deduplicate people** across events for “regulars” and simple analytics.
- **PostgreSQL** and real **authentication** when we outgrow the pilot setup.
- **WhatsApp replies → roster:** Cloud API + webhook that creates or updates guests **idempotently** so retries don’t duplicate rows.

### Invite templates (Canva-style)

Reusable invite layouts (dates, venue, dress code, clear RSVP/WhatsApp CTA). Send or export for **email** and **WhatsApp** with minimal edits each time. Optional brand kit and “preview before send” so mistakes don’t scale with volume.

### Several organizers, one roster

Today one dashboard owns the list; in real life people still coordinate in WhatsApp or sheets. **Later:** multiple organizers edit the same guest list **at the same time** without overwriting each other — likely with **CRDT-style sync** (tools like Yjs / Automerge, or a hosted equivalent), plus **roles** (view / edit / door-only) and **one clear list** at check-in.

### Repeat guests and the next invite

Use **who actually attended** (and separate **no-shows** and **walk-ins**) so follow-up messages match reality. **“Everyone who came to event X”** as a starting point for the next list, with dedupe. When messaging exists, light **save-the-date → reminder → day-before** sequences on the channel guests already use.

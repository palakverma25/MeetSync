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
- **Export who attended as CSV** for Excel and the next round of invites.
- **Share a WhatsApp RSVP link** from the roster (`wa.me` prefilled message) when a WhatsApp number is set up.

## Why only this (for now)

We had about a **weekend-sized** window. The biggest win was **reliable check-in** and **trustworthy “who showed up”** — not another chat thread or column jungle. A **searchable, thumb-friendly list** beats spreadsheet detail for someone standing at the door.

**We did not build** (yet): public RSVP websites, payments, calendar sync, SMS, QR at the door, multi-tenant SaaS, or full role-based access control.

**WhatsApp RSVP today** is an **organizer-shared link**; guests message **your** WhatsApp number. **Automatically turning inbound messages into roster rows** needs Meta’s **WhatsApp Business / Cloud API** (webhooks, stable hosting) — that’s future work, not this repo.

## On the door device

- **Browser notifications** (and vibration where supported) when a guest is checked in — only after the user allows notifications on that device.
- Guests are **not** “pushed” from our servers; they use normal WhatsApp through the link you share.

## When something was unclear, we picked…

| Question | What we did |
| -------- | ----------- |
| **Logins** | **None for the MVP.** Treat the app as running on a **trusted network** (VPN / office), or add a shared secret later. We’re honest that this is a tradeoff. |
| **RSVP states** | **Confirmed**, **pending**, **declined**. Only **confirmed** guests can be checked in, so we don’t treat declines as attendees. |
| **Live counts** | Refresh from the server after each action — **no WebSockets**. Fine for one or two people at the door. |
| **+1** | One **yes/no flag** on the guest row (not a separate person row). Enough for catering notes for v1. |
| **Two devices editing** | **SQLite** with **last-write-wins** on the same row is acceptable for v1. A hosted DB (and maybe versioning) would come with production hardening. |

## How we’d know it worked

- Find someone by **part of their name or phone** in a couple of seconds.
- Check-in feels like **one obvious tap**; double taps don’t create nonsense duplicate timestamps.
- After the event, ops can say **who attended** using **CSV** and the **no-show list** — without reconstructing it from paper.

## Ideas for later

- QR or short **guest codes** for self check-in.
- **Offline-first** or a PWA when the venue Wi-Fi is weak.
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

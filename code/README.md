# MeetSync — `code`

Internal **event check-in and attendance** dashboard. See repository root [`DESIGN.md`](../DESIGN.md) and [`TOOLS.md`](../TOOLS.md).

## Requirements

- Node.js 20+
- npm

## Setup

```bash
cd code
cp .env.example .env
npm install
npm run db:push
```

If Prisma warns when upgrading an older database, use `npx prisma db push --accept-data-loss` once, or run `npm run db:seed` for a fresh sample dataset.

```bash
npm run db:seed   # optional: sample events (wipes attendees/events)
npm run dev
```

### Email RSVP (optional)

To **send** invite emails from the roster, add to `.env`:

- `RESEND_API_KEY` — from [Resend](https://resend.com)
- `EMAIL_FROM` — e.g. `MeetSync <onboarding@resend.dev>` for testing
- `APP_BASE_URL` — e.g. `http://localhost:3000` (used in links; on Vercel, `VERCEL_URL` is a fallback)

Without Resend, organizers still use **Copy RSVP link** on each roster row. Guests always open `/rsvp/…` in the browser to respond.

Open [http://localhost:3000](http://localhost:3000) for the **landing page**, then use **Open app** or go to [`/events`](http://localhost:3000/events) for the dashboard. Each event has its own **roster** (`/events/[id]`) and **check-in** (`/events/[id]/check-in`). Product detail page: [`/features`](http://localhost:3000/features).

## Scripts

| Script        | Description                |
| ------------- | -------------------------- |
| `npm run dev` | Development server         |
| `npm run build` | Production build (runs `prisma generate`) |
| `npm run db:push` | Apply schema to SQLite   |
| `npm run db:seed` | Load sample events and attendees |

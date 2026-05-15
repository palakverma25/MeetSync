# MeetSync — `code`

Internal **event check-in and attendance** dashboard. See repository root [`DESIGN.md`](../DESIGN.md) and [`TOOLS.md`](../TOOLS.md). Deploy: root [`README.md`](../README.md).

## Requirements

- Node.js 20+
- npm
- **PostgreSQL** (local Docker, [Neon](https://neon.tech) free tier, etc.)

## Setup

```bash
cd code
cp .env.example .env
# Edit .env: set DATABASE_URL to PostgreSQL (see .env.example)
npm install
npm run db:migrate
```

Create and apply new migrations after schema changes:

```bash
npm run db:migrate:dev -- --name describe_change
```

For a fresh sample dataset (wipes events and attendees):

```bash
npm run db:seed   # optional
npm run dev
```

### Email RSVP (optional)

To **send** invite emails from the roster, add to `.env`:

- `RESEND_API_KEY` — from [Resend](https://resend.com)
- `EMAIL_FROM` — e.g. `MeetSync <onboarding@resend.dev>` for testing
- `APP_BASE_URL` — e.g. `http://localhost:3000` (used in links; on Vercel, `VERCEL_URL` is a fallback if unset)

Without Resend, organizers still use **Copy RSVP link** on each roster row. Guests always open `/rsvp/…` in the browser to respond.

Open [http://localhost:3000](http://localhost:3000) for the **landing page**, then use **Open app** or go to [`/events`](http://localhost:3000/events) for the dashboard. Each event has its own **roster** (`/events/[id]`) and **check-in** (`/events/[id]/check-in`). Product detail page: [`/features`](http://localhost:3000/features).

## Scripts

| Script        | Description                |
| ------------- | -------------------------- |
| `npm run dev` | Development server         |
| `npm run build` | Production build (`prisma generate`, `prisma migrate deploy`, `next build`) |
| `npm run db:migrate` | Apply migrations (CI / production) |
| `npm run db:migrate:dev` | Create/apply migrations in development |
| `npm run db:push` | Push schema without migration files (prototyping only) |
| `npm run db:seed` | Load sample events and attendees |

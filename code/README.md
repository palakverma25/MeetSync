# MeetSync app

Next.js dashboard for events, rosters, check-in, and `/rsvp/[token]` guest responses.

## Setup

```bash
cp .env.example .env
npm install
npm run db:up          # local Postgres (Prisma dev — no Docker required)
npm run db:migrate
npm run db:seed:admin  # creates admin from ADMIN_* in .env (see .env.example)
npm run dev
```

After `db:up`, copy the `postgres://…` URL from the terminal into `.env` as `DATABASE_URL` if the port differs from `.env.example`.

`.env` must use a `postgresql://` or `postgres://` URL — not `file:./…` (SQLite). For hosted DBs (Neon, Vercel Postgres), replace `DATABASE_URL` with your connection string. Optional Docker Postgres: `npm run db:up:docker` and use the URL in `docker-compose.yml`.

Open [http://localhost:3000/events](http://localhost:3000/events) — you’ll be redirected to sign in.

After `db:seed:admin`, sign in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env`. For local dev only, if you omit `ADMIN_PASSWORD`, the script uses a documented dev default — **never use that on Vercel/production**.

Optional sample data: `npm run db:seed` (wipes events and attendees).

## Email invites (optional)

In `.env`:

- `RESEND_API_KEY` — [Resend](https://resend.com)
- `EMAIL_FROM` — e.g. `MeetSync <onboarding@resend.dev>` for testing
- `APP_BASE_URL` — e.g. `http://localhost:3000`

Without Resend, use **Copy link** on the roster. On Vercel, set the same vars in the project dashboard.

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Apply DB migrations |
| `npm run db:seed` | Sample events (optional) |
| `npm run db:seed:admin` | Create/update admin user for sign-in |

Deploy: [`../README.md`](../README.md).

# MeetSync app

Next.js dashboard for events, rosters, check-in, and `/rsvp/[token]` guest responses.

## Setup

```bash
cp .env.example .env   # set DATABASE_URL to PostgreSQL (not SQLite)
npm install
npm run db:migrate
npm run dev
```

Open [http://localhost:3000/events](http://localhost:3000/events).

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

Deploy: [`../README.md`](../README.md).

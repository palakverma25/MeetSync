# MeetSync

Event check-in and self-serve email RSVP. Application code lives in **[`code/`](./code/)** (Next.js + Prisma).

## Deploy on Vercel

1. Push this repo to GitHub and **import** it in [Vercel](https://vercel.com).
2. Set **Root Directory** to `code` (Framework Preset: Next.js).
3. Add **Environment variables** (Production — add Preview too if you want email/DB there):

   | Name | Example |
   |------|---------|
   | `DATABASE_URL` | PostgreSQL connection string ([Neon](https://neon.tech), Supabase, etc.) — **not** SQLite |
   | `APP_BASE_URL` | `https://your-project.vercel.app` or your custom domain (no trailing slash) |
   | `RESEND_API_KEY` | From [Resend](https://resend.com) (optional; omit to use “Copy RSVP link” only) |
   | `EMAIL_FROM` | e.g. `MeetSync <invites@yourdomain.com>` (domain verified in Resend) |

4. Deploy. The build runs `prisma migrate deploy` then `next build`, which creates tables on first deploy.

### Deploy with Vercel CLI

From `code/` (requires `npx vercel login` once):

```bash
cd code
npx vercel env add DATABASE_URL   # paste your postgresql://… URL (Production + Preview if prompted)
npx vercel deploy --prod --yes
```

Without **`DATABASE_URL`** on Vercel, `npm run build` fails — Prisma cannot run migrations. Optional vars (`APP_BASE_URL`, Resend) work the same way (`npx vercel env add …`) or in the dashboard.

Local **`code/.env` is not uploaded** (see **`code/.vercelignore`**), so secrets belong only in Vercel env vars.

## Local development

See **[`code/README.md`](./code/README.md)** for setup, including a PostgreSQL `DATABASE_URL` and `npm run db:migrate`.

Design notes: [`DESIGN.md`](./DESIGN.md) · Tooling: [`TOOLS.md`](./TOOLS.md).

# MeetSync

Event check-in and self-serve email RSVP. Application code lives in **[`code/`](./code/)** (Next.js + Prisma).

## Deploy on Vercel

1. Push this repo to GitHub and **import** it in [Vercel](https://vercel.com).
2. Set **Root Directory** to `code` (Framework Preset: Next.js).
3. **Database (recommended: Neon via Vercel)** — from your machine, in `code/` (after `npx vercel login` and linking the project):

   ```bash
   cd code
   npx vercel --non-interactive integration accept-terms neon --yes
   npx vercel --non-interactive integration add neon -e production -e preview
   ```

   That provisions Postgres and sets **`DATABASE_URL`** (and related Neon variables) on Vercel for production and preview.

   **Alternative:** create a database in [Neon](https://neon.tech) or Supabase and add **`DATABASE_URL`** manually under **Project → Settings → Environment Variables** (must be `postgresql://…`).

4. **App URL & email (optional)** — set **`APP_BASE_URL`** to your stable production URL (e.g. `https://your-project.vercel.app`, no trailing slash). Add **`RESEND_API_KEY`** and **`EMAIL_FROM`** if you want RSVP emails from production. After you have those in local **`code/.env`**, you can push them to Vercel:

   ```bash
   cd code
   npm run vercel:push-env
   ```

5. Deploy (Git push to the connected branch, or `npx vercel --non-interactive deploy --prod` from `code/`). The build runs `prisma migrate deploy` then `next build`.

### If the site returns 401 in the browser

Your Vercel team may have **Deployment Protection** enabled. In Vercel: **Project → Settings → Deployment Protection** and allow public access for production (or complete the login gate).

### CLI-only env (without Neon integration)

```bash
cd code
npx vercel env add DATABASE_URL   # paste postgresql://… for Production (and Preview if needed)
npx vercel --non-interactive deploy --prod
```

Without **`DATABASE_URL`** on Vercel, `npm run build` fails — Prisma cannot run migrations.

Local **`code/.env` is not uploaded** to Vercel builds (see **`code/.vercelignore`**); use the dashboard or `vercel env add` for secrets.

## Local development

See **[`code/README.md`](./code/README.md)** for setup, including a PostgreSQL `DATABASE_URL` and `npm run db:migrate`.

Design notes: [`DESIGN.md`](./DESIGN.md) · Tooling: [`TOOLS.md`](./TOOLS.md).

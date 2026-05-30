# MeetSync

Event roster, door check-in, and guest RSVP links. App code is in [`code/`](./code/) (Next.js, Prisma, PostgreSQL).

## Local development

See [`code/README.md`](./code/README.md).

## Deploy on Vercel

1. Import the repo; set **Root Directory** to `code`.
2. Add **PostgreSQL** — e.g. [Neon](https://neon.tech) via Vercel’s Neon integration, or set `DATABASE_URL` (`postgresql://…`) in project env vars.
3. Optional: `APP_BASE_URL`, `JWT_SECRET` (32+ chars, required), `ADMIN_EMAIL` / `ADMIN_PASSWORD` for `npm run db:seed:admin`, `RESEND_API_KEY`, `EMAIL_FROM`.
4. Deploy. Build runs migrations then `next build`.

**Guest RSVP links show a Vercel login?** Turn off **Deployment Protection / SSO** for production (Project → Settings → Deployment Protection), or run from `code/`: `npx vercel project protection disable code --sso`.

More: [`DESIGN.md`](./DESIGN.md) · [`TOOLS.md`](./TOOLS.md)

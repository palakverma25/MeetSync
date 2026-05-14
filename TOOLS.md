# MeetSync — Tools and stack

This is what the project is built with, and why those choices made sense for a small, fast internal tool.

## What we use (at a glance)

| Piece | Choice | In plain terms |
| ----- | ------ | -------------- |
| UI | **React 19** with **Next.js App Router** | Good for snappy lists on the server, and a familiar way to build the interactive check-in screen. |
| Language | **TypeScript (strict)** | Catches mistakes early when we pass around guest data and API payloads. |
| Styling | **Tailwind CSS v4** | Lets us lay out a **mobile-first** door flow quickly without writing a lot of custom CSS. |
| App shell | **Next.js 15** | One codebase for pages, small REST endpoints, server actions for saves, and a straightforward path to hosting later. |
| Data layer | **Prisma** | We describe `Event` and `Attendee` in a schema, get typed queries, and use `db push` while iterating. |
| Database | **SQLite** | No extra server to run for a weekend build; a file database is enough for an internal pilot. We can swap to **PostgreSQL** later without throwing away the Prisma work. |
| Runtime | **Node.js 20** | What Next.js expects; keeps local and deploy environments aligned. |

## Things we did *not* reach for (and why)

- **PostgreSQL from day one** — Great when you have real concurrency and hosting lined up. **SQLite** kept setup instant and fine for “one team, one machine” while we proved the flow.
- **TanStack Query** — Shines when the browser holds a big client-side cache. Here we lean on **server actions**, **`revalidatePath`**, and **`router.refresh()`** so the UI stays simple.
- **WebSockets** — Nice for live dashboards; **refreshing after each check-in** matched the brief with less moving parts.
- **Separate React SPA + Express API** — Totally valid; we wanted **one deployable app** and less glue for this scope, so **Next.js** carried both jobs.

## AI help

LLMs helped with early **scaffolding** (project layout), **rough schema ideas**, and **UI structure**. Anything that touches **security**, **RSVP rules**, **idempotent check-in**, and **product tradeoffs** was reviewed and tightened by hand so the result reflects intentional choices, not copy-paste defaults.

## Day-to-day commands

For `npm run db:push`, `db:seed`, `dev`, and the rest, see [`code/README.md`](code/README.md).

## Optional REST API

The main app talks to the server through **server actions**. If you want to script things or hit the app from outside the UI, these routes exist:

- `GET /api/events` — events with counts  
- `GET /api/events/:id` — one event and its attendees  
- `POST /api/events/:id/attendees` — add a guest (JSON body)  
- `PATCH /api/events/:id/attendees/:attendeeId` — `{ "action": "checkIn" }` or `"undoCheckIn"`  
- `GET /api/events/:id/export` — CSV of checked-in guests  

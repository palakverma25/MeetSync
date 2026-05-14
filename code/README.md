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
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the **landing page**, then use **Open app** or go to [`/events`](http://localhost:3000/events) for the dashboard. Each event has its own **roster** (`/events/[id]`) and **check-in** (`/events/[id]/check-in`). Product detail page: [`/features`](http://localhost:3000/features).

## Scripts

| Script        | Description                |
| ------------- | -------------------------- |
| `npm run dev` | Development server         |
| `npm run build` | Production build (runs `prisma generate`) |
| `npm run db:push` | Apply schema to SQLite   |
| `npm run db:seed` | Load sample events and attendees |

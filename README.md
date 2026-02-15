# SG Weekend Planner (MVP)

A private-family web app MVP to rank and plan weekend activities in Singapore for a young child.

## What is implemented

- Preferences form for all requested criteria:
  - indoor/outdoor, budget, duration, energy level, distance, age, weather tolerance, timing, free-text intent.
- AI-assisted ranking pipeline:
  - rule-based scoring + optional OpenAI reranking.
- Itinerary planner:
  - morning/afternoon/evening slots with fallback recommendations.
- Weekly sync scaffold:
  - `/api/sync` endpoint + Vercel cron schedule (weekly).

## Stack

- Next.js 14 + TypeScript
- Optional OpenAI API integration for reranking
- Designed for Vercel deploy

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env.local
```

Add at least:

- `SYNC_SECRET=...`
- `OPENAI_API_KEY=...` (optional but recommended)

3. Run dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push to GitHub.
2. Import project in Vercel.
3. Set env vars from `.env.example`.
4. Keep `vercel.json` cron enabled for weekly sync.

## Next steps (planned)

- Add Supabase schema and persistence.
- Replace sample dataset with source connectors for Singapore event calendars + evergreen places.
- Add travel-time via maps API and weather-based fallback scoring.
- Add household login/profile when making app public.

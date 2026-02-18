# GymPulse Landing (Next.js + Tailwind)

Premium dark SaaS landing for GymPulse OS.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Early access form

The form posts to `/api/early-access`. In local dev it appends requests into:

`data/early-access.jsonl`

> Note: on Vercel/serverless, file writes are not persistent. Replace this with Postgres, Airtable, Google Sheets, HubSpot, etc.

## Next steps (recommended)

- Add i18n (PT/EN) with `next-intl` or `next-i18next`
- Add analytics (Plausible / PostHog / GA4)
- Add a real dashboard mock image or interactive demo

# AIRAB Money

AIRAB Money is a financial media and podcast platform for the Arab world and GCC region — three weekly shows (Money Moves, Wisdom Wednesday, Future Friday), plus articles, blog posts, live market data, and a guest application flow.

It is a Vite + React frontend with an Express API backed by Postgres via Prisma. The backend is fully local to this repo and is configured to use a Railway Postgres database through `DATABASE_URL`.

## Stack

- Frontend: React 18, Vite, TypeScript, Tailwind, Radix UI
- Backend: Express 5 + Prisma ORM (TypeScript)
- Database: PostgreSQL (Railway)
- Uploads: multer → local volume mounted at `UPLOAD_DIR`, served from `/media`
- AI: OpenAI (optional; graceful fallback when not configured)
- Market data: Finnhub (optional; graceful fallback to indicative snapshot)
- Email: Resend (optional; required for newsletter confirmation flow)
- Hosting: `nixpacks.toml` is configured for Railway single-service deploys

## Environment

Copy `.env.example` → `.env` and provide:

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | ✅ | Railway Postgres connection string |
| `ADMIN_PASSWORD` | ✅ | Password for `/admin` panel and admin-only API actions |
| `OPENAI_API_KEY` | optional | Enables AI article + image generation |
| `OPENAI_TEXT_MODEL` | optional | Defaults to `gpt-4o-mini` |
| `OPENAI_IMAGE_MODEL` | optional | Defaults to `dall-e-3` |
| `FINNHUB_API_KEY` | optional | Enables live quotes on `/markets` |
| `RESEND_API_KEY` | optional | Enables newsletter confirmation emails |
| `RESEND_FROM_EMAIL` | optional | From address for confirmation emails |
| `UPLOAD_DIR` | optional | Directory for podcast audio + image uploads. Defaults to `./uploads` in dev; set to a persistent volume mount (e.g. `/data/uploads`) in production |
| `PUBLIC_BASE_URL` | optional | Used to build confirm/unsubscribe links in emails. No trailing slash |
| `VITE_ENABLE_VOICE_DEMO` | optional | Set to `true` to expose `/demo` |
| `PORT` | optional | Defaults to `3001` |

## Local Development

```sh
npm install
cd server && npm install
```

Push the Prisma schema (creates the new `Presenter` model and the newsletter confirmation fields):

```sh
cd server
npm run db:push
```

Seed demo content (presenters, articles, blog posts, placeholder episodes):

```sh
cd server
npm run seed
```

Run the frontend and backend in separate terminals:

```sh
npm run dev
```

```sh
cd server
npm run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:3001`.

## Admin panel

- Navigate to `/admin` and log in with `ADMIN_PASSWORD`.
- Tabs cover: Article Generator, Prompt Templates, Articles, **Episodes** (upload MP3s, manage episodes), **Blog**, **Presenters**, and **Inbox** (subscribers CSV export, contact messages, guest applications).

## Production Build

```sh
npm run build
```

The production server serves the built frontend from `dist/` and the API from the same process. Uploaded media is served from `/media` via the path in `UPLOAD_DIR`.

## Deploying on Railway

1. Create a Railway service pointing at this repo. `nixpacks.toml` handles install + build + start.
2. **Attach a Railway Volume** mounted at `/data/uploads` (or any path) and set `UPLOAD_DIR` to match. Railway's default filesystem is ephemeral and will lose uploaded audio/images on redeploy.
3. Set `DATABASE_URL`, `ADMIN_PASSWORD`, `PUBLIC_BASE_URL`, and any optional keys you want enabled.
4. After first deploy, run `npm --prefix server run seed` from a Railway shell if you want demo content.

Before deploying on Railway, make sure the service has the same environment variables defined, especially `DATABASE_URL` from your Railway Postgres instance.

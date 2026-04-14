# AIRAB Money

AIRAB Money is a Vite + React frontend with an Express API backed by Postgres via Prisma. The backend is fully local to this repo and is configured to use a Railway Postgres database through `DATABASE_URL`.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind
- Backend: Express, TypeScript
- Database: Railway Postgres via Prisma
- Hosting: `nixpacks.toml` is configured for Railway single-service deploys

## Environment

Copy `.env.example` and provide:

- `DATABASE_URL`: your Railway Postgres connection string
- `ADMIN_PASSWORD`: required password for the `/admin` panel and admin-only API actions
- `OPENAI_API_KEY`: optional, enables AI article and image generation
- `OPENAI_TEXT_MODEL`: optional, defaults to `gpt-4o-mini`
- `OPENAI_IMAGE_MODEL`: optional, defaults to `gpt-image-1`
- `PORT`: optional, defaults to `3001`

For local backend development, place the env file in `/Users/sayedbaharun/Downloads/airab-money/server/.env` or export the variables in your shell before starting the server.

## Local Development

Install dependencies:

```sh
npm install
cd server && npm install
```

Push the Prisma schema to your Railway Postgres database:

```sh
cd server
npm run db:push
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

## Production Build

```sh
npm run build
```

The production server serves the built frontend from `dist/` and the API from the same process.

## Deploying

`nixpacks.toml` is configured for Railway to:

1. install root and server dependencies
2. run `prisma db push` against `DATABASE_URL`
3. build the frontend
4. start the Express server

Before deploying on Railway, make sure the service has the same environment variables defined, especially `DATABASE_URL` from your Railway Postgres instance.
